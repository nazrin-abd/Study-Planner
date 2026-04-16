import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import styles from '../styles/Gallery.module.css'
import Layout from '../components/Layout'

const inter = Inter({ subsets: ['latin'] })

export default function Newp() {
  return (
    <>

      <p className='subTitle'>Try yourself</p>

      <Link
        className="navLink" href = "/">
        Click to go to the Home page
      </Link>      
        <div>
          <p className={styles.mainTitle}>Model name</p>
          <p className={styles.subTitle}>Model description</p>
          
        </div>

    </>
  )
}