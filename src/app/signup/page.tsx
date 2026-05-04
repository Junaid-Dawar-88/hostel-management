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
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}>

      {/* ── Left dark panel ──────────────────────────────────────────── */}
      <div className="hidden lg:flex" style={{
        width: '45%', flexDirection: 'column', background: '#0F1623', position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid texture */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '30%', right: 0, width: 280, height: 280,
          background: 'radial-gradient(circle, rgba(212,168,67,0.08) 0%, transparent 70%)',
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

          {/* Feature list */}
          <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 100,
              background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)',
              marginBottom: 20,
            }}>
              <span style={{ color: '#D4A843', fontSize: 11 }}>★★★★★</span>
              <span style={{ color: 'rgba(212,168,67,0.8)', fontSize: 11, fontWeight: 500 }}>Trusted by wardens</span>
            </div>

            <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, lineHeight: 1.4, margin: '0 0 10px' }}>
              Everything you need to<br />run a great hostel
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 1.6, margin: '0 0 32px', maxWidth: 300 }}>
              One platform to manage rooms, students, fees, and menus — no spreadsheets required.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {features.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(212,168,67,0.12)', border: '1px solid rgba(212,168,67,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="#D4A843" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom note */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 22, marginTop: 'auto' }}>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, margin: 0 }}>Free to set up. No credit card needed.</p>
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
            Create your account
          </h1>
          <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 28px' }}>
            Start managing your hostel in minutes.
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
            {[
              { label: 'Full name', key: 'name', type: 'text', placeholder: 'Your full name', auto: 'name', min: 2 },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com', auto: 'email' },
            ].map(field => (
              <div key={field.key}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                  {field.label}
                </label>
                <input
                  type={field.type} required autoComplete={field.auto}
                  minLength={field.min}
                  value={form[field.key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
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
            ))}

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} required minLength={6} autoComplete="new-password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="At least 6 characters"
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
                  type="button" onClick={() => setShowPass(v => !v)} tabIndex={-1}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0, lineHeight: 0,
                  }}
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
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#6B7280', marginTop: 24 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#3B82F6', fontWeight: 500, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#D1D5DB', marginTop: 24, lineHeight: 1.6 }}>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
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
