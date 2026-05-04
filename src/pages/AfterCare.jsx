import { motion } from 'framer-motion'
import PageMeta from '../components/PageMeta'
import './AfterCare.css'

const protocol = [
  {
    label: 'First 24 Hours',
    body: 'There may be a build up of plasma and ink under the wrap. This is completely normal but means the wrap must be changed once. If the wrap starts leaking, absorb the leaks with paper towel. The fluid will continue to build for about 24 hours so it is best to wait to change it. You might experience heavy swelling, that is normal. Take Advil to reduce swelling. Keep your tattoo elevated as much as possible. Ice the tattoo no more than 15 mins at a time.',
  },
  {
    label: 'Days 1–7',
    body: 'The wrap should be left on for a full 7 days after it is changed. Removing the wrap early may result in heavy scabbing, a longer healing time and/or the need for touchups. Only remove the wrap early if the tattoo has become exposed or the wrap has become compromised in some way.',
  },
  {
    label: 'Showering',
    body: 'You may shower as normal while wearing this wrap, but avoid soaking in water such as baths, pools, or hot tubs. Saunas are also not permitted.',
  },
  {
    label: 'Itchiness',
    body: "It is very normal to go through a period of feeling extremely itchy. Do not scratch your tattoo. You may use ice to soothe the skin. Broken skin doesn't regulate temperature well so avoid icing for more than 15 min and use a barrier, such as a cloth, between your skin and the ice.",
  },
  {
    label: 'The Pink Line',
    body: 'A "pink line" may form along the very edge of this wrap. This is the wrap pulling your skin in a direction it\'s not used to. This often happens along high movement areas such as joints. As soon as you notice this, peel the wrap back a little bit and trim it to avoid a blister.',
    warn: true,
  },
  {
    label: 'After Day 7',
    body: 'Remove the wrap in the shower — warm water makes it easier to pull off. Gently wash your tattoo with unscented soap. The tattoo should be mostly healed. Moisturize with an unscented lotion ~3 times a day for the next month. If there are any scabs, avoid lotion in those areas. Do not pick or scratch scabs as this will pull out the ink.',
  },
]

const changeSteps = [
  'Jillaine will give you a package with measured out wrap and gloves. In most cases you will need someone to help you. The gloves are for your helper.',
  '24 hours after your tattoo, go in the shower, peel the wrap off under the warm water and gently wash with soap that is provided. Scented soap can burn and cause damage to your tattoo.',
  'After the shower, dry your tattoo with paper towel that is provided. Do not use a regular towel as this may have bacteria and fuzzies. Make sure your tattoo is dry before replacing the wrap — it will not stick to anything wet. Do not apply lotion before reapplying your wrap as it will not stick to lotion.',
  'Fold the wrap back on itself so it is more flat. There is a crack down the middle — peel off the half without the red line first. If the wrap folds in on itself at this point it\'s ruined, so do your best to keep it flat.',
  'Place the sticky half of the wrap over your tattoo, extending past the edge at least an inch and a half. Then peel off the other half with the red line and tag it down. Peel off the whole outer layer — it will all detach from the red line.',
  'Apply multiple sheets if needed. An inch and a half overlap is required. The wrap is still breathable despite it being overlapped.',
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: 'easeOut', delay },
})

export default function AfterCare() {
  return (
    <main className="aftercare-page">
      <PageMeta
        title="Tattoo After Care"
        description="Tattoo aftercare instructions from Jillaine — colour realism tattoo artist in Kelowna, BC. How to care for your new tattoo and keep it looking vibrant for years."
        path="/aftercare"
      />

      {/* Hero */}
      <div className="page-hero aftercare-hero">
        <div className="container">
          <motion.p className="section-label" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            Tattoo Care
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            After Care <span className="gradient-text">Guide</span>
          </motion.h1>
        </div>
      </div>

      {/* What is derm wrap */}
      <section className="ac-section container container-narrow">
        <motion.div className="derm-intro glass-card" {...fadeUp()}>
          <p className="derm-intro-label">General Aftercare Protocol</p>
          <p className="derm-intro-body">
            Tattoo derm wrap is an innovative, medical-grade, transparent, adhesive barrier that protects new tattoos while they are healing. It is latex-free, water resistant and breathable — manufactured under quality controlled conditions that have been CE-marked and FDA-registered.
          </p>
          <p className="derm-intro-body">
            The first week is a crucial time when it comes to healing tattoos. Because it is breathable and water resistant, this wrap can be left on for this period. It will protect the tattoo from bacteria and debris, and help to prevent infections.
          </p>
        </motion.div>
      </section>

      {/* Protocol rows */}
      <section className="ac-section container container-narrow">
        <div className="protocol-rows">
          {protocol.map((row, i) => (
            <motion.div
              key={row.label}
              className={`protocol-row ${row.warn ? 'warn' : ''}`}
              {...fadeUp(i * 0.07)}
            >
              <span className="protocol-label">{row.label}</span>
              <p className="protocol-body">{row.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Saran wrap / vaseline callout */}
      <section className="ac-section container container-narrow">
        <motion.div className="warn-callout glass-card" {...fadeUp()}>
          <span className="warn-callout-label">Important</span>
          <p>
            Saran wrap is not breathable and is not the same thing as derm wrap — do not put saran wrap on your fresh tattoo. Vaseline or petroleum jelly is not breathable either and is not the same thing as lotion — do not use petroleum jelly on your fresh tattoo.
          </p>
        </motion.div>
      </section>

      {/* Changing your wrap */}
      <section className="ac-section ac-section--gap container container-narrow">
        <motion.h2 className="ac-section-title" {...fadeUp()}>
          Changing Your <span className="gradient-text">Wrap</span> at Home
        </motion.h2>
        <div className="change-steps">
          {changeSteps.map((step, i) => (
            <motion.div key={i} className="change-step" {...fadeUp(i * 0.07)}>
              <span className="change-step-num">Step {i + 1}</span>
              <p className="change-step-body">{step}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="ac-section container container-narrow">
        <motion.div className="disclaimer glass-card" {...fadeUp()}>
          <p>
            Please make every effort to follow this aftercare plan. Failure to follow the provided healing protocol can result in damage to your tattoo. In such cases, as well as damage due to chronic sun exposure, you will be charged for touchups. Please contact Jillaine with any questions or concerns. Do not remove the wrap early for any reason without first speaking with Jillaine.
          </p>
        </motion.div>
      </section>

    </main>
  )
}
