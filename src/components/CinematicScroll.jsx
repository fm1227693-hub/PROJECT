import React, { useEffect, useRef } from 'react';
import './CinematicScroll.css';

export default function CinematicScroll({ backgroundComponent = null }) {
    const containerRef = useRef(null);

    // State variables
    const currentScrollRef = useRef(0);
    const mouseXRef = useRef(0);
    const mouseYRef = useRef(0);
    const targetMouseXRef = useRef(0);
    const targetMouseYRef = useRef(0);
    
    const cursorXRef = useRef(window.innerWidth / 2);
    const cursorYRef = useRef(window.innerHeight / 2);
    const outerCursorXRef = useRef(window.innerWidth / 2);
    const outerCursorYRef = useRef(window.innerHeight / 2);

    const reqIdRef = useRef(null);

    useEffect(() => {
        function splitTitlesIntoChars() {
            if (!containerRef.current) return;
            const titles = containerRef.current.querySelectorAll('.slide-title');
            titles.forEach(title => {
                if (title.getAttribute('data-split') === 'true') return;
                const text = title.innerHTML;
                let newHTML = '';
                let delayCounter = 0;
                const parts = text.split(/(<br\s*\/?>)/i);
                parts.forEach(part => {
                    if (part.toLowerCase().startsWith('<br')) {
                        newHTML += part;
                    } else {
                        for (let i = 0; i < part.length; i++) {
                            if (part[i] === ' ') {
                                newHTML += ' ';
                            } else {
                                newHTML += `<span class="char" style="--char-delay: ${delayCounter * 0.035}s">${part[i]}</span>`;
                                delayCounter++;
                            }
                        }
                    }
                });
                title.innerHTML = newHTML;
                title.setAttribute('data-split', 'true');
            });
        }

        function updateGridDots(scroll) {
            if (!containerRef.current) return;
            const dots = containerRef.current.querySelectorAll('.grid-dot');
            dots.forEach((dot, i) => {
                const startY = (i * 17) % 80 + 10;
                let speed = 90 + (i * 55) % 180;
                if (i % 2 === 0) speed = -speed;
                let y = startY + scroll * speed;
                y = ((y % 100) + 100) % 100;
                dot.style.top = `${y}%`;
            });
        }

        function updateSlides(scroll) {
            if (!containerRef.current) return;
            const slide1 = containerRef.current.querySelector('#slide-1');
            const slide2 = containerRef.current.querySelector('#slide-2');
            const slide3 = containerRef.current.querySelector('#slide-3');
            const slide4 = containerRef.current.querySelector('#slide-4');

            for (let i = 1; i <= 4; i++) {
                const fill = containerRef.current.querySelector(`#dash-fill-${i}`);
                if (fill) {
                    const start = (i - 1) * 0.25;
                    const end = i * 0.25;
                    let progress = (scroll - start) / (end - start);
                    progress = Math.max(0, Math.min(1, progress));
                    fill.style.height = `${progress * 100}%`;
                }
            }

            function isActive(val, start, end) { return val >= start && val <= end; }

            if (slide1) slide1.classList.toggle('active', isActive(scroll, -0.10, 0.12));
            if (slide2) {
                const active2 = isActive(scroll, 0.28, 0.40);
                slide2.classList.toggle('active', active2);
                const slide2Img = containerRef.current.querySelector('#slide-2-img');
                if (slide2Img) slide2Img.classList.toggle('active', active2);
            }
            if (slide3) slide3.classList.toggle('active', isActive(scroll, 0.56, 0.68));
            if (slide4) slide4.classList.toggle('active', isActive(scroll, 0.84, 1.05));
        }

        function animate() {
            reqIdRef.current = requestAnimationFrame(animate);

            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const targetScroll = maxScroll > 0 ? scrollTop / maxScroll : 0;

            currentScrollRef.current += (targetScroll - currentScrollRef.current) * 0.025;
            const scroll = currentScrollRef.current;

            mouseXRef.current += (targetMouseXRef.current - mouseXRef.current) * 0.05;
            mouseYRef.current += (targetMouseYRef.current - mouseYRef.current) * 0.05;

            outerCursorXRef.current += (cursorXRef.current - outerCursorXRef.current) * 0.2;
            outerCursorYRef.current += (cursorYRef.current - outerCursorYRef.current) * 0.2;
            
            if (containerRef.current) {
                const cursorOuter = containerRef.current.querySelector('.cursor-outer');
                if (cursorOuter) { 
                    cursorOuter.style.left = `${outerCursorXRef.current}px`; 
                    cursorOuter.style.top = `${outerCursorYRef.current}px`; 
                }
            }

            updateSlides(scroll);
            updateGridDots(scroll);
        }

        const handleMouseMove = (event) => {
            cursorXRef.current = event.clientX;
            cursorYRef.current = event.clientY;
            if (containerRef.current) {
                const cursorInner = containerRef.current.querySelector('.cursor-inner');
                if (cursorInner) { 
                    cursorInner.style.left = `${cursorXRef.current}px`; 
                    cursorInner.style.top = `${cursorYRef.current}px`; 
                }
            }
            targetMouseXRef.current = (event.clientX / window.innerWidth) * 2 - 1;
            targetMouseYRef.current = (event.clientY / window.innerHeight) * 2 - 1;
        };

        splitTitlesIntoChars();
        animate();

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
        };
    }, []);

    const handleNavClick = (index) => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const targetScrolls = [0.0, 0.34, 0.62, 0.94];
        window.scrollTo({ top: maxScroll * targetScrolls[index], behavior: 'smooth' });
    };

    return (
        <div className="landing-page cinematic-layout" ref={containerRef}>
            <div className="cursor-inner"></div>
            <div className="cursor-outer"></div>

            <div className="cinematic-bg-layer">
                {backgroundComponent}
            </div>

            <div className="cinematic-container">
                <div className="main-header">
                    <div className="brand" style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>OPTIMUM</span>
                    </div>
                    <nav className="header-nav">
                        <span className="nav-link" style={{cursor: 'pointer'}} onClick={() => handleNavClick(0)}>MOCK & AI</span>
                        <span className="nav-dot"></span>
                        <span className="nav-link" style={{cursor: 'pointer'}} onClick={() => handleNavClick(1)}>PRACTICE</span>
                        <span className="nav-dot"></span>
                        <span className="nav-link" style={{cursor: 'pointer'}} onClick={() => handleNavClick(2)}>ANALYTICS</span>
                        <span className="nav-dot"></span>
                        <span className="nav-link" style={{cursor: 'pointer'}} onClick={() => handleNavClick(3)}>SUCCESS</span>
                    </nav>
                    <div className="header-actions">
                        <button className="login-btn">Log in</button>
                        <button className="contact-btn">Sign up <span className="btn-circle"></span></button>
                    </div>
                </div>

                <div className="slide" id="slide-1">
                    <h2 className="slide-title">IELTS natijangizni <br/>CDI Mock & AI</h2>
                    <div className="desc-row">
                        <p className="slide-desc col-1">Optimum o‘quv platformasi barcha darajadagi o‘quvchilar uchun CDI simulatori va AI tahlillari orqali 7.5+ Band natijalarini ta’minlaydi.</p>
                        <p className="slide-desc col-2">Optimum IELTS Hub orqali Target 8.5 ga erishing. Universal tizim va to'liq imtihon amaliyoti sizning xizmatingizda.</p>
                    </div>
                </div>
                
                <div className="slide" id="slide-2">
                    <h2 className="slide-title">Extensive <br/>Practice Library</h2>
                    <p className="slide-desc">100 dan ortiq mock testlar va Authentic Exam UI orqali o'zingizni haqiqiy imtihondagidek his eting va tayyorgarlik ko'ring.</p>
                </div>
                
                <div className="slide" id="slide-3">
                    <h2 className="slide-title">Detailed <br/>Analytics</h2>
                    <p className="slide-desc">O'zlashtirish jarayonini to'liq kuzatib boring (Track Your Progress). Har bir test uchun mukammal statistik ma'lumotlar oling.</p>
                </div>
                
                <div className="slide" id="slide-4">
                    <h2 className="slide-title">Universal <br/>Success Rate</h2>
                    <p className="slide-desc">10,000 dan ortiq o'quvchilar biz bilan 7.5+ natijaga erishdi. Optimum platformasi bilan maqsadingizga erishing.</p>
                </div>
            </div>

            <div className="slide-image-mask" id="slide-2-img">
                <img src="https://api.getlayers.ai/storage/v1/object/public/public/assets/laocoon-59f84455c6/1.png" alt="Editorial Concept" />
            </div>

            {/* Grid Overlay for extra cinematic feel */}
            <div className="grid-horizontal-line"></div>
            <div className="grid-lines">
                <div className="grid-line"><div className="grid-dot"></div></div>
                <div className="grid-line"><div className="grid-dot"></div></div>
                <div className="grid-line"><div className="grid-dot"></div></div>
                <div className="grid-line"><div className="grid-dot"></div></div>
            </div>

            <div className="story-dashes">
                <div className="story-dash"><div className="story-dash-fill" id="dash-fill-1"></div></div>
                <div className="story-dash"><div className="story-dash-fill" id="dash-fill-2"></div></div>
                <div className="story-dash"><div className="story-dash-fill" id="dash-fill-3"></div></div>
                <div className="story-dash"><div className="story-dash-fill" id="dash-fill-4"></div></div>
            </div>
        </div>
    );
}
