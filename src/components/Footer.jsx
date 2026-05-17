import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
  const { tr } = useLanguage()
  const f = tr.footer

  return (
    <footer className="bg-surface-container w-full pt-16 pb-8 border-t border-outline-variant/30">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop max-w-site mx-auto text-right">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <span className="font-garamond text-headline-md text-primary">SAYA</span>
          <p className="text-body-sm font-jakarta text-on-surface-variant leading-relaxed">{f.tagline}</p>
          <div className="flex gap-4">
            <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">camera</span>
            </a>
            <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">public</span>
            </a>
            <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">share</span>
            </a>
          </div>
        </div>

        {/* Shop links */}
        <div className="flex flex-col gap-4">
          <h4 className="font-garamond text-[16px] text-primary">{f.shop}</h4>
          <ul className="flex flex-col gap-3">
            {[
              { label: f.links.skincare, to: '/shop' },
              { label: f.links.perfumes, to: '/shop' },
              { label: f.links.hair, to: '/shop' },
            ].map(l => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-label-md font-jakarta text-on-surface-variant hover:text-primary underline decoration-primary/30 underline-offset-4 transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company links */}
        <div className="flex flex-col gap-4">
          <h4 className="font-garamond text-[16px] text-primary">{f.company}</h4>
          <ul className="flex flex-col gap-3">
            {[
              { label: f.links.about, to: '/about' },
              { label: f.links.shipping, to: '/contact' },
              { label: f.links.tracking, to: '/tracking' },
            ].map(l => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-label-md font-jakarta text-on-surface-variant hover:text-primary underline decoration-primary/30 underline-offset-4 transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-4">
          <h4 className="font-garamond text-[16px] text-primary">{f.contactTitle}</h4>
          <ul className="flex flex-col gap-3">
            <li>
              <Link to="/contact" className="text-label-md font-jakarta text-on-surface-variant hover:text-primary transition-colors">
                {f.links.contact}
              </Link>
            </li>
            <li className="text-label-md font-jakarta text-on-surface-variant">{f.address}</li>
            <li className="text-label-md font-jakarta text-on-surface-variant" dir="ltr">{f.phone}</li>
            <li className="text-label-md font-jakarta text-on-surface-variant">{f.emailAddr}</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-16 pt-8 border-t border-outline-variant/20 px-margin-mobile md:px-margin-desktop max-w-site mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-label-md font-jakarta text-on-surface-variant">{f.copyright}</p>
        <div className="flex gap-6">
          <span className="text-label-md font-jakarta text-on-surface-variant cursor-pointer hover:text-primary transition-colors">{f.privacy}</span>
          <span className="text-label-md font-jakarta text-on-surface-variant cursor-pointer hover:text-primary transition-colors">{f.terms}</span>
        </div>
      </div>
    </footer>
  )
}
