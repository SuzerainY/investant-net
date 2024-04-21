import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AlertBanner({ message, link, linkMessage, onClose }) {

  useEffect(() => {
    const alertBannerExit = document.querySelector('.alert-banner .alert-banner-exit');
    const handleAlertBannerExitClick = () => {onClose();};
    alertBannerExit.addEventListener('click', handleAlertBannerExitClick);

    return () => {alertBannerExit.removeEventListener('click', handleAlertBannerExitClick);};
  }, []);

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
      <div className="alert-banner-exit">
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