"use client"
import { useState, useEffect } from 'react'

const FULL_TEXT = "Does your idea have a market? Ask 50 synthetic customers in 60 seconds."

export default function TypingHeadline() {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(FULL_TEXT.slice(0, i + 1))
      i++
      if (i >= FULL_TEXT.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, 35)
    return () => clearInterval(interval)
  }, [])

  return (
    <h1 className="text-4xl md:text-6xl font-mono font-bold text-white leading-tight">
      {displayed}
      {!done && <span className="text-accent-green animate-pulse">█</span>}
    </h1>
  )
}
