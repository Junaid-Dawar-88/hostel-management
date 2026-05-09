'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

const features = [
  'Manage rooms & bed assignments',
  'Track student records & documents',
  'Monitor fee collection & dues',
  'Plan daily menus & meals',
  'Generate occupancy reports',
]

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Registration failed'); return }
      toast.success(`Account created! Welcome, ${data.name}!`)
      router.push('/')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .lsh-page {
          font-family: 'DM Sans', system-ui, sans-serif;
          min-height: 100vh;
          background: #080C14;
          position: relative;
          overflow: hidden;
        }

        .lsh-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(212,168,67,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,168,67,0.035) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
        }

        .lsh-glow-a {
          position: absolute;
          top: -240px;
          right: -180px;
          width: 680px;
          height: 680px;
          background: radial-gradient(circle, rgba(212,168,67,0.07) 0%, transparent 68%);
          pointer-events: none;
        }

        .lsh-glow-b {
          position: absolute;
          bottom: -160px;
          left: -120px;
          width: 480px;
          height: 480px;
          background: radial-gradient(circle, rgba(212,168,67,0.04) 0%, transparent 68%);
          pointer-events: none;
        }

        .lsh-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          padding: 36px 56px 40px;
          max-width: 860px;
          margin: 0 auto;
        }

        .lsh-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .lsh-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .lsh-logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #D4A843, #F0C866);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #080C14;
          font-weight: 700;
          font-size: 15px;
          flex-shrink: 0;
        }

        .lsh-logo-text {
          color: #F5F0E8;
          font-weight: 600;
          font-size: 15px;
          letter-spacing: -0.025em;
        }

        .lsh-signin-link {
          font-size: 13px;
          color: rgba(245,240,232,0.42);
          text-decoration: none;
          padding: 8px 18px;
          border: 1px solid rgba(245,240,232,0.08);
          border-radius: 6px;
          transition: color 0.2s, border-color 0.2s;
        }
        .lsh-signin-link:hover {
          color: rgba(245,240,232,0.75);
          border-color: rgba(245,240,232,0.16);
        }

        .lsh-hero {
          padding-top: 11vh;
          padding-bottom: 7vh;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .lsh-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          border-radius: 100px;
          background: rgba(212,168,67,0.07);
          border: 1px solid rgba(212,168,67,0.16);
          width: fit-content;
          margin-bottom: 30px;
        }

        .lsh-headline {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(44px, 6.5vw, 78px);
          font-weight: 600;
          line-height: 1.07;
          letter-spacing: -0.025em;
          color: #F5F0E8;
          margin: 0 0 22px;
        }

        .lsh-headline em {
          font-style: italic;
          color: #D4A843;
        }

        .lsh-sub {
          font-size: 16px;
          color: rgba(245,240,232,0.38);
          line-height: 1.75;
          max-width: 460px;
          margin: 0 0 48px;
          font-weight: 300;
        }

        .lsh-features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 13px 40px;
          margin-bottom: 56px;
          max-width: 500px;
        }

        .lsh-feature {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: rgba(245,240,232,0.48);
          font-weight: 400;
          letter-spacing: 0.005em;
        }

        .lsh-check {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(212,168,67,0.09);
          border: 1px solid rgba(212,168,67,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .lsh-cta {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 17px 38px;
          background: linear-gradient(130deg, #D4A843 0%, #F0C866 100%);
          border: none;
          border-radius: 5px;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 14.5px;
          font-weight: 600;
          color: #080C14;
          cursor: pointer;
          letter-spacing: 0.01em;
          position: relative;
          overflow: hidden;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .lsh-cta::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(130deg, rgba(255,255,255,0.18) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.22s;
        }
        .lsh-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 44px rgba(212,168,67,0.32);
        }
        .lsh-cta:hover::after { opacity: 1; }
        .lsh-cta:active { transform: translateY(0); }

        .lsh-footer-note {
          border-top: 1px solid rgba(245,240,232,0.05);
          padding-top: 22px;
        }

        /* ── Modal ── */
        .lsh-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(8,12,20,0.78);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.32s ease;
        }
        .lsh-backdrop.open {
          opacity: 1;
          pointer-events: all;
        }

        .lsh-drawer {
          position: relative;
          width: 100%;
          max-width: 520px;
          background: #FEFCF7;
          z-index: 101;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,168,67,0.1);
          transform: scale(0.94) translateY(12px);
          transition: transform 0.38s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.32s ease;
          opacity: 0;
        }
        .lsh-backdrop.open .lsh-drawer {
          transform: scale(1) translateY(0);
          opacity: 1;
        }

        .lsh-drawer-inner {
          padding: 36px 48px 32px;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .lsh-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid #E5E7EB;
          background: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9CA3AF;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
        }
        .lsh-close:hover {
          background: #F3F4F6;
          color: #374151;
          border-color: #D1D5DB;
        }

        .lsh-form-input {
          width: 100%;
          padding: 11px 14px;
          border-radius: 7px;
          border: 1.5px solid #E9EAEC;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 14px;
          color: #111827;
          outline: none;
          background: #FAFAFA;
          transition: border-color 0.18s, background 0.18s;
        }
        .lsh-form-input:focus {
          border-color: #D4A843;
          background: #fff;
        }
        .lsh-form-input::placeholder { color: #C4C6CB; }

        .lsh-google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 11px 16px;
          border-radius: 7px;
          border: 1.5px solid #E9EAEC;
          background: #fff;
          cursor: pointer;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          transition: background 0.15s, border-color 0.15s;
        }
        .lsh-google-btn:hover {
          background: #F9FAFB;
          border-color: #D1D5DB;
        }

        .lsh-submit {
          width: 100%;
          padding: 13px 16px;
          border-radius: 7px;
          background: #080C14;
          color: #F5F0E8;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.01em;
          transition: background 0.15s, opacity 0.15s;
          margin-top: 4px;
        }
        .lsh-submit:hover:not(:disabled) { background: #1a2235; }
        .lsh-submit:disabled { opacity: 0.55; cursor: not-allowed; }

        @media (max-width: 680px) {
          .lsh-content { padding: 24px 24px 32px; }
          .lsh-features { grid-template-columns: 1fr; }
          .lsh-drawer { max-width: 100%; }
          .lsh-drawer-inner { padding: 32px 24px 36px; }
        }
      `}</style>

      {/* ── Hero ────────────────────────────────────────────── */}
      <div className="lsh-page">
        <div className="lsh-grid" />
        <div className="lsh-glow-a" />
        <div className="lsh-glow-b" />

        <div className="lsh-content">
          {/* Nav */}
          <nav className="lsh-nav">
            <Link href="/" className="lsh-logo">
              <div className="lsh-logo-icon">★</div>
              <span className="lsh-logo-text">Life Star Hostel</span>
            </Link>
            <Link href="/login" className="lsh-signin-link">Sign in</Link>
          </nav>

          {/* Hero body */}
          <div className="lsh-hero">
            <div className="lsh-badge">
              <span style={{ color: '#D4A843', fontSize: 11 }}>★★★★★</span>
              <span style={{ color: 'rgba(212,168,67,0.8)', fontSize: 12, fontWeight: 500 }}>
                Trusted by wardens
              </span>
            </div>

            <h1 className="lsh-headline">
              Everything you need to<br />
              run a <em>great hostel</em>
            </h1>

            <p className="lsh-sub">
              One platform to manage rooms, students, fees, and menus —
              no spreadsheets required.
            </p>

            <div className="lsh-features">
              {features.map(f => (
                <div key={f} className="lsh-feature">
                  <div className="lsh-check">
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="#D4A843" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {f}
                </div>
              ))}
            </div>

            <button className="lsh-cta" onClick={() => setPanelOpen(true)}>
              Get Started — it&apos;s free
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Footer */}
          <div className="lsh-footer-note">
            <p style={{ color: 'rgba(245,240,232,0.16)', fontSize: 12, margin: 0 }}>
              Free to set up. No credit card needed.
            </p>
          </div>
        </div>
      </div>

      {/* ── Modal (backdrop + centered card) ────────────────── */}
      <div
        className={`lsh-backdrop${panelOpen ? ' open' : ''}`}
        onClick={() => setPanelOpen(false)}
      >
      <div
        className="lsh-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Create account"
        onClick={e => e.stopPropagation()}
      >
        <div className="lsh-drawer-inner">
          <button className="lsh-close" onClick={() => setPanelOpen(false)} aria-label="Close">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M1 1l12 12M13 1L1 13" />
            </svg>
          </button>

          {/* Drawer logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 20 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'linear-gradient(135deg, #D4A843, #F0C866)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#080C14', fontWeight: 700, fontSize: 13, flexShrink: 0,
            }}>★</div>
            <span style={{ color: '#111', fontWeight: 600, fontSize: 14, letterSpacing: '-0.02em' }}>
              Life Star Hostel
            </span>
          </div>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 27, fontWeight: 600, color: '#080C14',
            margin: '0 0 5px', letterSpacing: '-0.02em', lineHeight: 1.2,
          }}>
            Create your account
          </h2>
          <p style={{ fontSize: 13.5, color: '#9CA3AF', margin: '0 0 18px', fontWeight: 300 }}>
            Start managing your hostel in minutes.
          </p>

          <button
            className="lsh-google-btn"
            type="button"
            onClick={() => toast.info('Google sign-in is not configured yet.')}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#ECEDEF' }} />
            <span style={{ fontSize: 11.5, color: '#B4B8BF', whiteSpace: 'nowrap' }}>
              or continue with email
            </span>
            <div style={{ flex: 1, height: 1, background: '#ECEDEF' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Full name', key: 'name', type: 'text', placeholder: 'Your full name', auto: 'name', min: 2 },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com', auto: 'email' },
            ].map(field => (
              <div key={field.key}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                  {field.label}
                </label>
                <input
                  className="lsh-form-input"
                  type={field.type} required autoComplete={field.auto}
                  minLength={field.min}
                  value={form[field.key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  className="lsh-form-input"
                  type={showPass ? 'text' : 'password'} required minLength={6} autoComplete="new-password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="At least 6 characters"
                  style={{ paddingRight: 42 }}
                />
                <button
                  type="button" onClick={() => setShowPass(v => !v)} tabIndex={-1}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#B4B8BF', padding: 0, lineHeight: 0,
                  }}
                >
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                padding: '10px 14px', borderRadius: 7,
                background: '#FEF2F2', border: '1px solid #FECACA',
                fontSize: 13, color: '#DC2626',
              }}>
                <span style={{ flexShrink: 0, marginTop: 1 }}>⚠</span>
                {error}
              </div>
            )}

            <button className="lsh-submit" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#9CA3AF', marginTop: 14 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#D4A843', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#D1D5DB', marginTop: 8, lineHeight: 1.65 }}>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
      </div>
    </>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" width="18" height="18" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </svg>
  )
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
