import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {

  useEffect(() => {
    // The Styles Classes that we would like to edit on event
    const mobileMenuToggle = document.querySelector('.header .mobile-menu');
    const mobileMenuButtonToggle = document.querySelector('.header .mobile-menu .mobile-menu-button');
  
    // Call method on any screen resizing and initial loading of page to decide whether we display mobile nav bar or not
    const handleMobileMenuOnResize = () => {
      const screenWidth = window.innerWidth;

      // We are currently considering anything less than 1080px screen width as mobile display
      if (screenWidth > 1079) {
        if (mobileMenuToggle.style.display != 'none') {mobileMenuToggle.style.display = 'none';}
      } else {
        if (mobileMenuToggle.style.display != 'flex') {mobileMenuToggle.style.display = 'flex';}
      }

      // If the screen is ever resized, collapse the mobile navigation menu
      if (mobileMenuButtonToggle.classList.contains('open')) {
        mobileMenuButtonToggle.classList.toggle('open');
        mobileMenuToggle.style.maxHeight = mobileMenuButtonToggle.scrollHeight + 'px';
      }

      // If the height is not properly set already, then set the height to closed height
      if (mobileMenuToggle.style.maxHeight != mobileMenuButtonToggle.scrollHeight + 'px') {
        mobileMenuToggle.style.maxHeight = mobileMenuButtonToggle.scrollHeight + 'px';
      }
    };

    // Extended events to SCSS that should occur when mobile drop down navigation menu is selected
    const handleMobileMenuOnClick = () => {
      mobileMenuButtonToggle.classList.toggle('open');

      // When we add the 'open' class of the menu, adjust container height to fit all content
      if (mobileMenuButtonToggle.classList.contains('open')) {
        mobileMenuToggle.style.maxHeight = mobileMenuToggle.scrollHeight + 'px';
      } else {
        mobileMenuToggle.style.maxHeight = mobileMenuButtonToggle.scrollHeight + 'px';
      }
    };

    // Run method on initial load of page
    handleMobileMenuOnResize();

    // Add our event listeners
    mobileMenuButtonToggle.addEventListener('click', handleMobileMenuOnClick);
    window.addEventListener('resize', handleMobileMenuOnResize)

    return () => {
      // Clean up the event listener when the component unmounts
      mobileMenuButtonToggle.removeEventListener('click', handleMobileMenuOnClick);
      window.removeEventListener('resize', handleMobileMenuOnResize);
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <>
      <nav className="header">
        <div className="mobile-top-banner">
          <Link href="/">
            <Image
              src={"/images/branding/FaviconTransparent.png"}
              alt="Investant Favicon"
              width={100}
              height={100}
              priority
            />
          </Link>
        </div>
        <div className="mobile-menu">
          <div className="mobile-menu-button"><h3>MENU</h3></div>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/products">Products</Link>
            </li>
            <li>
              <Link href="/about-us">About Us</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
          </ul>
          <div className="mobile-media-links">
            <li>
              <Link
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
              </Link>
            </li>
            <li>
              <Link
                href="https://twitter.com/InvestantGroup"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/images/socialmedia/x-investant.png"
                  alt="X Icon"
                  width={40}
                  height={35}
                  priority
                />
              </Link>
            </li>
            <li>
              <Link
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
              </Link>
            </li>
          </div>
        </div>

        <div className="desktop-menu">
          <div className="NavBar-Investant-Logo">
            <ul>
              <li>
                <Link href="/">
                  <Image
                    src={"/images/branding/TransparentLogoHeader.png"}
                    alt="Investant Logo"
                    width={300}
                    height={60}
                    priority
                  />
                </Link>
              </li>
            </ul>
          </div>
          <div className="NavBar-Navigation-Links">
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/products">Products</Link>
              </li>
              <li>
                <Link href="/about-us">About Us</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
            </ul>
          </div>
          <div className="NavBar-Media-Links">
            <ul>        
              <li>
                <Link
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
                </Link>
              </li>
              <li className="NavBar-Media-Links-XLogo">
                <Link
                  href="https://twitter.com/InvestantGroup"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/images/socialmedia/x-investant.png"
                    alt="X Icon"
                    width={35}
                    height={35}
                    priority
                  />
                </Link>
              </li>
              <li>
                <Link
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
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};