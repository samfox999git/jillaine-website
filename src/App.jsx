import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import CoverUps from './pages/CoverUps'
import Healed from './pages/Healed'
import Links from './pages/Links'
import FAQ from './pages/FAQ'
import AfterCare from './pages/AfterCare'
import Waitlist from './pages/Waitlist'
import WaitlistConfirmed from './pages/WaitlistConfirmed'
import './styles/global.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const NO_NAVBAR_PATHS = ['/links']
const NO_FOOTER_PATHS = ['/links']

function ConditionalNavbar() {
  const { pathname } = useLocation()
  if (NO_NAVBAR_PATHS.includes(pathname)) return null
  return <Navbar />
}

function ConditionalFooter() {
  const { pathname } = useLocation()
  if (NO_FOOTER_PATHS.includes(pathname)) return null
  return <Footer />
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ConditionalNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/colour-realism-tattoos" element={<Gallery />} />
        <Route path="/cover-up-tattoos" element={<CoverUps />} />
        <Route path="/healed" element={<Healed />} />
        <Route path="/links" element={<Links />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/after-care" element={<AfterCare />} />
        <Route path="/contact" element={<Navigate to="/waitlist" replace />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/waitlist-confirmed" element={<WaitlistConfirmed />} />
      </Routes>
      <ConditionalFooter />
      <Analytics />
      <SpeedInsights />
    </Router>
  )
}

export default App
