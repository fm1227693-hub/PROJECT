import Section from './Section'
import Label from './Label'
import Logo from './Logo'
import Clock from './Clock'
import { ArrowUp, ArrowUpRight } from './icons'
import { useScroll } from '../context/scroll'
import { brand, nav, socials, footer } from '../data/content'

/** Editorial footer: only what is needed, with room to breathe. */
export default function Footer() {
  const { scrollTo } = useScroll()
  const go = (e, href) => {
    e.preventDefault()
    scrollTo(href)
  }

  return (
    <Section as="footer" theme="cobalt" className="pt-[12vh] pb-8" aria-label="Footer">
      <div className="container-x">
        <div className="grid-12 gap-y-12 border-b hairline pb-14">
          <div className="col-span-12 lg:col-span-4">
            <a href="#top" onClick={(e) => go(e, '#top')} aria-label={`${brand.name} — back to top`}>
              <Logo />
            </a>
            <p className="mt-5 max-w-[26ch] text-[0.9rem] leading-[1.5] text-muted">
              {brand.tagline}. {brand.cities.map((c) => c.name).join(' · ')}.
            </p>
          </div>

          <nav className="col-span-6 lg:col-span-2 lg:col-start-6" aria-label="Footer">
            <Label>Menu</Label>
            <ul className="mt-4 flex flex-col gap-2 text-[0.95rem]">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} onClick={(e) => go(e, item.href)} className="link-line">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-6 lg:col-span-2">
            <Label>Social</Label>
            <ul className="mt-4 flex flex-col gap-2 text-[0.95rem]">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5">
                    <span className="link-line">{s.label}</span>
                    <ArrowUpRight size={12} className="opacity-50 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-12 lg:col-span-3 lg:col-start-10">
            <Label>Contact</Label>
            <a href={`mailto:${brand.email}`} className="link-line mt-4 inline-block text-[1.05rem] font-medium tracking-[-0.01em]">
              {brand.email}
            </a>
            <div className="mt-8 flex gap-10">
              {brand.cities.map((c) => (
                <div key={c.name}>
                  <Label className="block">{c.short}</Label>
                  <Clock tz={c.tz} className="mt-1 block text-[0.95rem]" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-[0.78rem] text-muted md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()} {brand.legal}
          </span>
          <span className="max-w-[48ch]">{footer.colophon}</span>
          <span className="flex items-center gap-6">
            <span className="tabular-nums">{footer.version}</span>
            <button type="button" onClick={(e) => go(e, '#top')} className="group inline-flex items-center gap-2 text-fg">
              <span className="link-line">Back to top</span>
              <ArrowUp size={12} className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5" />
            </button>
          </span>
        </div>
      </div>
    </Section>
  )
}
