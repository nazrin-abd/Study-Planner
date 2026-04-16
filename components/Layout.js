import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Inter } from 'next/font/google'

export default function Layout({ children }) {
  const [user, setUser] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
  }, [router.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
  }

  return (
    <>
      <Head>
        <title>Study Planner</title>
        <meta name="description" content="Plan your studies with elegance" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="topBand" style={{ boxShadow: scrolled ? '0 4px 40px rgba(28,23,20,0.18)' : 'none', transition: 'box-shadow 0.3s ease' }}>
        <p className="mainTitle">Study Planner</p>
        <nav style={navStyle}>
          <Link href="/" style={linkStyle(router.pathname === '/')}>Home</Link>
          {user && <Link href="/dashboard" style={linkStyle(router.pathname === '/dashboard')}>Dashboard</Link>}
          {user && <Link href="/gallery" style={linkStyle(router.pathname === '/gallery')}>Gallery</Link>}
          {user
            ? <button onClick={handleLogout} style={logoutStyle}>Sign Out</button>
            : <Link href="/login" style={{ ...linkStyle(false), color: 'rgba(212, 180, 131, 0.9)' }}>Sign In</Link>
          }
        </nav>
      </div>

      <main style={{ minHeight: 'calc(100vh - 110px)', display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>

      <div className="footer">
        <p>© 2023 Study Planner &nbsp;·&nbsp; All rights reserved</p>
      </div>
    </>
  )
}

const navStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '4px',
  padding: '10px 0 14px',
}

const linkStyle = (active) => ({
  color: active ? 'rgba(212,180,131,1)' : 'rgba(201,194,180,0.7)',
  textDecoration: 'none',
  padding: '6px 16px',
  fontSize: '0.72rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: '400',
  transition: 'all 0.2s ease',
  borderBottom: active ? '1px solid rgba(184,150,90,0.6)' : '1px solid transparent',
})

const logoutStyle = {
  color: 'rgba(201,194,180,0.5)',
  background: 'none',
  border: 'none',
  padding: '6px 16px',
  fontSize: '0.72rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: '400',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
}
