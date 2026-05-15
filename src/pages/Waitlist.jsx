import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageMeta from '../components/PageMeta'
import './Waitlist.css'

export default function Waitlist() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email address.')
      return
    }
    setErrorMsg('')
    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
      } else {
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <main className="waitlist-page">
      <PageMeta
        title="Join the Waitlist — Jillaine Tattoo"
        description="Jillaine's books are currently closed. Join the waitlist to be notified when new booking requests open in winter 2026."
        path="/waitlist"
      />

      {/* Animated aurora background */}
      <div className="waitlist-bg">
        <div className="aurora-blob aurora-blob--1" />
        <div className="aurora-blob aurora-blob--2" />
        <div className="aurora-blob aurora-blob--3" />
        <div className="waitlist-bg-overlay" />
      </div>

      <div className="waitlist-content">

        {/* Top label */}
        <motion.p
          className="waitlist-eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Jillaine Tattoo · Kelowna, BC
        </motion.p>

        {/* Main heading */}
        <motion.div
          className="waitlist-headline-wrap"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <h1 className="waitlist-headline">
            <span className="waitlist-headline--accent">Bookings are closed. <span className="waitlist-heart">♥</span></span>
            Be the first to know when openings become available.
          </h1>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="waitlist-divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        {/* Body text */}
        <motion.p
          className="waitlist-body"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Sign up here.
        </motion.p>

        {/* Form */}
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              className="waitlist-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="waitlist-success-icon">✨</span>
              <p>You're on the list! I'll reach out when books open.</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              className="waitlist-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <div className="waitlist-input-row">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrorMsg('') }}
                  className="waitlist-input"
                  disabled={status === 'loading'}
                />
                <button
                  type="submit"
                  className="btn btn-primary waitlist-btn"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Joining...' : 'Notify Me'}
                </button>
              </div>
              {errorMsg && <p className="waitlist-error">{errorMsg}</p>}
              <p className="waitlist-privacy">No spam. Unsubscribe anytime.</p>
            </motion.form>
          )}
        </AnimatePresence>


      </div>
    </main>
  )
}
