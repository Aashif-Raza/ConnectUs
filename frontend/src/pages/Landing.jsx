import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/landing.css'

export default function LandingPage() {
    const router = useNavigate()
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className='landing-root'>
            {/* ─── NAV ─────────────────────────────────────────────── */}
            <header className={`landing-nav${scrolled ? ' landing-nav--scrolled' : ''}`}>
                <div className='landing-nav__brand'>
                    <span className='brand-dot'></span>
                    <h2>Connect<span>Us</span></h2>
                </div>

                {/* desktop links */}
                <nav className='landing-nav__links'>
                    <button className='nav-link' onClick={() => router('/aljk23')}>Join as Guest</button>
                    <button className='nav-link' onClick={() => router('/auth')}>Register</button>
                    <button className='nav-btn' onClick={() => router('/auth')}>Login</button>
                </nav>

                {/* mobile hamburger */}
                <button
                    className={`hamburger${menuOpen ? ' hamburger--open' : ''}`}
                    onClick={() => setMenuOpen(prev => !prev)}
                    aria-label="Toggle menu"
                >
                    <span /><span /><span />
                </button>
            </header>

            {/* mobile drawer */}
            <div className={`mobile-drawer${menuOpen ? ' mobile-drawer--open' : ''}`}>
                <button className='nav-link' onClick={() => { router('/aljk23'); setMenuOpen(false) }}>Join as Guest</button>
                <button className='nav-link' onClick={() => { router('/auth'); setMenuOpen(false) }}>Register</button>
                <button className='nav-btn mobile-login' onClick={() => { router('/auth'); setMenuOpen(false) }}>Login</button>
            </div>

            {/* ─── HERO ─────────────────────────────────────────────── */}
            <section className='hero'>
                <div className='hero__text'>
                    <span className='hero__eyebrow'>Video Conferencing — Reimagined</span>
                    <h1 className='hero__headline'>
                        Connect with anyone,<br />
                        <span>anywhere, anytime.</span>
                    </h1>
                    <p className='hero__sub'>
                        Crystal-clear video calls built for reliability, speed, and security.
                        No downloads. No friction. Just connection.
                    </p>
                    <div className='hero__cta-group'>
                        <Link to='/auth' className='cta-primary'>Get Started — It's Free</Link>
                        <button className='cta-ghost' onClick={() => router('/aljk23')}>Try as Guest →</button>
                    </div>
                </div>

                <div className='hero__visual'>
                    <div className='hero__img-wrapper'>
                        <img src='/hero.png' alt='ConnectUs video call preview' />
                    </div>
                </div>
            </section>

            {/* ─── FEATURES ─────────────────────────────────────────── */}
            <section className='features'>
                <h2 className='features__title'>Everything you need. Nothing you don't.</h2>
                <div className='features__grid'>
                    {[
                        {
                            icon: (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                </svg>
                            ),
                            title: 'Instant Rooms',
                            desc: 'Start a meeting in one click — no scheduling required.',
                        },
                        {
                            icon: (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            ),
                            title: 'End-to-End Secure',
                            desc: 'Your conversations stay private with enterprise-grade encryption.',
                        },
                        {
                            icon: (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="2" y1="12" x2="22" y2="12" />
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                </svg>
                            ),
                            title: 'Global Reach',
                            desc: 'Low-latency calls across the globe with WebRTC infrastructure.',
                        },
                        {
                            icon: (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="3" width="20" height="14" rx="2" />
                                    <polyline points="8 21 12 17 16 21" />
                                    <line x1="12" y1="17" x2="12" y2="21" />
                                </svg>
                            ),
                            title: 'Screen Sharing',
                            desc: 'Share your screen seamlessly during any live session.',
                        },
                    ].map(f => (
                        <div className='feature-card' key={f.title}>
                            <span className='feature-icon'>{f.icon}</span>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── CTA BAND ─────────────────────────────────────────── */}
            <section className='cta-band'>
                <h2>Ready to connect?</h2>
                <p>Join thousands of teams already using ConnectUs every day.</p>
                <Link to='/auth' className='cta-primary cta-primary--large'>Create Your Free Account</Link>
            </section>

            {/* ─── FOOTER ───────────────────────────────────────────── */}
            <footer className='landing-footer'>
                <span className='footer-brand'>ConnectUs</span>
                <span className='footer-copy'>© {new Date().getFullYear()} ConnectUs. All rights reserved.</span>
            </footer>
        </div>
    )
}