"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/landing" className="text-accent-green font-mono text-2xl font-bold tracking-wider">
            MCPulse
          </Link>
          <p className="text-gray-500 font-mono text-sm mt-2">// AUTHENTICATION REQUIRED</p>
        </div>

        <div className="card-glow rounded-lg p-8 bg-[#0f0f0f]">
          <h1 className="text-white font-mono text-xl font-bold mb-6">LOGIN</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-400 font-mono text-xs mb-2 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-gray-700 text-white font-mono px-4 py-3 rounded focus:outline-none focus:border-accent-green focus:shadow-glow-green transition-all"
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
                className="w-full bg-[#1a1a1a] border border-gray-700 text-white font-mono px-4 py-3 rounded focus:outline-none focus:border-accent-green focus:shadow-glow-green transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-green text-black font-mono font-bold py-3 rounded hover:shadow-glow-green transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'AUTHENTICATING...' : 'LOGIN →'}
            </button>
          </form>

          <p className="text-gray-500 font-mono text-sm text-center mt-6">
            No account?{' '}
            <Link href="/auth/signup" className="text-accent-green hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
