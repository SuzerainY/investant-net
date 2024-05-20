import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AlertBanner({ message, link, linkMessage, onClose }) {
  const alertBannerExit = useRef(null);

  useEffect(() => {
    const handleAlertBannerExitClick = () => {onClose();};
    alertBannerExit.current?.addEventListener('click', handleAlertBannerExitClick);

    return () => {alertBannerExit.current?.removeEventListener('click', handleAlertBannerExitClick);};
  }, [onClose]);

  return (
    <div className="alert-banner">
      <div className="alert-banner-text">
        <h3>
          {message + " "}
          <Link href={link} target="_blank" rel="noopener noreferrer">
            {linkMessage}
          </Link>
        </h3>
      </div>
      <div ref={alertBannerExit} className="alert-banner-exit">
        <Image
          src={'/images/clipart/White-X.svg'}
          alt={'Close Banner'}
          width={50}
          height={50}
        />
      </div>
    </div>
  );
}