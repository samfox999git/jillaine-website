import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner container">
        <Link to="/" className="nav-logo" onClick={() => setMobileOpen(false)}>
          <img src="/images/logo/jillaine-logo.png" alt="Jillaine Tattoo" className="nav-logo-img" />
        </Link>

        <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          <NavLink to="/" end onClick={() => setMobileOpen(false)}>Home</NavLink>
          <NavLink to="/gallery" onClick={() => setMobileOpen(false)}>Gallery</NavLink>
          <NavLink to="/cover-ups" onClick={() => setMobileOpen(false)}>Cover Ups</NavLink>
          <NavLink to="/faq" onClick={() => setMobileOpen(false)}>FAQ</NavLink>
          <NavLink to="/aftercare" onClick={() => setMobileOpen(false)}>After Care</NavLink>
          <Link to="/contact" className="btn btn-primary nav-cta-mobile-only" onClick={() => setMobileOpen(false)}>
            Book A Consultation
          </Link>
        </div>

        <Link to="/contact" className="btn btn-primary nav-cta">
          Book A<br />Consultation
        </Link>

        <button
          className={`nav-hamburger ${mobileOpen ? 'open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
