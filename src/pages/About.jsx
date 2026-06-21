import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { heroImages } from '../data/products'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay },
})

export default function About() {
  const { tr } = useLanguage()
  const a = tr.about

  return (
    <main className="pt-20 pb-24">
      {/* Hero */}
      <section className="relative h-[819px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImages.aboutHero} alt="سايا" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/20 backdrop-brightness-75" />
        </div>
        <motion.div
          className="relative z-10 text-center max-w-2xl px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <h1 className="font-garamond text-display-mobile md:text-display-lg text-surface-container-lowest mb-6">{a.heroTitle}</h1>
          <p className="font-jakarta text-body-lg text-surface-container-lowest opacity-90 leading-relaxed">{a.heroSub}</p>
        </motion.div>
      </section>

      {/* Story */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-site mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp(0.1)} className="text-right order-2 md:order-1">
            <span className="font-jakarta text-secondary text-label-md tracking-widest block mb-4">{a.storyLabel}</span>
            <h2 className="font-garamond text-headline-md text-primary mb-8">{a.storyTitle}</h2>
            <p className="font-jakarta text-body-md text-on-surface-variant mb-6 leading-loose">{a.story1}</p>
            <p className="font-jakarta text-body-md text-on-surface-variant leading-loose mb-10">{a.story2}</p>
            <p className="italic font-garamond text-headline-sm text-secondary">{a.tagline}</p>
          </motion.div>
          <motion.div {...fadeUp(0.2)} className="order-1 md:order-2">
            <div className="relative group">
              <div className="absolute -inset-4 bg-secondary-container/30 rounded-xl transition-all duration-500 group-hover:scale-105" />
              <img
                src={heroImages.aboutStory}
                alt="قصتنا"
                className="relative rounded-lg shadow-xl w-full h-[500px] object-cover transition-transform duration-500 group-hover:-translate-y-2"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-surface-container py-24">
        <motion.div {...fadeUp()} className="max-w-site mx-auto px-margin-mobile md:px-margin-desktop text-center mb-16">
          <h2 className="font-garamond text-headline-md text-primary mb-4">{a.valuesTitle}</h2>
          <div className="w-20 h-0.5 bg-secondary mx-auto" />
        </motion.div>
        <div className="max-w-site mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-12">
          {a.values.map((v, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.1)}
              className={`bg-background p-10 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center ${i === 1 ? 'scale-105 ring-1 ring-secondary/20' : ''}`}
            >
              <div className="text-primary mb-6 flex justify-center">
                <span className="material-symbols-outlined text-4xl">{v.icon}</span>
              </div>
              <h3 className="font-garamond text-headline-sm text-primary mb-4">{v.title}</h3>
              <p className="font-jakarta text-body-md text-on-surface-variant">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

    </main>
  )
}
