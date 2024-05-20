import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";



export default function Header() {
  // Mobile menu references
  const [mobileMenuContainer, mobileMenu, mobileMenuButtonOpen, mobileMenuButtonClose] = new Array(4).fill(null).map(() => useRef(null));

  useEffect(() => {
    const openMobileMenu = () => {
      if (mobileMenuContainer.current?.style.display !== 'flex') {mobileMenuContainer.current.style.display = 'flex';}
    }

    const closeMobileMenu = () => {
      if (mobileMenuContainer.current?.style.display !== 'none') {
        mobileMenuContainer.current.classList.add('mobile-menu-fade-out');

        setTimeout(() => {
          mobileMenuContainer.current.style.display = 'none';
          mobileMenuContainer.current.classList.remove('mobile-menu-fade-out');
        }, 375); // mobile-menu-fade-out animation is 400ms, allowing 25ms of hedge for events
      }
    }

    const handleClickOutsideMobileMenu = (event) => {
      let eventTarget = event.target;
      if (mobileMenuContainer.current?.contains(eventTarget) === true && mobileMenu.current?.contains(eventTarget) === false) {closeMobileMenu();}
    };

    const handleViewportResize = () => {
      const viewportWidth = window.innerWidth;
      if (viewportWidth >= 1200) {closeMobileMenu();}
    }

    mobileMenuButtonOpen.current?.addEventListener('click', openMobileMenu);
    mobileMenuButtonClose.current?.addEventListener('click', closeMobileMenu);
    document.addEventListener('click', handleClickOutsideMobileMenu);
    window.addEventListener('resize', handleViewportResize);

    return () => {
      mobileMenuButtonOpen.current?.removeEventListener('click', openMobileMenu);
      mobileMenuButtonClose.current?.removeEventListener('click', closeMobileMenu);
      document.removeEventListener('click', handleClickOutsideMobileMenu);
      window.removeEventListener('resize', handleViewportResize);
    };
  }, []);

  return (
    <>
      <div ref={mobileMenuContainer} className="mobile-menu-container">
        <nav ref={mobileMenu} className="mobile-menu">
          <div ref={mobileMenuButtonClose} className="mobile-menu-close">
            <Image
              src={"/images/clipart/White-X.svg"}
              alt="Close Menu"
              width={40}
              height={40}
            />
          </div>
          <div className="mobile-menu-navigation">
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
                  />
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

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
            <div ref={mobileMenuButtonOpen} className="mobile-menu-open">
              <Image
                src={"/images/clipart/White-Bars-Mobile-Menu.svg"}
                alt="Menu Toggle"
                fill
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