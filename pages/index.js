import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => { setUser(data); setLoading(false) })
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 110px)', color: 'var(--taupe)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
      Loading...
    </div>
  )

  if (user) return (
    <div className={styles.hero}>
      <div className={styles.welcomeSection}>
        <span className={styles.eyebrow}>Welcome back</span>
        <span className={styles.welcomeName}>{user.username}</span>
        <span className={styles.welcomeSub}>Ready to make today count?</span>
      </div>
      <div className={styles.heroActions}>
        <Link href="/dashboard" className={styles.btnPrimary}>Open Dashboard</Link>
        <button onClick={handleLogout} className={styles.btnLogout}>Sign Out</button>
      </div>
    </div>
  )

  return (
    <div className={styles.hero}>
      <span className={styles.eyebrow}>Your academic companion</span>
      <h1 className={styles.heroTitle}>
        Study with<br /><em>intention</em>
      </h1>
      <p className={styles.heroDesc}>
        A refined space to organize your schedule, track deadlines,
        capture notes, and chart your progress — all in one place.
      </p>
      <div className={styles.heroActions}>
        <Link href="/register" className={styles.btnPrimary}>Get Started</Link>
        <Link href="/login" className={styles.btnSecondary}>Sign In</Link>
      </div>
      <div className={styles.divider} />
      <div className={styles.features}>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>📅</span>
          <span className={styles.featureLabel}>Schedule</span>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>📝</span>
          <span className={styles.featureLabel}>Notes</span>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>📊</span>
          <span className={styles.featureLabel}>Progress</span>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>✅</span>
          <span className={styles.featureLabel}>Tasks</span>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>🔔</span>
          <span className={styles.featureLabel}>Reminders</span>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>📚</span>
          <span className={styles.featureLabel}>Sessions</span>
        </div>
      </div>
    </div>
  )
}
