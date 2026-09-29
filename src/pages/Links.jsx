import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageMeta from '../components/PageMeta'
import './Links.css'

const links = [
  {
    title: 'Book a Consultation',
    to: '/waitlist',
    icon: 'calendar',
  },
  {
    title: 'My Amazon Store',
    subtitle: 'Pre-tattoo care and other things I love',
    href: '#',
    icon: 'cart',
  },
  {
    title: 'Jillaine.ca',
    subtitle: 'My Website',
    to: '/',
    icon: 'gallery',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' }
  })
}

function LinkArrow() {
  return (
    <svg className="links-card-arrow" width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const icons = {
  calendar: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="5" width="17" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 9.5H20.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3V6.5M16 3V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  gallery: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 16.5L9 12L12.5 15L16 11L20.5 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  bag: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M6 8H18L17.2 20.2C17.14 20.98 16.48 21.5 15.7 21.5H8.3C7.52 21.5 6.86 20.98 6.8 20.2L6 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8.5 8V6.5C8.5 4.567 10.067 3 12 3C13.933 3 15.5 4.567 15.5 6.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  cart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 4H5L6.68 14.39C6.86 15.53 7.84 16.36 9 16.36H17.4C18.51 16.36 19.47 15.6 19.72 14.52L21 9H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="20" r="1.4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="20" r="1.4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
}

const socials = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/jillaine.tattoo/',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/Jillaine.Tattoo',
    icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@jillaine.tattoo',
    icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.27a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.7z"/></svg>,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@jillaine.tattoo',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="4"/><polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none"/></svg>,
  },
]

function LinkIcon({ type }) {
  return <span className="links-card-icon">{icons[type]}</span>
}

export default function Links() {
  return (
    <main className="links-page">
      <PageMeta
        title="Links"
        description="All of Jillaine's links in one place. Book a consultation, view her tattoo gallery, and shop her Amazon store."
        path="/links"
      />

      <div className="links-bg" aria-hidden="true" />

      <div className="links-content">
        <motion.div
          className="links-profile"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img
            src="/images/about/jillaine-portrait.jpg"
            alt="Jillaine, colour realism tattoo artist in Kelowna, BC"
            className="links-profile-photo"
          />
          <h1 className="links-profile-name">Jillaine Tattoo</h1>
          <p className="links-profile-sub">Kelowna, BC</p>
          <div className="links-socials">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="links-social">
                {s.icon}
              </a>
            ))}
          </div>
        </motion.div>

        <div className="links-list">
          {links.map((link, i) => {
            const content = (
              <>
                <LinkIcon type={link.icon} />
                <span className="links-card-text">
                  <span className="links-card-title">{link.title}</span>
                  {link.subtitle && <span className="links-card-subtitle">{link.subtitle}</span>}
                </span>
                <LinkArrow />
              </>
            )
            return (
              <motion.div
                key={link.title}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={i + 1}
              >
                {link.to ? (
                  <Link to={link.to} className="links-card">
                    {content}
                  </Link>
                ) : (
                  <a href={link.href} className="links-card" target="_blank" rel="noopener noreferrer">
                    {content}
                  </a>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
