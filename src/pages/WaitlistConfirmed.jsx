import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import './Waitlist.css'
import './WaitlistConfirmed.css'

export default function WaitlistConfirmed() {
  return (
    <main className="waitlist-page">
      <PageMeta
        title="You're Confirmed — Jillaine Tattoo"
        description="You're on the waitlist for Jillaine Tattoo. You'll be the first to know when bookings open."
        path="/waitlist-confirmed"
      />

      <div className="waitlist-bg">
        <div className="aurora-blob aurora-blob--1" />
        <div className="aurora-blob aurora-blob--2" />
        <div className="aurora-blob aurora-blob--3" />
        <div className="waitlist-bg-overlay" />
      </div>

      <div className="waitlist-content">

        <motion.div
          className="confirmed-icon"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
        >
          ✨
        </motion.div>

        <motion.div
          className="waitlist-headline-wrap"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <h1 className="waitlist-headline">
            <span className="waitlist-headline--accent">You're confirmed.</span>
            I'll reach out when bookings open.
          </h1>
        </motion.div>

        <motion.div
          className="waitlist-divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        />

        <motion.p
          className="waitlist-body"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          In the meantime, take a look at the work.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
        >
          <Link to="/colour-realism-tattoos" className="btn btn-primary">
            View Gallery
          </Link>
        </motion.div>

        <motion.p
          className="waitlist-year"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          Winter 2026
        </motion.p>

      </div>
    </main>
  )
}
