import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer" id="site-footer">
      <div className="footer-aurora-border" />
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <img src="/images/logo/jillaine-logo.png" alt="Jillaine Tattoo" className="footer-logo" />
            <p className="footer-tagline">
              Award-winning colour realism tattoo artist in Kelowna, BC.
              Bringing your vision to life with vibrant, high-quality ink that lasts.
            </p>
            <div className="footer-social">
              <a href="https://www.instagram.com/jillaine.tattoo/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
              </a>
              <a href="https://www.youtube.com/@jillaine.tattoo" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="footer-social-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="4"/><polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none"/></svg>
              </a>
              <a href="https://www.tiktok.com/@jillaine.tattoo" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="footer-social-link">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.27a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.7z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">Explore</h4>
            <div className="footer-links">
              <Link to="/gallery">Gallery</Link>
              <Link to="/gallery#cover-ups">Cover-Up Tattoos</Link>
              <Link to="/faq">FAQ</Link>
              <Link to="/aftercare">After Care</Link>
              <Link to="/contact">Book A Consultation</Link>
            </div>
          </div>

          {/* Studio Info */}
          <div className="footer-section">
            <h4 className="footer-heading">Studio</h4>
            <div className="footer-info">
              <p>District Ink Tattoo Studio</p>
              <p>1990 Landsdowne Pl #3</p>
              <p>Kelowna, BC, Canada</p>
              <a href="https://www.instagram.com/jillaine.tattoo/" target="_blank" rel="noopener noreferrer" className="footer-instagram">
                @jillaine.tattoo
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Jillaine Tattoo. All rights reserved.</p>
          <p className="footer-credit">♥</p>
        </div>
      </div>
    </footer>
  )
}
