/* =====================================================================
   PAGE / CONTACT
   The dark destination. The plasma orb behind the form is the page's
   heartbeat: it wakes when a field takes focus, pulses with every
   keystroke, flares when a budget is chosen and bursts on send.
   ===================================================================== */
import { gsap, ScrollTrigger } from '../core/vendor.js';
import { state, bus } from '../core/state.js';
import { scroll } from '../core/scroll.js';
import { cursor } from '../core/cursor.js';
import { bindReveals } from '../components/textReveal.js';
import { magnetic } from '../components/magnetic.js';
import { byId, qs, qsa, clamp } from '../core/utils.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export const contactPage = {
  route: '/contact',
  sys: null,
  pageEl: null,
  form: null,
  energy: 0.34,
  clockAcc: 0,
  sent: false,

  mount(pageEl, sys) {
    this.pageEl = pageEl;
    this.sys = sys;
    this.form = byId('contactForm');
    this.sent = false;

    this.buildFields();
    this.bindForm(sys);
    this.createHeroScroll(sys);
    this.createFormScroll(sys);
    this.bindClock(sys);

    bindReveals(pageEl, sys);
    magnetic.scan(pageEl);
    state.page.focus = 0.34;

    /* a project plate on /work can hand us a pre-filled brief */
    if (state.pendingBrief) {
      const msg = byId('fMsg');
      if (msg) {
        msg.value = state.pendingBrief;
        msg.classList.add('filled');
        setTimeout(() => msg.focus({ preventScroll: true }), 700);
        this.energy = 0.8;
      }
      state.pendingBrief = null;
    }

    const ok = byId('formOk');
    if (ok) ok.classList.remove('on');
    if (this.form) this.form.style.display = '';
    scroll.refresh();
  },

  buildFields() {
    qsa('.field', this.pageEl).forEach(f => {
      if (!f.querySelector('.focus-glow')) {
        const g = document.createElement('span');
        g.className = 'focus-glow';
        f.appendChild(g);
      }
      if (!f.querySelector('.msg')) {
        const m = document.createElement('span');
        m.className = 'msg mono';
        f.appendChild(m);
      }
    });
  },

  bindForm(sys) {
    const fields = qsa('.field input, .field textarea', this.pageEl);
    fields.forEach(input => {
      sys.on(input, 'focus', () => {
        this.energy = Math.max(this.energy, 0.72);
        bus.emit('contact:focus', input.id);
        gsap.fromTo(input.closest('.field'), { y: 4 }, { y: 0, duration: 0.6, ease: 'expo.out' });
      });
      sys.on(input, 'blur', () => {
        input.closest('.field').classList.remove('err');
      });
      sys.on(input, 'input', () => {
        /* every keystroke feeds the orb — typing has a physical consequence */
        this.energy = clamp(this.energy + 0.16, 0, 1.35);
        input.closest('.field').classList.remove('err');
      });
    });

    const budget = byId('budget');
    if (budget) {
      qsa('button', budget).forEach(btn => {
        sys.on(btn, 'click', () => {
          qsa('button', budget).forEach(b => b.classList.toggle('on', b === btn));
          this.energy = 1.1;
          gsap.fromTo(btn, { scale: 0.9 }, { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
          bus.emit('contact:budget', btn.textContent);
        });
      });
    }

    if (this.form) {
      sys.on(this.form, 'submit', e => {
        e.preventDefault();
        this.submit();
      });
    }
  },

  validate() {
    let ok = true;
    const checks = [
      ['fName', v => v.trim().length > 1, 'Tell us who you are'],
      ['fEmail', v => EMAIL.test(v.trim()), 'A valid email, please'],
      ['fMsg', v => v.trim().length > 9, 'A sentence or two about the project']
    ];
    checks.forEach(([id, test, msg]) => {
      const input = byId(id);
      if (!input) return;
      const field = input.closest('.field');
      const good = test(input.value || '');
      field.classList.toggle('err', !good);
      const m = field.querySelector('.msg');
      if (m) m.textContent = good ? '' : msg;
      if (!good) {
        ok = false;
        gsap.fromTo(field, { x: -8 }, { x: 0, duration: 0.7, ease: 'elastic.out(1.6, 0.4)' });
      }
    });
    return ok;
  },

  submit() {
    if (this.sent) return;
    if (!this.validate()) {
      this.energy = 1.25;
      cursor.setMode('default', true);
      bus.emit('contact:error');
      return;
    }
    this.sent = true;
    this.energy = 1.5;
    bus.emit('contact:send', {
      name: byId('fName').value,
      email: byId('fEmail').value,
      budget: (qs('#budget button.on') || {}).textContent || '—'
    });

    const btn = byId('submitBtn');
    if (btn) {
      gsap.fromTo(btn, { scale: 0.94 }, { scale: 1, duration: 1, ease: 'elastic.out(1, 0.45)' });
      btn.textContent = 'Sent ✓';
    }

    /* the orb flares, then the form hands over to the confirmation */
    gsap.to(this.form, {
      opacity: 0, y: -26, filter: 'blur(8px)', duration: 0.7, ease: 'power2.in',
      onComplete: () => {
        this.form.style.display = 'none';
        const ok = byId('formOk');
        if (ok) {
          ok.classList.add('on');
          gsap.fromTo(ok, { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'expo.out' });
          const kids = [ok.querySelector('.eyebrow'), ok.querySelector('h3'), ok.querySelector('p')];
          kids.forEach((n, i) => {
            if (!n) return;
            gsap.fromTo(n, { opacity: 0, y: 18 }, {
              opacity: i === 2 ? 0.62 : 1, y: 0, duration: 0.85, delay: 0.22 + i * 0.1, ease: 'power3.out'
            });
          });
        }
      }
    });
    this.form.reset && setTimeout(() => this.form.reset(), 900);
  },

  createHeroScroll(sys) {
    const hero = qs('.contact-hero', this.pageEl);
    if (!hero) return;
    const h1 = qs('h1', hero);
    const eye = qs('.eyebrow', hero);
    sys.add(ScrollTrigger.create({
      trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.45,
      onUpdate: self => {
        const p = self.progress;
        if (h1) gsap.set(h1, { y: p * -80, opacity: clamp(1 - p * 1.25, 0, 1), letterSpacing: (p * 0.04).toFixed(3) + 'em' });
        if (eye) gsap.set(eye, { y: p * -30, opacity: clamp(1 - p * 1.8, 0, 1) });
      }
    }));
  },

  createFormScroll(sys) {
    const grid = qs('.contact-grid', this.pageEl);
    if (!grid) return;
    const fields = qsa('.field, .budget-label, .budget, .btn-huge', grid);
    const side = qsa('.contact-side .block', grid);

    fields.forEach((f, i) => {
      gsap.set(f, { opacity: 0, y: 40, rotateX: -8 });
      sys.add(ScrollTrigger.create({
        trigger: f, start: 'top 94%', once: true,
        onEnter: () => gsap.to(f, { opacity: 1, y: 0, rotateX: 0, duration: 1.05, ease: 'expo.out', delay: i * 0.045 })
      }));
    });
    side.forEach((b, i) => {
      gsap.set(b, { opacity: 0, x: 40 });
      sys.add(ScrollTrigger.create({
        trigger: b, start: 'top 94%', once: true,
        onEnter: () => gsap.to(b, { opacity: 1, x: 0, duration: 1, ease: 'expo.out', delay: i * 0.08 })
      }));
    });

    /* scroll position inside the form modulates the orb as well */
    sys.add(ScrollTrigger.create({
      trigger: grid, start: 'top 80%', end: 'bottom 40%', scrub: 0.5,
      onUpdate: self => {
        state.page.formP = self.progress;
      }
    }));
  },

  bindClock(sys) {
    const clock = byId('clock');
    if (!clock) return;
    sys.ticker(dt => {
      this.clockAcc += dt;
      if (this.clockAcc < 1) return;
      this.clockAcc = 0;
      const d = new Date();
      const p = n => String(n).padStart(2, '0');
      clock.textContent = `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`;
    });
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    clock.textContent = `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`;
  },

  tick(dt) {
    /* keystroke energy decays back to a resting glow */
    const rest = 0.3 + (state.page.formP || 0) * 0.3;
    this.energy += (rest - this.energy) * Math.min(1, dt * 2.2);
    state.page.focus = clamp(this.energy, 0, 1.5);
  },

  destroy() {
    magnetic.release(this.pageEl || document);
    state.page.focus = 0;
    state.page.formP = 0;
    this.energy = 0.34;
    this.pageEl = null;
    this.sys = null;
  }
};

export default contactPage;
