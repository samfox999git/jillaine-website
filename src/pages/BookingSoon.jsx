import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PageMeta from '../components/PageMeta'
import './Gallery.css'
import './BookingSoon.css'

// 12:00 PM PST (UTC-8) on Friday, November 20, 2026.
const OPENS_AT = Date.UTC(2026, 10, 20, 20, 0, 0)

const thingsToKnow = [
  'I’ll be booking projects for February–September 2027.',
  'Consultations will take place throughout December and January.',
  'If you’re interested in a coverup, please have clear photos of your existing tattoo ready to upload.',
  'Please have reference photos ready if you wish to provide reference.',
  'I don’t take on projects expected to require less than 3 hours.',
  'I work exclusively within my style. I don’t take on script, American traditional, fine line, or styles outside of my specialty.',
]

const estimates = [
  { area: 'Inner or outer forearm', label: '1 full-day session', min: 1, max: 1 },
  { area: 'Full sleeve', label: '5–6 full-day sessions', min: 5, max: 6 },
  { area: 'Back piece', label: '6–8 full-day sessions', min: 6, max: 8 },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: 'easeOut' },
  }),
}

function Countdown() {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = OPENS_AT - now
  if (diff <= 0) return null

  const units = [
    ['Days', Math.floor(diff / 864e5)],
    ['Hours', Math.floor(diff / 36e5) % 24],
    ['Minutes', Math.floor(diff / 6e4) % 60],
    ['Seconds', Math.floor(diff / 1e3) % 60],
  ]

  return (
    <div className="bs-countdown" aria-label="Time until bookings open">
      {units.map(([label, value]) => (
        <div key={label} className="bs-countdown-unit">
          <span className="bs-countdown-value">{String(value).padStart(2, '0')}</span>
          <span className="bs-countdown-label">{label}</span>
        </div>
      ))}
    </div>
  )
}

function SessionDots({ min, max }) {
  return (
    <span className="bs-dots" aria-hidden="true">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`bs-dot${i >= min ? ' bs-dot--maybe' : ''}`} />
      ))}
    </span>
  )
}

export default function BookingSoon() {
  return (
    <main className="gallery-page bs-page">
      <PageMeta
        title="Bookings Opening Soon"
        description="Jillaine's books open Friday, November 20 at 12:00 PM PST for projects February to September 2027. Everything to know before submitting."
        path="/booking-soon"
      />

      <div className="page-hero">
        <div className="container container-narrow">
          <motion.p className="section-label" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Bookings
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Opening <span className="gradient-text">Soon</span>
          </motion.h1>

          <motion.div
            className="bs-time-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Countdown />
            <p className="bs-time-date">Friday, November 20</p>
            <p className="bs-time-main">12:00 PM PST</p>
            <p className="bs-time-city">in Seattle / LA</p>
            <p className="bs-time-note">
              That’s Friday, November 20th at <strong>1:00 PM BC time</strong>, because of no daylight savings this year.
            </p>
          </motion.div>
        </div>
      </div>

      <section className="section container container-narrow bs-section">
        <motion.h2 className="bs-heading" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          A Few Things to Know <span className="gradient-text">Before Submitting</span>
        </motion.h2>
        <ul className="bs-list">
          {thingsToKnow.map((item, i) => (
            <motion.li key={item} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              {item}
            </motion.li>
          ))}
        </ul>
      </section>

      <section className="section container container-narrow bs-section bs-section--follow">
        <motion.h2 className="bs-heading" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          Pricing &amp; <span className="gradient-text">Project Estimates</span>
        </motion.h2>

        <motion.div className="bs-prose" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <p>My day rate for most projects is <strong className="bs-price">$3,000 CAD</strong>. Pricing may vary for existing clients.</p>
          <p>To give you a better idea of what to expect, here are some approximate session estimates:</p>
        </motion.div>

        <ul className="bs-estimates">
          {estimates.map((e, i) => (
            <motion.li key={e.area} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <span className="bs-estimate-area">{e.area}</span>
              <SessionDots min={e.min} max={e.max} />
              <span className="bs-estimate-label">{e.label}</span>
            </motion.li>
          ))}
        </ul>

        <p className="bs-small">These are estimates, and the actual number of sessions will depend on the individual project.</p>
      </section>

      <section className="section container container-narrow bs-section bs-section--follow">
        <motion.h2 className="bs-heading" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          A Note About <span className="gradient-text">Booking</span>
        </motion.h2>
        <motion.div className="bs-prose" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <p>Submitting a booking form does not guarantee an appointment. With the limited number of spots available, I’ll be carefully reviewing each submission to find projects that are the right fit for my style and schedule.</p>
          <p>I’ll do my best to personally respond to everyone who submits an inquiry, even if their project isn’t something I’m able to take on. I really appreciate the interest and the time everyone takes to reach out!</p>
        </motion.div>

        <motion.div className="bs-callout" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <p>I will only be taking on a limited number of requests so if you want to have the best chance to submit please do it right after it opens, I will close off the form when I have a certain amount of inquiries. If you don’t make it in time this time just stay on the list and I’ll let you know when bookings open again in the future.</p>
        </motion.div>

        <motion.div className="bs-signoff" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <p>I’m so excited to see what everyone has in mind and can’t wait to get started on some new projects.</p>
        </motion.div>
      </section>
    </main>
  )
}
