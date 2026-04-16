import { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'

export default function Register() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) return setError(data.error)
    router.push('/login')
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Create account</h2>
        <p className={styles.authSubtitle}>Begin your study journey</p>

        {error && <div className={styles.authError}>{error}</div>}

        <div className={styles.authForm}>
          <div>
            <label className={styles.authLabel}>Username</label>
            <input
              name="username"
              className={styles.authInput}
              placeholder="yourname"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className={styles.authLabel}>Email address</label>
            <input
              name="email"
              type="email"
              className={styles.authInput}
              placeholder="your@email.com"
              onChange={handleChange}
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </div>

        <p className={styles.authSwitch}>
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  )
}
