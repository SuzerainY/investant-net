import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

export default function Header() {
  useEffect(() => {
    const mobileMenuToggle = document.querySelector('.header .mobile-menu');
    const mobileMenuH3Toggle = document.querySelector('.header .mobile-menu h3');
    const mobileMenuListToggle = document.querySelector('.header .mobile-menu ul');
    const mobileMenuList2Toggle = document.querySelector('.header .mobile-menu li');

    const handleMenuToggle = () => {
      mobileMenuH3Toggle.classList.toggle('open');

      if (mobileMenuH3Toggle.classList.contains('open')) {
        mobileMenuListToggle.style.display = 'flex';
        mobileMenuToggle.style.maxHeight = mobileMenuToggle.scrollHeight + 'px';
      } else {
        mobileMenuToggle.style.maxHeight = mobileMenuH3Toggle.scrollHeight + 'px';
      }
    };

    mobileMenuH3Toggle.addEventListener('click', handleMenuToggle);

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