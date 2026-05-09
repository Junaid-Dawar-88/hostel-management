'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Login failed'); return }
      toast.success(`Welcome back, ${data.name}!`)
      router.push('/')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .lgn-page {
          font-family: 'DM Sans', system-ui, sans-serif;
          height: 100vh;
          background: #080C14;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .lgn-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(212,168,67,0.032) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,168,67,0.032) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
        }

        .lgn-glow-a {
          position: absolute;
          top: -200px;
          right: -200px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(212,168,67,0.06) 0%, transparent 68%);
          pointer-events: none;
        }

        .lgn-glow-b {
          position: absolute;
          bottom: -180px;
          left: -150px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(212,168,67,0.04) 0%, transparent 68%);
          pointer-events: none;
        }

        .lgn-card {
          position: relative;
          z-index: 1;
          background: #FEFCF7;
          border-radius: 18px;
          width: 100%;
          max-width: 520px;
          padding: 36px 48px 32px;
          box-shadow:
            0 0 0 1px rgba(212,168,67,0.1),
            0 32px 80px rgba(0,0,0,0.55),
            0 8px 24px rgba(0,0,0,0.3);
        }

        .lgn-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          text-decoration: none;
          margin-bottom: 24px;
        }

        .lgn-logo-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: linear-gradient(135deg, #D4A843, #F0C866);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #080C14;
          font-weight: 700;
          font-size: 13px;
          flex-shrink: 0;
        }

        .lgn-logo-text {
          color: #111;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: -0.02em;
        }

        .lgn-heading {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 27px;
          font-weight: 600;
          color: #080C14;
          margin: 0 0 5px;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .lgn-sub {
          font-size: 13.5px;
          color: #9CA3AF;
          margin: 0 0 20px;
          font-weight: 300;
        }

        .lgn-google {
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
        .lgn-google:hover {
          background: #F9FAFB;
          border-color: #D1D5DB;
        }

        .lgn-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 14px 0;
        }

        .lgn-divider-line {
          flex: 1;
          height: 1px;
          background: #ECEDEF;
        }

        .lgn-divider-text {
          font-size: 11.5px;
          color: #B4B8BF;
          white-space: nowrap;
        }

        .lgn-label {
          display: block;
          font-size: 12.5px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
        }

        .lgn-input {
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
        .lgn-input:focus {
          border-color: #D4A843;
          background: #fff;
        }
        .lgn-input::placeholder { color: #C4C6CB; }

        .lgn-submit {
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
          margin-top: 4px;
          transition: background 0.15s, opacity 0.15s;
        }
        .lgn-submit:hover:not(:disabled) { background: #1a2235; }
        .lgn-submit:disabled { opacity: 0.55; cursor: not-allowed; }

        .lgn-error {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 7px;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          font-size: 13px;
          color: #DC2626;
        }

        .lgn-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #E5E7EB;
          background: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9CA3AF;
          transition: background 0.15s, color 0.15s;
          text-decoration: none;
        }
        .lgn-close:hover { background: #F3F4F6; color: #374151; }

        @media (max-width: 480px) {
          .lgn-card { padding: 28px 20px 24px; border-radius: 14px; max-width: 100%; }
        }
      `}</style>

      <div className="lgn-page">
        <div className="lgn-grid" />
        <div className="lgn-glow-a" />
        <div className="lgn-glow-b" />

        <div className="lgn-card">
          <Link href="/signup" className="lgn-close" aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M1 1l12 12M13 1L1 13" />
            </svg>
          </Link>

          <Link href="/" className="lgn-logo">
            <div className="lgn-logo-icon">★</div>
            <span className="lgn-logo-text">Life Star Hostel</span>
          </Link>

          <h1 className="lgn-heading">Sign in to your account</h1>
          <p className="lgn-sub">Welcome back! Enter your credentials below.</p>

          <button
            type="button"
            className="lgn-google"
            onClick={() => toast.info('Google sign-in is not configured yet.')}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="lgn-divider">
            <div className="lgn-divider-line" />
            <span className="lgn-divider-text">or continue with email</span>
            <div className="lgn-divider-line" />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <div>
              <label className="lgn-label">Email</label>
              <input
                className="lgn-input"
                type="email" required autoComplete="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="lgn-label" style={{ margin: 0 }}>Password</label>
                <button
                  type="button"
                  style={{ fontSize: 12, color: '#D4A843', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 500 }}
                  onClick={() => toast.info('Password reset is not available yet.')}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  className="lgn-input"
                  type={showPass ? 'text' : 'password'} required autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  style={{ paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  tabIndex={-1}
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
              <div className="lgn-error">
                <span style={{ flexShrink: 0, marginTop: 1 }}>⚠</span>
                {error}
              </div>
            )}

            <button className="lgn-submit" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#9CA3AF', marginTop: 16 }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: '#D4A843', fontWeight: 600, textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#D1D5DB', marginTop: 10, lineHeight: 1.65 }}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
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
