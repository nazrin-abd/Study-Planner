import Layout from '../components/Layout'
import '../styles/globals.css'
import { useEffect } from 'react'

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    fetch('/api/cron-init')
  }, [])

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}