import { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'

export default function Login() {
  const router = useRouter()
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) return setError(data.error)
    router.push('/dashboard')
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Welcome back</h2>
        <p className={styles.authSubtitle}>Sign in to continue your studies</p>

        {error && <div className={styles.authError}>{error}</div>}

        <div className={styles.authForm}>
          <div>
            <label className={styles.authLabel}>Email or Username</label>
            <input
              name="identifier"
              className={styles.authInput}
              placeholder="your@email.com"
              onChange={handleChange}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <div>
            <label className={styles.authLabel}>Password</label>
            <input
              name="password"
              type="password"
              className={styles.authInput}
              placeholder="••••••••"
              onChange={handleChange}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <button className={styles.authBtn} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <p className={styles.authSwitch}>
          No account? <a href="/register">Create one</a>
        </p>
      </div>
    </div>
  )
}
