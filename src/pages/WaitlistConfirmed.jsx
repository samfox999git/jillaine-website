import { motion } from 'framer-motion'
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
          In the meantime, hang out with me on socials.
        </motion.p>

        <motion.div
          className="confirmed-socials"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
        >
          <a href="https://www.instagram.com/jillaine.tattoo/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="confirmed-social-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
            <span>Instagram</span>
          </a>
          <a href="https://www.tiktok.com/@jillaine.tattoo" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="confirmed-social-link">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.27a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.7z"/></svg>
            <span>TikTok</span>
          </a>
          <a href="https://www.youtube.com/@jillaine.tattoo" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="confirmed-social-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="4"/><polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none"/></svg>
            <span>YouTube</span>
          </a>
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
