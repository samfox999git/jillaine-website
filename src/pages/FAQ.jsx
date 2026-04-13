import { motion } from 'framer-motion'
import { useState } from 'react'
import PageMeta from '../components/PageMeta'
import './FAQ.css'

const faqData = [
  {
    category: 'Booking & Studio',
    items: [
      {
        q: 'Where are you located and where do I park?',
        a: 'District Ink Tattoo Studio, 1990 Landsdowne Pl #3, Kelowna, BC. You can park anywhere in front of the shop. Ring the doorbell upon arrival.'
      },
      {
        q: 'Are consultations free?',
        a: 'Consultations are free however if you book in to get tattooed I will ask for a deposit that will go towards your tattoo cost. A deposit is required to hold your booked date and time.'
      },
      {
        q: 'How do deposits work?',
        a: 'I will take a deposit to hold your appointment date and time. Your deposit will go towards the cost of your tattoo and come off the price of your final session. Deposits are non refundable for any reason.'
      },
    ]
  },
  {
    category: 'Pricing & Payment',
    items: [
      {
        q: 'What is your hourly rate?',
        a: 'There are a few different ways I charge based on your own unique project. Price quotes will be given only during the consultation process.'
      },
      {
        q: 'What payment methods do you accept?',
        a: 'Only cash or e-transfer is accepted at this time. I currently do not have a machine to take debit or credit.'
      },
    ]
  },
  {
    category: 'Tattoo Process',
    items: [
      {
        q: 'Do you do coverups?',
        a: 'Coverups are my passion and my specialty, however not all tattoos can be covered. Please include a photo of your existing tattoo when filling out the booking form. Please include a brief description of what you\'re hoping to cover the tattoo with. Please note coverups usually require a fair bit of design freedom.'
      },
      {
        q: 'Will you show me the tattoo design in advance?',
        a: 'I do not send drawings out in advance of the appointment. No exceptions. There are several reasons for this. Some changes can be made the day of your appointment, however most clients are very happy with what I have designed for them. If you like my portfolio, chances are you will love what I design for you.'
      },
      {
        q: 'How do you feel about numbing cream?',
        a: 'I do not permit my clients to use numbing cream. Numbing cream changes the texture of the skin and can cause the tattoo to heal poorly. Most numbing creams only last a couple hours and after they wear off, the tattoo hurts much more than if it was never used in the first place. If you show up to the shop with numbing cream on I will reschedule your appointment and keep your deposit.'
      },
      {
        q: 'Do your style of colour tattoos stay vibrant forever?',
        a: 'With proper client care, the tattoos I do should stay vibrant for a very long time. I have a full sleeve that is 6 years old and a large leg piece that is 5 years old, both done by my mentor in a similar style to mine. Over time both pieces have held up really well.'
      },
      {
        q: 'Is the ink you use safe?',
        a: 'I primarily use Fusion Ink which is vegan and body safe. The ingredients are organic pigment, water, glycerin, witch hazel, isopropyl alcohol. Fusion Ink contains no harmful fillers and has a much higher pigment load than any other ink on the market today, which makes for vibrant, long lasting tattoos.'
      },
    ]
  },
  {
    category: 'Policies',
    items: [
      {
        q: 'What is your cancellation / rescheduling policy?',
        a: 'No shows or reschedules within less than 7 days notice will result in forfeit of the deposit. A new deposit will have to be paid before rebooking. If more than 7 days notice is given to reschedule an appointment I will transfer the deposit over to the new appointment. Any appointments rescheduled more than once may be subject to a $100 non-refundable rebooking fee.'
      },
      {
        q: 'Can I bring a friend to my appointment?',
        a: 'I\'d prefer it if you did not bring a friend as I focus better in a one on one setting. You may have a friend pop by the shop to bring you a snack or something and hang out for a little while, but I prefer if they don\'t stay for the whole appointment. If you feel you absolutely must bring a friend for emotional support, please let me know ahead of time.'
      },
    ]
  },
  {
    category: 'Preparation / Care',
    items: [
      {
        q: 'What should I bring to my appointment?',
        a: 'It\'s important to stay hydrated so please bring a water bottle. Often the appointments are long so feel free to bring food, snacks and drinks. Bring anything you wish to be cozy, such as a pillow and blanket. Some people prefer to bring a device and headphones to keep themselves entertained, although I\'m also not opposed to chatting throughout the session. I really like to eat some candy while getting tattooed as the sugar seems to help me get through the pain.'
      },
      {
        q: 'How can I prepare for my tattoo?',
        a: 'Please leave the shaving to me! Get a good nights rest and drink lots of water prior to your appointment. Please eat a good meal before showing up to the shop. Please shower prior to your appointment, and please avoid wearing perfume or cologne as I have a sensitivity to scents. It\'s a good idea to apply lotion to the area you are going to get tattooed for a few weeks in advance.'
      },
      {
        q: 'When can I swim / get sun / workout post-tattoo session?',
        a: 'With the aftercare I use, usually you can swim and be in the sun after about 2 weeks of healing time. Please note, for the longevity of your tattoo always apply sunscreen. I advise taking 4-5 days off of working out. Physical activity, especially around joints can cause the ink to blow out (leak under the skin and look cloudy). This is irreversible, permanent damage.'
      },
    ]
  },
]

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(!open)}>
        <span className="faq-dot" />
        <span className="faq-question-text">{question}</span>
        <svg className={`faq-chevron ${open ? 'open' : ''}`} width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <motion.div
        className="faq-answer"
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        <p>{answer}</p>
      </motion.div>
    </div>
  )
}

export default function FAQ() {
  return (
    <main className="faq-page">
      <PageMeta
        title="FAQ"
        description="Frequently asked questions about booking a tattoo with Jillaine — colour realism tattoo artist in Kelowna, BC. Learn about deposits, touch-ups, pricing, and aftercare."
        path="/faq"
      />
      <div className="page-hero">
        <div className="container">
          <motion.p className="section-label" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Common Questions
          </motion.p>
          <motion.h1 className="faq-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            FA<span className="gradient-text">Q</span>
          </motion.h1>
        </div>
      </div>

      <div className="section container container-narrow">
        {faqData.map((group, gi) => (
          <motion.div
            key={group.category}
            className="faq-group"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.1 }}
          >
            <h3 className="faq-category">{group.category}</h3>
            {group.items.map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} />
            ))}
          </motion.div>
        ))}
      </div>
    </main>
  )
}
