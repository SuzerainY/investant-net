import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";



export default function Header() {

  useEffect(() => {

    // Create mobile menu queries
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuButtonToggle = document.querySelector('.header .mobile-top-banner .mobile-menu-toggle');
    const mobileMenuButtonClose = document.querySelector('.mobile-menu .mobile-menu-close');

    const openMobileMenu = () => {
      if (mobileMenu.style.display != 'flex') {mobileMenu.style.display = 'flex'};
      if (mobileMenuOverlay.style.display != 'flex') {mobileMenuOverlay.style.display = 'flex'};
    }

    const closeMobileMenu = () => {
      if (mobileMenu.style.display != 'none') {mobileMenu.style.display = 'none'};
      if (mobileMenuOverlay.style.display != 'none') {mobileMenuOverlay.style.display = 'none'};
    }

    const handleClickOutsideMobileMenu = (event) => {
      if (mobileMenuOverlay.contains(event.target)) {closeMobileMenu();}
    };

    mobileMenuButtonToggle.addEventListener('click', openMobileMenu);
    mobileMenuButtonClose.addEventListener('click', closeMobileMenu);
    document.addEventListener('click', handleClickOutsideMobileMenu);

    return () => {
      mobileMenuButtonToggle.removeEventListener('click', openMobileMenu);
      mobileMenuButtonClose.removeEventListener('click', closeMobileMenu);
      document.removeEventListener('click', handleClickOutsideMobileMenu);
    };
  }, []);

  return (
    <>
      <div className="mobile-menu">
        <div className="mobile-menu-close">
          <Image
            src={"/images/clipart/White-X.svg"}
            alt="Close Menu"
            width={40}
            height={40}
            priority
          />
        </div>
        <nav className="mobile-menu-navigation">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/products">Products</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
            <li>
              <Link href="/about-us">About Us</Link>
            </li>
          </ul>
        </nav>
        <div className="mobile-menu-media-links">
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
                  width={35}
                  height={30}
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
                  width={30}
                  height={30}
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
                  width={33}
                  height={33}
                  priority
                />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mobile-menu-overlay"></div>

      <header>
        <nav className="header">
          <div className="mobile-top-banner">
            <div className="mobile-menu-logo">
              <Link href="/">
                <Image
                  src={"/images/branding/FaviconTransparent.png"}
                  alt="Investant Favicon"
                  width={50}
                  height={50}
                  priority
                />
              </Link>
            </div>
            <div className="mobile-menu-toggle">
              <Image
                src={"/images/clipart/White-Bars-Mobile-Menu.svg"}
                alt="Menu Toggle"
                fill
                priority
              />
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
                  <Link href="/blog">Blog</Link>
                </li>
                <li>
                  <Link href="/about-us">About Us</Link>
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
      </header>
    </>
  );
};