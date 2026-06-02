# MCPulse

> Take the pulse of your market before you build.

MCPulse is a SaaS application that validates startup ideas by surveying 50 synthetic AI-powered customer personas. Get an instant validation score and actionable insights about your market before investing time and capital.

## What It Does

MCPulse works in three simple steps:

1. **Describe** — Enter your product idea (problem, solution, target customer, price point)
2. **Survey** — 50 diverse synthetic personas are generated using OpenAI, each surveyed with realistic responses
3. **Report** — Get a validation score (0-100), ideal customer profile, top objections, and must-have features

Perfect for founders, product managers, and market researchers who need quick, data-driven feedback on new ideas.

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS, Supabase Auth
- **Backend:** FastAPI (Python 3.11+), uvicorn, async WebSockets
- **Database:** Supabase (PostgreSQL with Row Level Security)
- **LLM:** OpenAI API (GPT-4 recommended for persona generation)
- **Payments:** Stripe (subscription management)
- **Encryption:** AES-256 for storing OpenAI API keys

## Project Structure

```
McPulse/
├── frontend/              # Next.js 14 SPA
│   ├── app/               # App router (Next.js 14)
│   │   ├── page.tsx       # Landing page
│   │   ├── dashboard/     # Authenticated user dashboard
│   │   ├── report/        # Analysis report view
│   │   ├── auth/          # Login, signup, callback
│   │   └── onboarding/    # Plan selection
│   ├── components/        # Reusable React components
│   ├── lib/               # Utilities (Supabase client, API calls, state)
│   ├── package.json
│   └── .env.local.example
├── backend/               # FastAPI server
│   ├── app/
│   │   ├── main.py        # FastAPI app entry point
│   │   ├── config.py      # Settings & environment
│   │   ├── database.py    # Supabase client initialization
│   │   ├── models/        # Pydantic schemas
│   │   ├── routers/       # API endpoints
│   │   │   ├── analyses.py       # POST /analyses (create)
│   │   │   ├── stripe_payments.py# POST /stripe/webhook
│   │   │   ├── auth.py           # POST /auth/callback
│   │   │   └── websocket.py      # WS /ws/:analysis_id (streaming)
│   │   ├── services/      # Business logic
│   │   │   ├── icp_engine.py     # AI persona generation & survey
│   │   │   ├── stripe_service.py # Subscription & billing
│   │   │   └── encryption.py     # AES-256 key encryption
│   │   └── middleware/    # JWT auth, CORS
│   ├── supabase/
│   │   └── schema.sql     # Database schema
│   ├── requirements.txt
│   └── .env.example
└── README.md
```

## Setup

### Prerequisites

- **Node.js 18+** (frontend)
- **Python 3.11+** (backend)
- **Supabase account** (database & auth) — https://supabase.com
- **OpenAI API key** (users provide their own key)
- **Stripe account** (payment processing) — https://stripe.com

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a Python virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Copy the environment file and fill in your secrets:
   ```bash
   cp .env.example .env
   ```

4. Set up the Supabase database:
   - Go to https://supabase.com and create a new project
   - In the SQL Editor, paste the contents of `supabase/schema.sql`
   - Execute the script to create tables and policies

5. Start the backend:
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file:
   ```bash
   cp .env.local.example .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

## Environment Variables

### Backend `.env`

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Yes | Supabase project URL (from Settings > API) |
| `SUPABASE_SERVICE_KEY` | Yes | Supabase service role key (from Settings > API) |
| `SUPABASE_JWT_SECRET` | Yes | JWT secret from Supabase (from Settings > API) |
| `ENCRYPTION_KEY` | Yes | 32-byte base64 key for AES-256 encryption of API keys. Generate: `python -c "import base64, os; print(base64.b64encode(os.urandom(32)).decode())"` |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret API key (from Dashboard > Developers > API keys) |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret (from Dashboard > Developers > Webhooks) |
| `STRIPE_STARTER_PRICE_ID` | Yes | Stripe price ID for Starter plan (€29/mo) |
| `STRIPE_GROWTH_PRICE_ID` | Yes | Stripe price ID for Growth plan (€99/mo) |
| `FRONTEND_URL` | Yes | Frontend base URL (e.g., `http://localhost:3000`) |

### Frontend `.env.local`

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL (from Settings > API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key (from Settings > API) |
| `NEXT_PUBLIC_API_URL` | Yes | Backend URL (e.g., `http://localhost:8000`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key (from Dashboard > Developers > API keys) |

## Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Go to the **SQL Editor** and create a new query
3. Copy the entire contents of `backend/supabase/schema.sql` and run it
4. Enable **Email Auth**:
   - Go to Authentication > Providers > Email
   - Enable "Email" (if not already enabled)
   - Disable "Confirm email" for testing (optional)
5. Copy your project credentials from Settings > API:
   - Project URL → `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`
   - Service Role Key → `SUPABASE_SERVICE_KEY`
   - Anon Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - JWT Secret → `SUPABASE_JWT_SECRET` (under Configuration)

## Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Create two products:
   - **Starter Plan** — €29/month (5 analyses per month)
   - **Growth Plan** — €99/month (unlimited analyses)
3. Create a price for each product (recurring, monthly billing)
4. Copy the price IDs:
   - Starter Price ID → `STRIPE_STARTER_PRICE_ID`
   - Growth Price ID → `STRIPE_GROWTH_PRICE_ID`
5. Set up webhook:
   - Go to Developers > Webhooks > Add endpoint
   - Endpoint URL: `https://your-backend.com/api/stripe/webhook` (or `http://localhost:8000/api/stripe/webhook` for local testing with ngrok)
   - Events to send: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`
   - Copy the signing secret → `STRIPE_WEBHOOK_SECRET`

## How the Analysis Works

MCPulse uses a three-stage AI pipeline:

### Stage 1: Persona Generation
OpenAI generates 50 diverse synthetic customer personas based on your product description. Each persona includes:
- Demographics (age, location, job title, industry)
- Psychographics (pain points, current solutions, tech savviness)
- Willingness to pay
- Realistic variation to avoid bias

### Stage 2: Survey Simulation
Each persona is surveyed with the same questions:
- Would you use this product? (Yes/No/Maybe)
- What's your willingness to pay?
- What's your biggest concern?
- What's the one feature that would make you buy?
- Do people in your network have this problem?

Responses are realistic and diverse — some personas are enthusiastic, others skeptical, most lukewarm.

### Stage 3: Analysis & Scoring
The backend aggregates survey results and uses OpenAI to generate:
- **Validation Score** (0-100) based on:
  - % saying "Yes" (weighted heavily)
  - % saying "Maybe"
  - Willingness-to-pay alignment
  - Strength of demand signals
- **Ideal Customer Profile** — description of the most likely buyer
- **Top Objections** — most common concerns
- **Top Features** — most requested features
- **Market Fit Assessment** — specific guidance

The entire flow happens asynchronously. Users see live progress via WebSocket, and the report is generated within 30-60 seconds.

## Pricing Tiers

| Plan | Price | Analyses | Features |
|------|-------|----------|----------|
| **Free** | $0 | 1 | Full access, 50-persona survey |
| **Starter** | €29/month | 5 | Priority processing |
| **Growth** | €99/month | Unlimited | Priority + API access (future) |

Free users can run one analysis. To get more, they upgrade to a paid plan. Subscription management is handled via Stripe checkout.

## Security

- **OpenAI keys** are **never stored in plain text**. Users provide their own API key during each analysis, which is:
  - Encrypted with AES-256 using a 32-byte key
  - Stored encrypted in the database
  - Decrypted only when making requests to OpenAI
  - Never logged or exposed
- **JWT authentication** via Supabase (uses RS256 signing)
- **Row Level Security (RLS)** on all database tables — users can only access their own data
- **CORS** enabled only for your frontend domain
- **Stripe webhooks** are verified with signing secrets

## Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build
# Push to GitHub and connect to Vercel
# Set environment variables in Vercel project settings
npm run start  # Local testing
```

### Backend (Railway, Render, or Fly.io)

**Railway:**
```bash
cd backend
railway up
```

**Render:**
```bash
# Add a new Web Service, connect GitHub repo
# Set environment variables in Render dashboard
```

**Fly.io:**
```bash
cd backend
fly deploy
```

Update `NEXT_PUBLIC_API_URL` in frontend to point to your deployed backend.

## Running Locally with Ngrok (for Stripe webhooks)

To test Stripe webhooks locally:

1. Install ngrok: https://ngrok.com
2. Start ngrok: `ngrok http 8000`
3. Copy the forwarding URL (e.g., `https://abc123.ngrok.io`)
4. Add webhook in Stripe dashboard pointing to `https://abc123.ngrok.io/api/stripe/webhook`
5. Update `STRIPE_WEBHOOK_SECRET` in your `.env` with the new signing secret

## Common Issues

**"OpenAI API key is invalid"**
- Make sure the user's OpenAI key is correctly formatted (starts with `sk-`)
- Check that the key has API access enabled in OpenAI account

**"Supabase JWT is invalid"**
- Verify `SUPABASE_JWT_SECRET` is correctly copied (it's under Settings > Configuration, not API)
- Make sure `SUPABASE_SERVICE_KEY` (not anon key) is in backend `.env`

**"Stripe webhook not firing"**
- Ensure webhook endpoint is publicly accessible (use ngrok for local testing)
- Verify signing secret is correct in `.env`
- Check Stripe dashboard > Developers > Webhooks > Events for failures

**"CORS errors"**
- Make sure `FRONTEND_URL` in backend `.env` matches your frontend domain exactly
- Verify frontend is making requests to correct `NEXT_PUBLIC_API_URL`

## Development

- **Frontend:** `npm run dev` starts Next.js dev server with hot reload
- **Backend:** `uvicorn app.main:app --reload` enables auto-reload on code changes
- **Database:** Supabase provides a web UI for viewing data at https://app.supabase.com

## License

MIT
