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
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}>

      {/* ── Left dark panel ──────────────────────────────────────────── */}
      <div className="hidden lg:flex" style={{
        width: '45%', flexDirection: 'column', background: '#0F1623', position: 'relative', overflow: 'hidden',
      }}>
        {/* Dot grid texture */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        {/* Glow */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(79,122,234,0.15) 0%, transparent 70%)',
        }} />

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', padding: '40px' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, #D4A843, #F0C866)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#0F1623', fontWeight: 700, fontSize: 14,
            }}>★</div>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: 15, letterSpacing: '-0.02em' }}>Life Star Hostel</span>
          </Link>

          {/* Testimonial block */}
          <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <div style={{ color: '#D4A843', fontSize: 32, marginBottom: 20, lineHeight: 1 }}>&ldquo;</div>
            <blockquote style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, lineHeight: 1.65, fontWeight: 300, maxWidth: 320 }}>
              Managing our hostel used to take hours of paperwork. Now I track every room, student, and fee in minutes.
            </blockquote>
            <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(212,168,67,0.35), rgba(212,168,67,0.1))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#D4A843', fontWeight: 700, fontSize: 14, flexShrink: 0,
              }}>MA</div>
              <div>
                <p style={{ color: '#fff', fontSize: 14, fontWeight: 500, margin: 0 }}>Muhammad Arif</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '3px 0 0' }}>Head Warden, Life Star Hostel</p>
              </div>
            </div>
          </div>

          {/* Bottom stats */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {[{ v: '50+', l: 'Rooms' }, { v: '300+', l: 'Students' }, { v: '5 yrs', l: 'Running' }].map(s => (
              <div key={s.l}>
                <p style={{ color: '#fff', fontWeight: 600, fontSize: 18, margin: 0, lineHeight: 1 }}>{s.v}</p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '5px 0 0' }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: '#fff', padding: '48px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>

          {/* Mobile logo */}
          <Link href="/" className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 36 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: 'linear-gradient(135deg, #D4A843, #F0C866)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#0F1623', fontWeight: 700, fontSize: 13,
            }}>★</div>
            <span style={{ color: '#111', fontWeight: 600, fontSize: 15 }}>Life Star Hostel</span>
          </Link>

          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: '0 0 6px', letterSpacing: '-0.03em' }}>
            Sign in to your account
          </h1>
          <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 28px' }}>
            Welcome back! Enter your credentials below.
          </p>

          {/* Google button */}
          <button
            type="button"
            onClick={() => toast.info('Google sign-in is not configured yet.')}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 10, padding: '10px 16px', borderRadius: 8,
              border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer',
              fontSize: 14, fontWeight: 500, color: '#374151',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
            onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
            <span style={{ fontSize: 12, color: '#9CA3AF', whiteSpace: 'nowrap' }}>or continue with email</span>
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email" required autoComplete="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8,
                  border: '1px solid #E5E7EB', fontSize: 14, color: '#111827',
                  outline: 'none', background: '#fff', boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = '#3B82F6')}
                onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Password</label>
                <button
                  type="button"
                  style={{ fontSize: 12, color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={() => toast.info('Password reset is not available yet.')}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} required autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '10px 40px 10px 14px', borderRadius: 8,
                    border: '1px solid #E5E7EB', fontSize: 14, color: '#111827',
                    outline: 'none', background: '#fff', boxSizing: 'border-box',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#3B82F6')}
                  onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0, lineHeight: 0,
                  }}
                  tabIndex={-1}
                >
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                padding: '10px 14px', borderRadius: 8,
                background: '#FEF2F2', border: '1px solid #FECACA', fontSize: 13, color: '#DC2626',
              }}>
                <span style={{ flexShrink: 0, marginTop: 1 }}>⚠</span>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '11px 16px', borderRadius: 8,
                background: loading ? '#6B7280' : '#111827', color: '#fff',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 14, fontWeight: 600, marginTop: 4,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1F2937' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#111827' }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#6B7280', marginTop: 24 }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: '#3B82F6', fontWeight: 500, textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#D1D5DB', marginTop: 24, lineHeight: 1.6 }}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
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
