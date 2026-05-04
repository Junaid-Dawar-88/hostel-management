'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const card: React.CSSProperties = {
  background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12,
  padding: '24px 28px', marginBottom: 20,
}
const sectionTitle: React.CSSProperties = {
  fontSize: 15, fontWeight: 600, color: '#111827', margin: '0 0 4px',
}
const sectionSub: React.CSSProperties = {
  fontSize: 13, color: '#6B7280', margin: '0 0 20px',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6,
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 8,
  border: '1px solid #E5E7EB', fontSize: 14, color: '#111827',
  outline: 'none', background: '#fff', boxSizing: 'border-box',
}
const makeBtn = (variant: 'primary' | 'danger' | 'ghost', disabled = false): React.CSSProperties => ({
  padding: '9px 18px', borderRadius: 8, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: 14, fontWeight: 500, opacity: disabled ? 0.6 : 1,
  background: variant === 'primary' ? '#111827' : variant === 'danger' ? '#DC2626' : '#F3F4F6',
  color: variant === 'ghost' ? '#374151' : '#fff',
  transition: 'background 0.15s',
})
const errorBox: React.CSSProperties = {
  padding: '9px 14px', borderRadius: 8, background: '#FEF2F2',
  border: '1px solid #FECACA', fontSize: 13, color: '#DC2626', marginBottom: 14,
}

export default function SettingsPage() {
  const router = useRouter()
  const [me, setMe] = useState<{ name: string; email: string } | null>(null)

  const [profile, setProfile] = useState({ name: '', email: '' })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState('')

  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState('')
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false })

  const [showDelete, setShowDelete] = useState(false)
  const [deletePw, setDeletePw] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.email) { setMe(d); setProfile({ name: d.name, email: d.email }) }
      else router.replace('/login')
    })
  }, [router])

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setProfileError('')
    setProfileLoading(true)
    try {
      const res = await fetch('/api/auth/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      const data = await res.json()
      if (!res.ok) { setProfileError(data.error || 'Update failed'); return }
      setMe(data)
      toast.success('Profile updated')
      router.refresh()
    } finally { setProfileLoading(false) }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwError('')
    if (pw.next !== pw.confirm) { setPwError('New passwords do not match'); return }
    setPwLoading(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.next }),
      })
      const data = await res.json()
      if (!res.ok) { setPwError(data.error || 'Failed to change password'); return }
      toast.success('Password changed successfully')
      setPw({ current: '', next: '', confirm: '' })
    } finally { setPwLoading(false) }
  }

  async function deleteAccount() {
    setDeleteError('')
    setDeleteLoading(true)
    try {
      const res = await fetch('/api/auth/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePw }),
      })
      const data = await res.json()
      if (!res.ok) { setDeleteError(data.error || 'Deletion failed'); return }
      toast.success('Account deleted')
      router.push('/login')
    } finally { setDeleteLoading(false) }
  }

  if (!me) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ color: '#9CA3AF', fontSize: 14 }}>Loading…</div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 20px', fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Settings</h1>
        <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>Manage your account preferences</p>
      </div>

      {/* Profile */}
      <div style={card}>
        <p style={sectionTitle}>Profile Information</p>
        <p style={sectionSub}>Update your name and email address.</p>
        {profileError && <div style={errorBox}>⚠ {profileError}</div>}
        <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Full name</label>
            <input
              required minLength={2} value={profile.name}
              onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#3B82F6')}
              onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
            />
          </div>
          <div>
            <label style={labelStyle}>Email address</label>
            <input
              type="email" required value={profile.email}
              onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#3B82F6')}
              onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={profileLoading} style={makeBtn('primary', profileLoading)}>
              {profileLoading ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Password */}
      <div style={card}>
        <p style={sectionTitle}>Change Password</p>
        <p style={sectionSub}>Use a strong password of at least 6 characters.</p>
        {pwError && <div style={errorBox}>⚠ {pwError}</div>}
        <form onSubmit={changePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {([
            { key: 'current' as const, label: 'Current password', auto: 'current-password' },
            { key: 'next' as const, label: 'New password', auto: 'new-password' },
            { key: 'confirm' as const, label: 'Confirm new password', auto: 'new-password' },
          ]).map(field => (
            <div key={field.key}>
              <label style={labelStyle}>{field.label}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw[field.key] ? 'text' : 'password'}
                  required autoComplete={field.auto}
                  minLength={field.key !== 'current' ? 6 : 1}
                  value={pw[field.key]}
                  onChange={e => setPw(p => ({ ...p, [field.key]: e.target.value }))}
                  style={{ ...inputStyle, paddingRight: 40 }}
                  onFocus={e => (e.target.style.borderColor = '#3B82F6')}
                  onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                />
                <button
                  type="button" tabIndex={-1}
                  onClick={() => setShowPw(s => ({ ...s, [field.key]: !s[field.key] }))}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0, lineHeight: 0,
                  }}
                >
                  <EyeIcon open={showPw[field.key]} />
                </button>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={pwLoading} style={makeBtn('primary', pwLoading)}>
              {pwLoading ? 'Updating…' : 'Update password'}
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div style={{ ...card, border: '1px solid #FCA5A5' }}>
        <p style={{ ...sectionTitle, color: '#DC2626' }}>Danger Zone</p>
        <p style={sectionSub}>Permanently delete your account and all associated data. This cannot be undone.</p>
        <button type="button" onClick={() => setShowDelete(true)} style={makeBtn('danger')}>
          Delete account
        </button>
      </div>

      {/* Delete confirmation modal */}
      {showDelete && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.45)', padding: 24,
        }}>
          <div style={{
            background: '#fff', borderRadius: 12, padding: '28px 28px 24px',
            width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
              Delete your account?
            </h2>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 20px', lineHeight: 1.6 }}>
              All your rooms, students, and menu data will be permanently deleted. Enter your password to confirm.
            </p>
            {deleteError && <div style={errorBox}>⚠ {deleteError}</div>}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Your password</label>
              <input
                type="password" value={deletePw}
                onChange={e => setDeletePw(e.target.value)}
                placeholder="Enter your password"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#DC2626')}
                onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => { setShowDelete(false); setDeletePw(''); setDeleteError('') }}
                style={makeBtn('ghost')}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading || !deletePw}
                onClick={deleteAccount}
                style={makeBtn('danger', deleteLoading || !deletePw)}
              >
                {deleteLoading ? 'Deleting…' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
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
