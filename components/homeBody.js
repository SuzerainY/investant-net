import styles from '@/styles/Home.module.css';

export default function HomeBody() {
    return (
        <>
            <div className={styles.blockTwoContainer}>
                <div className={styles.blockTwo}>
                    <div className={styles.blockTwoContent}>
                        <h1 className={styles.blockTwoHeading}>Ipsum Lorem</h1>
                    </div>
                    <div className={styles.discordWidget}>
                        <iframe
                            src="https://discord.com/widget?id=1075460690065752216&theme=dark"
                            width="350"
                            height="500"
                            allowtransparency="true"
                            frameborder="0"
                            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                        ></iframe>
                    </div>
                </div>
            </div>
        </>
    )
}