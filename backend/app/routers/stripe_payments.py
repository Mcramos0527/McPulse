import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from app.config import settings
from app.middleware.auth import get_current_user
from app.database import supabase_client
from app.models.schemas import CheckoutRequest

stripe.api_key = settings.stripe_secret_key

router = APIRouter()

PLAN_PRICES = {
    "starter": settings.stripe_starter_price_id,
    "growth": settings.stripe_growth_price_id,
}


@router.post("/checkout")
async def create_checkout(req: CheckoutRequest, user: dict = Depends(get_current_user)):
    user_id = user["sub"]
    user_email = user.get("email", "")

    price_id = PLAN_PRICES.get(req.plan)
    if not price_id:
        raise HTTPException(400, detail="Invalid plan")

    # Get or create Stripe customer
    profile = supabase_client.table("profiles").select("stripe_customer_id, email").eq("id", user_id).single().execute()
    customer_id = profile.data.get("stripe_customer_id") if profile.data else None

    if not customer_id:
        customer = stripe.Customer.create(email=user_email or profile.data.get("email", ""))
        customer_id = customer.id
        supabase_client.table("profiles").update({"stripe_customer_id": customer_id}).eq("id", user_id).execute()

    session = stripe.checkout.Session.create(
        customer=customer_id,
        payment_method_types=["card"],
        line_items=[{"price": price_id, "quantity": 1}],
        mode="subscription",
        success_url=f"{settings.frontend_url}/dashboard?upgraded=true",
        cancel_url=f"{settings.frontend_url}/pricing",
        metadata={"user_id": user_id, "plan": req.plan},
    )

    return {"checkout_url": session.url}


@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, settings.stripe_webhook_secret)
    except Exception as e:
        raise HTTPException(400, detail=str(e))

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        user_id = session["metadata"].get("user_id")
        plan = session["metadata"].get("plan")
        subscription_id = session.get("subscription")

        if user_id and plan:
            supabase_client.table("profiles").update({
                "plan": plan,
                "stripe_subscription_id": subscription_id,
            }).eq("id", user_id).execute()

    elif event["type"] in ("customer.subscription.deleted", "customer.subscription.paused"):
        sub = event["data"]["object"]
        customer_id = sub["customer"]
        supabase_client.table("profiles").update({"plan": "free"}).eq("stripe_customer_id", customer_id).execute()

    return {"received": True}


@router.get("/subscription")
async def get_subscription(user: dict = Depends(get_current_user)):
    user_id = user["sub"]
    profile = supabase_client.table("profiles").select("plan, stripe_subscription_id, analyses_count").eq("id", user_id).single().execute()

    if not profile.data:
        return {"plan": "free", "analyses_count": 0}

    plan_limits = {"free": 1, "starter": 5, "growth": -1}
    plan = profile.data.get("plan", "free")

    return {
        "plan": plan,
        "analyses_count": profile.data.get("analyses_count", 0),
        "limit": plan_limits.get(plan, 1),
    }


@router.post("/cancel")
async def cancel_subscription(user: dict = Depends(get_current_user)):
    user_id = user["sub"]
    profile = supabase_client.table("profiles").select("stripe_subscription_id").eq("id", user_id).single().execute()
    sub_id = profile.data.get("stripe_subscription_id") if profile.data else None

    if not sub_id:
        raise HTTPException(400, detail="No active subscription")

    stripe.Subscription.modify(sub_id, cancel_at_period_end=True)
    return {"cancelled": True, "message": "Subscription will end at period end"}
