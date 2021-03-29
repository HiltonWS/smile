import Head from 'next/head'
import styles from './layout.module.css'
import Link from 'next/link'

const name = 'Smile'
export const siteTitle = 'Smile'

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
      </header>
      <main>{children}</main>
        <div className={styles.backToHome}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
    </div>
  )
}