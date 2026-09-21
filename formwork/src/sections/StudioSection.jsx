import { useRef } from 'react'
import Section from '../components/Section'
import Label from '../components/Label'
import EditorialText from '../components/EditorialText'
import ImageReveal from '../components/ImageReveal'
import Clock from '../components/Clock'
import { useGsap } from '../hooks/useGsap'
import { useScroll } from '../context/scroll'
import { applyParallax, rise } from '../animations/scrollAnimations'
import { studio, brand } from '../data/content'

function Caption({ city, tz }) {
  return (
    <div className="mt-3 flex items-center justify-between">
      <Label>{city}</Label>
      <Label>
        <Clock tz={tz} /> local
      </Label>
    </div>
  )
}

/** Two studios, one team — copy on the left, two images at different depths on the right. */
export default function StudioSection() {
  const ref = useRef(null)
  const { caps } = useScroll()

  useGsap(() => {
    applyParallax(ref.current, caps.parallax)
    rise(ref.current.querySelectorAll('[data-fact]'), { reduced: caps.reduced, stagger: 0.1 })
  }, ref, [caps.parallax, caps.reduced])

  const [ams, tas] = brand.cities

  return (
    <Section ref={ref} id="studio" theme="paper" className="overflow-x-clip py-[14vh] lg:py-[20vh]" aria-labelledby="studio-title">
      <div className="container-x grid-12 gap-y-14">
        <div className="col-span-12 lg:col-span-5">
          <div className="flex items-center gap-4">
            <Label>{studio.index}</Label>
            <span className="h-px w-8 bg-line" />
            <Label as="h2" id="studio-title">
              {studio.label}
            </Label>
          </div>
          <EditorialText as="p" className="display mt-8 text-[clamp(2.6rem,11vw,4rem)] lg:text-[clamp(3rem,5.2vw,6.4rem)]">
            {studio.heading[0]}
            <br />
            <span className="serif-italic">{studio.heading[1]}</span>
          </EditorialText>
          <p className="mt-8 max-w-[40ch] text-[0.95rem] leading-[1.55] text-muted lg:text-[1.05rem]">{studio.body}</p>

          <dl className="mt-12 grid grid-cols-3 gap-6 border-t hairline pt-6 lg:mt-16">
            {studio.facts.map(([n, l]) => (
              <div key={l} data-fact>
                <dt className="sr-only">{l}</dt>
                <dd className="display text-[clamp(1.8rem,6vw,2.4rem)] lg:text-[clamp(2rem,2.6vw,3rem)]">{n}</dd>
                <dd className="label mt-2 text-muted">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative col-span-12 lg:col-span-6 lg:col-start-7">
          <div data-parallax="-80" className="will-change-transform lg:mt-[8vh] lg:ml-[10%]">
            <ImageReveal src={studio.images[0].src} alt={studio.images[0].alt} width={studio.images[0].w} height={studio.images[0].h} className="aspect-[3/2] rounded-xl" sizes="(max-width: 1024px) 100vw, 45vw" />
            <Caption city={ams.name} tz={ams.tz} />
          </div>
          <div data-parallax="70" className="-mt-10 w-[58%] max-w-[300px] will-change-transform lg:absolute lg:bottom-[-16%] lg:left-[-8%] lg:mt-0 lg:w-[40%]">
            <ImageReveal src={studio.images[1].src} alt={studio.images[1].alt} width={studio.images[1].w} height={studio.images[1].h} className="aspect-[4/5] rounded-xl shadow-[0_40px_80px_-40px_rgba(15,15,16,0.45)]" sizes="(max-width: 1024px) 58vw, 20vw" />
            <Caption city={tas.name} tz={tas.tz} />
          </div>
        </div>
      </div>
    </Section>
  )
}
