import Link from 'next/link'

interface PricingCardProps {
  tier: string
  price: string
  period?: string
  volume: string
  features: string[]
  cta: string
  href: string
  highlighted?: boolean
  badge?: string
}

export default function PricingCard({
  tier,
  price,
  period,
  volume,
  features,
  cta,
  href,
  highlighted = false,
  badge,
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-lg p-8 bg-[#111111] ${
        highlighted
          ? 'border-2 border-accent-green shadow-glow-green'
          : 'card-glow'
      }`}
    >
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-green text-black text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
          {badge}
        </span>
      )}

      <div className="mb-6">
        <p className="text-xs font-mono uppercase tracking-widest text-[#666] mb-2">{tier}</p>
        <div className="flex items-end gap-1">
          <span className={`text-5xl font-mono font-bold ${highlighted ? 'text-accent-green text-glow-green' : 'text-white'}`}>
            {price}
          </span>
          {period && <span className="text-[#666] font-mono mb-1">{period}</span>}
        </div>
        <p className="text-sm text-[#999] font-mono mt-1">{volume}</p>
      </div>

      <ul className="flex-1 space-y-3 mb-8">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-[#ccc]">
            <span className="text-accent-green font-mono mt-0.5">›</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className={`block text-center py-3 px-6 rounded font-mono font-bold text-sm transition-all duration-200 ${
          highlighted
            ? 'bg-accent-green text-black hover:shadow-glow-green hover:scale-[1.02]'
            : 'border border-accent-green text-accent-green hover:bg-accent-green hover:text-black hover:scale-[1.02]'
        }`}
      >
        {cta}
      </Link>
    </div>
  )
}
