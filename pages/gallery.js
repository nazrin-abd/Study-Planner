import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Gallery.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Gallery() {
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) router.push('/login')
      })
  }, [])

  return (
    <>
      <p className='subTitle'>Try yourself</p>

      <Link className="navLink" href="/">
        Click to go to the Home page
      </Link>

      <div>
        <p className={styles.mainTitle}>Model name</p>
        <p className={styles.subTitle}>Model description</p>
        <Image
          src="/images/planner.jpg"
          alt="Make yourself one"
          width={300}
          height={200}
        />
      </div>
    </>
  )
}