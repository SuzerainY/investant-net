import { useState } from "react";
import styles from '@/styles/Header.module.css';
import Link from 'next/Link';

export default function Sidebar() {
    const [showItems, setShowItems] = useState(true);

    const toggleSidebar = () => {
        console.log(`Set showItems to: ${!showItems}`)
        setShowItems(!showItems);
    }

    const sidebarStyle = {
        display: showItems ? 'grid' : 'none',
        transition: 'all 0.3s ease-in-out'
    }

    return (
        <div className={styles.navSidebarOpen}>
            <button className={styles.buttonSidebar} onClick={toggleSidebar}>INFO</button>
            <nav style={sidebarStyle}>
                <ul className={styles.navSidebarList}>
                    <li className={styles.navSidebarItem}>
                        <Link href="/">
                            Home
                        </Link>
                    </li>
                    <li className={styles.navSidebarItem}>
                        <Link href="/blog">
                            Blog
                        </Link>
                    </li>
                    <li className={styles.navSidebarItem}>
                        <Link href="/papertrade">
                            PaperTrade
                        </Link>
                    </li>
                    <li className={styles.navSidebarItem}>
                        <Link href="/about-us">
                            About Us
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}