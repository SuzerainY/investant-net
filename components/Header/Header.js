import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

export default function Header() {
  useEffect(() => {

    // The Styles Classes that we would like to edit on event
    const mobileMenuToggle = document.querySelector('.header .mobile-menu');
    const mobileMenuH3Toggle = document.querySelector('.header .mobile-menu h3');
    const mobileMenuListToggle = document.querySelector('.header .mobile-menu ul');

    // Extended events to SCSS that should occur when mobile drop down navigation menu is selected
    const handleMenuToggle = () => {
      mobileMenuH3Toggle.classList.toggle('open');

      // When we add the 'open' class of the menu, display the list items and adjust container height to fit all content
      if (mobileMenuH3Toggle.classList.contains('open')) {
        mobileMenuListToggle.style.display = 'flex';
        mobileMenuToggle.style.maxHeight = mobileMenuToggle.scrollHeight + 'px';
      } else {
        mobileMenuToggle.style.maxHeight = mobileMenuH3Toggle.scrollHeight + 'px';
      }
    };

    // Extended events to SCSS that should occur on screen resizing
    const handleResize = () => {
      const screenWidth = window.innerWidth;

      // We are currently considering anything less than 1080px screen width as mobile display
      if (screenWidth > 1079) {
        mobileMenuToggle.style.display = 'none';
      } else {
        mobileMenuToggle.style.display = 'flex';
      }
    };

    // Make sure we load into the page with the menu tab closed by setting max height to just the header's height
    mobileMenuToggle.style.display = 'flex';
    mobileMenuToggle.style.maxHeight = mobileMenuH3Toggle.scrollHeight + 'px';

    // Add our event listeners
    mobileMenuH3Toggle.addEventListener('click', handleMenuToggle);
    window.addEventListener('resize', handleResize)

    return () => {
      // Clean up the event listener when the component unmounts
      mobileMenuH3Toggle.removeEventListener('click', handleMenuToggle);
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <nav className="header">

      <div className="mobile-menu">
        <h3>MENU</h3>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/papertrade">PaperTrade</Link>
          </li>
          <li>
            <Link href="/about-us">About Us</Link>
          </li>
          <li>
            <Link href="/blog">Blog</Link>
          </li>
        </ul>

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
          <li>
            <Link
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

      <div className="desktop-menu">
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
      
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/papertrade">PaperTrade</Link>
            </li>
            <li>
              <Link href="/about-us">About Us</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
          </ul>

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
            <li>
              <Link
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
    </nav>
  );
};