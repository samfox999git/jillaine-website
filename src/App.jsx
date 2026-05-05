import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import CoverUps from './pages/CoverUps'
import FAQ from './pages/FAQ'
import AfterCare from './pages/AfterCare'
import Contact from './pages/Contact'
import './styles/global.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/colour-realism-tattoos" element={<Gallery />} />
        <Route path="/cover-up-tattoos" element={<CoverUps />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/after-care" element={<AfterCare />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
      <Analytics />
    </Router>
  )
}

export default App
