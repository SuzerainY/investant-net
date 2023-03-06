import styles from '@/styles/Footer.module.css';
import Image from 'next/image';
import Link from 'next/Link';

export default function Footer() {
    return (
        <>
            <div className={styles.containFooter}>
                <div className={styles.footerElements}>
                    <Link href="/">
                        <Image
                            src="/images/branding/TransparentLogoHeader.png"
                            alt="Investant Logo"
                            width={150}
                            height={30}
                            priority
                        />
                    </Link>
                </div>
            </div>
        </>
    )
}