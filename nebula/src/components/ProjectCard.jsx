'use client';

import Image from 'next/image';

/**
 * ProjectCard — one editorial plate.
 *
 * Ownership is explicit so two systems never fight over one property:
 *  GSAP owns the clip reveal (`.prj__media`) and the settle (`.prj__zoom`)
 *  CSS owns the hover lift, the image scale, the veil, the ring and the arrow
 *  GSAP owns the card's parallax offset while the rail is being scrubbed
 *
 * Every hover effect is a transform or an opacity on a composited layer — no
 * blur, no filter animation, no layout property.
 */
export default function ProjectCard({ project, index, layout = 'rail' }) {
  const { id, title, category, year, role, blurb, image, width, height, stack, outcome } = project;

  return (
    <article
      data-project-card
      data-cursor="view"
      data-cursor-label="VIEW"
      className={`prj group${layout === 'stack' ? ' prj--stack' : ''}`}
    >
      <span className="prj__num" aria-hidden="true">
        {id}
      </span>

      <a href="#contact" className="prj__link" aria-label={`${title} — ${category}. Open case`}>
        <div className="prj__lift">
          <div className="prj__head">
            <span className="num text-halo/70 transition-colors duration-500 group-hover:text-halo">
              {id}
            </span>
            <span className="eyebrow text-[9px]">{category}</span>
            <span className="eyebrow eyebrow--dim ml-auto text-[9px] sm:ml-0">{year}</span>
          </div>

          <h3 className="prj__title" data-reveal-meta>
            {title}
          </h3>

          <div className="prj__media" data-reveal-frame>
            <div className="prj__zoom" data-reveal-media>
              <Image
                src={image}
                alt={`${title} — ${category} project visual`}
                width={width}
                height={height}
                loading={layout === 'rail' && index === 0 ? 'eager' : 'lazy'}
                quality={78}
                sizes={
                  layout === 'rail'
                    ? '(min-width: 1536px) 42vw, (min-width: 1280px) 48vw, 56vw'
                    : '92vw'
                }
              />
            </div>
            <span className="prj__wash" aria-hidden="true" />
            <span className="prj__glow" aria-hidden="true" />
            <span className="prj__frame" aria-hidden="true" />
            <span className="prj__go" aria-hidden="true">
              ↗
            </span>
            <span className="prj__outcome" aria-hidden="true">
              {outcome}
            </span>
          </div>

          <ul className="prj__stack" aria-label="Built with">
            {stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>

          <div className="prj__foot" data-reveal-meta>
            <p className="prj__desc">{blurb}</p>
            <p className="eyebrow eyebrow--dim shrink-0 text-right text-[9px]">
              {role}
              <span className="mt-1 block text-halo/80">OPEN CASE ↗</span>
            </p>
          </div>
        </div>
      </a>
    </article>
  );
}
