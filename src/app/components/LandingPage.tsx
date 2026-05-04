'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const features = [
  { icon: '⚡', title: 'High-Speed WiFi', desc: 'Fiber-optic internet throughout all floors, perfect for online classes and late-night research sessions.' },
  { icon: '🍽️', title: 'Daily Meals', desc: 'Nutritious breakfast, lunch and dinner prepared fresh by our in-house kitchen staff every day.' },
  { icon: '🛡️', title: '24/7 Security', desc: 'Round-the-clock CCTV surveillance and security personnel ensuring your complete peace of mind.' },
  { icon: '📖', title: 'Study Rooms', desc: 'Dedicated quiet study halls with whiteboards, projectors, and ergonomic seating for focused work.' },
  { icon: '🧺', title: 'Laundry Service', desc: 'On-site washers and dryers with weekly laundry service available for all residents on request.' },
  { icon: '❄️', title: 'AC Rooms', desc: 'Every room is fully air-conditioned for a comfortable and productive living experience year-round.' },
]

const stats = [
  { value: '50+', label: 'Rooms Available' },
  { value: '300+', label: 'Students Hosted' },
  { value: '5+', label: 'Years of Service' },
  { value: '98%', label: 'Satisfaction Rate' },
]

const testimonials = [
  { name: 'Ahmed Khan', role: 'Engineering Student', text: 'Life Star Hostel has been my home for 3 years. The facilities are excellent and the management is always responsive and caring.' },
  { name: 'Sara Ali', role: 'Medical Student', text: 'The study rooms and fast WiFi have been crucial for my studies. I can focus completely knowing everything is well taken care of.' },
  { name: 'Bilal Hassan', role: 'Business Student', text: 'Best hostel in the city by far. Clean rooms, great food, and a wonderful student community. Highly recommend to every student.' },
]

const highlights = [
  'Room Management',
  'Student Records',
  'Fee Tracking',
  'Menu Planning',
]

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [stars, setStars] = useState<Array<{ top: string; left: string; delay: string; dur: string }>>([])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setStars(
      Array.from({ length: 28 }, () => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${(Math.random() * 3).toFixed(2)}s`,
        dur: `${(2 + Math.random() * 3).toFixed(2)}s`,
      })),
    )
  }, [])

  return (
    <div
      className="min-h-screen bg-[#060D1E] text-white overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,600&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#060D1E]/95 backdrop-blur-md border-b border-white/5 shadow-xl shadow-black/40' : ''
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4A843] to-[#F0C866] flex items-center justify-center text-[#060D1E] font-bold text-base leading-none select-none">
              ★
            </div>
            <span className="font-semibold text-white text-lg tracking-tight">Life Star</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-[#8B9CC0] hover:text-white transition-colors rounded-xl hover:bg-white/5"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-[#D4A843] to-[#E8B84B] hover:from-[#E8B84B] hover:to-[#F0C866] text-[#060D1E] rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#D4A843]/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#1A3A6E]/25 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#D4A843]/8 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#0A1E3D]/40 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
          {stars.map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/40"
              style={{
                width: '2px',
                height: '2px',
                top: s.top,
                left: s.left,
                animation: `starPulse ${s.dur} ease-in-out infinite`,
                animationDelay: s.delay,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/20 text-[#D4A843] text-xs font-medium mb-8 select-none">
              <span>★</span>
              <span>Premium Student Accommodation</span>
            </div>
            <h1
              className="text-5xl lg:text-[64px] font-bold leading-[1.1] mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Your Home<br />
              <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4A843] to-[#F0C866]">
                Away From
              </em>
              <br />Home
            </h1>
            <p className="text-lg text-[#8B9CC0] leading-relaxed mb-10 max-w-lg">
              Life Star Hostel offers modern, comfortable accommodation designed for students who deserve the
              best — safe, well-equipped, and managed with genuine care.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#D4A843] to-[#E8B84B] text-[#060D1E] font-semibold rounded-xl hover:shadow-xl hover:shadow-[#D4A843]/25 hover:-translate-y-0.5 transition-all duration-200 text-sm"
              >
                Get Started Free
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M2 7h10M8 3l4 4-4 4" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium rounded-xl transition-all duration-200 text-sm"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right decorative card */}
          <div className="hidden lg:block relative">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0D1F3C] to-[#060D1E] border border-white/10 p-8 shadow-2xl shadow-black/60">
              <div className="absolute top-0 right-0 w-56 h-56 bg-[#D4A843]/5 rounded-full blur-3xl" />
              <div className="flex items-center gap-3 mb-7">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4A843] to-[#F0C866] flex items-center justify-center text-[#060D1E] text-xl font-bold">
                  ★
                </div>
                <div>
                  <p className="font-semibold text-white leading-tight">Life Star Hostel</p>
                  <p className="text-xs text-[#8B9CC0] mt-0.5">Management Portal</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {stats.map((s) => (
                  <div key={s.label} className="bg-white/[0.04] rounded-2xl p-4 border border-white/5">
                    <p
                      className="text-2xl font-bold text-[#D4A843]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {s.value}
                    </p>
                    <p className="text-xs text-[#8B9CC0] mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2.5">
                {highlights.map((h) => (
                  <div key={h} className="flex items-center gap-3 text-sm text-[#8B9CC0]">
                    <div className="w-4 h-4 rounded-full bg-[#D4A843]/15 flex items-center justify-center flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4A843]" />
                    </div>
                    {h}
                  </div>
                ))}
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-5 -left-5 bg-gradient-to-br from-[#D4A843] to-[#E8B84B] rounded-2xl px-5 py-3.5 text-[#060D1E] shadow-xl shadow-[#D4A843]/30">
              <p className="text-xl font-bold leading-none">★★★★★</p>
              <p className="text-xs font-semibold mt-1.5">Student Rated</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-white/[0.015]">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p
                className="text-4xl font-bold text-[#D4A843] mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {s.value}
              </p>
              <p className="text-sm text-[#8B9CC0]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section className="py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
              World-Class Amenities
            </p>
            <h2
              className="text-4xl lg:text-5xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Everything You Need
            </h2>
            <p className="mt-4 text-[#8B9CC0] max-w-lg mx-auto leading-relaxed">
              We&apos;ve thoughtfully designed every aspect of hostel life so you can focus on what truly matters
              — your education and personal growth.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-7 rounded-2xl bg-white/[0.025] border border-white/5 hover:border-[#D4A843]/25 hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-white mb-2 text-[15px]">{f.title}</h3>
                <p className="text-sm text-[#8B9CC0] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ───────────────────────────────────────────────────────── */}
      <section className="py-28 bg-white/[0.015] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="rounded-3xl bg-gradient-to-br from-[#0D1F3C] to-[#060D1E] border border-white/10 p-12 flex items-center justify-center min-h-72 overflow-hidden">
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, rgba(212,168,67,1) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              <div className="relative text-center">
                <div className="text-7xl mb-5 select-none">🏠</div>
                <p
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Life Star Hostel
                </p>
                <p className="text-[#8B9CC0] mt-2 text-sm">Established 2019</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-[#D4A843] to-[#E8B84B] rounded-2xl px-6 py-4 text-[#060D1E] shadow-xl shadow-[#D4A843]/25">
              <p
                className="text-2xl font-bold leading-none"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                5+ Years
              </p>
              <p className="text-xs font-semibold mt-1.5">of Excellence</p>
            </div>
          </div>
          <div>
            <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.18em] mb-3">About Us</p>
            <h2
              className="text-4xl lg:text-5xl font-bold leading-tight mb-6 text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Built for<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A843] to-[#F0C866]">
                Student Success
              </span>
            </h2>
            <p className="text-[#8B9CC0] leading-relaxed mb-5">
              Since 2019, Life Star Hostel has been dedicated to providing students with a safe, comfortable,
              and inspiring place to live. We understand that where you live profoundly affects how you learn.
            </p>
            <p className="text-[#8B9CC0] leading-relaxed mb-9">
              Our hostel is managed with full transparency and genuine care — ensuring every student&apos;s needs are
              met while maintaining the highest standards of cleanliness, security, and community spirit.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {['Safe & Secure Environment', 'Transparent Fee Management', 'Professional Wardens', 'Vibrant Student Community'].map((point) => (
                <div key={point} className="flex items-start gap-2.5 text-sm text-[#CBD5E1]">
                  <span className="text-[#D4A843] mt-0.5 flex-shrink-0">✓</span>
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────── */}
      <section className="py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.18em] mb-3">Testimonials</p>
            <h2
              className="text-4xl lg:text-5xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              What Students Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="p-7 rounded-2xl bg-white/[0.025] border border-white/5 hover:border-[#D4A843]/20 transition-colors duration-300"
              >
                <p className="text-[#D4A843] text-base mb-4 tracking-wide">★★★★★</p>
                <p className="text-[#8B9CC0] text-sm leading-relaxed mb-7">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4A843]/30 to-[#D4A843]/10 flex items-center justify-center text-[#D4A843] font-bold text-sm flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm leading-tight">{t.name}</p>
                    <p className="text-[#8B9CC0] text-xs mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-28 border-t border-white/5">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.18em] mb-4">Ready?</p>
          <h2
            className="text-4xl lg:text-5xl font-bold text-white mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Join Life Star Today
          </h2>
          <p className="text-[#8B9CC0] mb-10 leading-relaxed max-w-md mx-auto">
            Create your management account and streamline every aspect of your hostel operations — rooms,
            students, fees, and menus — all in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-3.5 bg-gradient-to-r from-[#D4A843] to-[#E8B84B] text-[#060D1E] font-semibold rounded-xl hover:shadow-xl hover:shadow-[#D4A843]/25 hover:-translate-y-0.5 transition-all duration-200 text-sm"
            >
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium rounded-xl transition-all duration-200 text-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4A843] to-[#F0C866] flex items-center justify-center text-[#060D1E] font-bold text-sm select-none">
              ★
            </div>
            <span className="font-semibold text-white">Life Star Hostel</span>
          </div>
          <p className="text-xs text-[#4A5568]">
            © {new Date().getFullYear()} Life Star Hostel. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-xs text-[#8B9CC0] hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="text-xs text-[#8B9CC0] hover:text-white transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes starPulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(2.5); }
        }
      `}</style>
    </div>
  )
}
