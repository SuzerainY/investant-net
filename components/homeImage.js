import { useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';

export default function HomeImage() {
  const homeContainerImageRef = useRef(null);

  function maintainMainHeight() {
    const mainHeight = document.getElementById('main').offsetHeight;
    const homeContainerImageHeight = homeContainerImageRef.current.offsetHeight;
    if (mainHeight !== homeContainerImageHeight - 200) {
      document.getElementById('main').style.height = `${homeContainerImageHeight - 200}px`;
      document.getElementById('blockOne').style.height = `${homeContainerImageHeight - 200}px`;
    }
  }

  useEffect(() => {
    maintainMainHeight();
    window.addEventListener('resize', maintainMainHeight);
    return () => window.removeEventListener('resize', maintainMainHeight);
  }, []);

  return (
    <>
      <div id="main" className={styles.main}>
        <h1 id="blockOne" className={styles.blockOne}>
          <div className={styles.homeContainerImageText}>
            An investment
            <div>community</div>
            <div className={styles.homeContainerImageTextBold}>made for you.</div>
          </div>
          <div ref={homeContainerImageRef} className={styles.homeContainerImage}>
            <Image
                src="/images/clipart/ClipArtOfficeWorker.svg"
                alt="Office Worker ClipArt"
                fill
            />
          </div>
        </h1>
      </div>
    </>
  );
}