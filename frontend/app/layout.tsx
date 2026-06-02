import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'MCPulse — Validate your idea before you build',
  description: 'Generate 50 synthetic customer personas and survey them to validate your startup idea.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-background text-white font-sans antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { background: '#1a1a1a', color: '#fff', border: '1px solid #00FF94' },
          }}
        />
      </body>
    </html>
  )
}
