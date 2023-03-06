import Image from 'next/image';
import Link from 'next/Link';
import styles from '@/styles/Header.module.css';
import Sidebar from './sidebarnav';

export default function Header() {
    return (
      <>
        <div>
            <div className={styles.announcementBar}>
                <p>PaperTrade Available NOW in the Investant Discord Server! <a href="https://discord.gg/SFUKKjWEjH" target="_blank"> Try It Out!</a></p>
            </div>
            <header className={styles.header}>
                <div className={styles.title}>
                    <Image
                        src="/images/branding/TransparentLogoHeader.png"
                        alt = "Investant"
                        width = {300}
                        height = {60}
                        priority
                    />
                    <div className={styles.media}>
                        <ul className={styles.mediaList}>
                            <li className={styles.mediaListItem}>
                                <a
                                    href="https://discord.gg/SFUKKjWEjH"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    >
                                    <Image
                                        src="/images/socialmedia/discord-investant.png"
                                        alt="Discord Icon"
                                        width={40}
                                        height={35}
                                        priority
                                    />
                                </a>
                            </li>
                            <li className={styles.mediaListItem}>
                                <a
                                    href="https://twitter.com/InvestantGroup?s=20"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    >
                                    <Image
                                        src="/images/socialmedia/twitter-investant.png"
                                        alt="Twitter Icon"
                                        width={40}
                                        height={35}
                                        priority
                                    />
                                </a>
                            </li>
                            <li className={styles.mediaListItem}>
                                <a
                                    href="https://www.instagram.com/investantgroup/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    >
                                    <Image
                                        src="/images/socialmedia/insta-investant.png"
                                        alt="Instagram Icon"
                                        width={38}
                                        height={38}
                                        priority
                                    />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <nav className={styles.nav}>
                    <ul className={styles.navList}>
                        <li className={styles.navListItem}>
                            <Link href="/">Home</Link>
                        </li>
                        <li className={styles.navListItem}>
                            <Link href="/blog">Blog</Link>
                        </li>
                        <li className={styles.navListItem}>
                            <Link href="/papertrade">PaperTrade</Link>
                        </li>
                        <li className={styles.navListItem}>
                            <Link href="/about-us">About Us</Link>
                        </li>
                    </ul>
                </nav>
                <nav>
                    <Sidebar/>
                </nav>
            </header>
        </div>
      </>
    )
  }