import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const onContactPage = pathname === '/contact'

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
          <NavLink to="/colour-realism-tattoos" onClick={() => setMobileOpen(false)}>Gallery</NavLink>
          <NavLink to="/cover-up-tattoos" onClick={() => setMobileOpen(false)}>Cover Ups</NavLink>
          <NavLink to="/faq" onClick={() => setMobileOpen(false)}>FAQ</NavLink>
          <NavLink to="/after-care" onClick={() => setMobileOpen(false)}>After Care</NavLink>
          {!onContactPage && (
            <Link to="/contact" className="btn btn-primary nav-cta-mobile-only" onClick={() => setMobileOpen(false)}>
              Book A Consultation
            </Link>
          )}
        </div>

        {!onContactPage && (
          <Link to="/contact" className="btn btn-primary nav-cta">
            Book A<br />Consultation
          </Link>
        )}

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
