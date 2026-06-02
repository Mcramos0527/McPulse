"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Check your email to confirm your account!')
      router.push('/auth/login')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/landing" className="text-accent-green font-mono text-2xl font-bold tracking-wider">
            MCPulse
          </Link>
          <p className="text-gray-500 font-mono text-sm mt-2">// CREATE ACCOUNT — FREE TO START</p>
        </div>

        <div className="card-glow rounded-lg p-8 bg-[#0f0f0f]">
          <h1 className="text-white font-mono text-xl font-bold mb-2">CREATE ACCOUNT</h1>
          <p className="text-gray-500 text-sm mb-6">1 free analysis. No credit card required.</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-gray-400 font-mono text-xs mb-2 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-gray-700 text-white font-mono px-4 py-3 rounded focus:outline-none focus:border-accent-green transition-all"
                placeholder="founder@startup.com"
              />
            </div>

            <div>
              <label className="block text-gray-400 font-mono text-xs mb-2 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-[#1a1a1a] border border-gray-700 text-white font-mono px-4 py-3 rounded focus:outline-none focus:border-accent-green transition-all"
                placeholder="min. 8 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-green text-black font-mono font-bold py-3 rounded hover:shadow-glow-green transition-all disabled:opacity-50"
            >
              {loading ? 'CREATING ACCOUNT...' : 'Create free account →'}
            </button>
          </form>

          <p className="text-gray-500 font-mono text-sm text-center mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-accent-green hover:underline">Login</Link>
          </p>
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="text-gray-400 hover:text-white">Terms</Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}
