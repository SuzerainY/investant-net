import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const router = useRouter();

  // Route to product sections if navigated to via header
  const handleProductClick = (productId) => {
    // Route the user if needed
    if (router.pathname === '/') {
      const productSection = document.getElementById(productId);
      if (productSection) {productSection.scrollIntoView({ behavior: 'smooth' });}

      // Close the mobile menu if it is open
      if (mobileMenuContainer.current?.style.display !== 'none') {
        mobileMenuContainer.current.classList.add('mobile-menu-fade-out');

        setTimeout(() => {
          mobileMenuContainer.current.style.display = 'none';
          mobileMenuContainer.current.classList.remove('mobile-menu-fade-out');
        }, 375); // mobile-menu-fade-out animation is 400ms, allowing 25ms of hedge for events
      }
    } else {
      router.push('/').then(() => {
        setTimeout(() => {
          const productSection = document.getElementById(productId);
          if (productSection) {productSection.scrollIntoView({ behavior: 'smooth' });}
        }, 100);
      });
    }
  };

  // Mobile menu references
  const mobileMenuContainer = useRef(null);
  const mobileMenu = useRef(null);
  const mobileMenuButtonOpen = useRef(null);
  const mobileMenuButtonClose = useRef(null);
  const mobileMenuProductsDropdown = useRef(null);

  //Mobile menu state
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [showProductsDropdownArrowDirection, setShowProductsDropdownArrowDirection] = useState('⮟');
  const handleShowProductsDropdownClick = () => {
    if (!showProductsDropdown) {
      setShowProductsDropdown(true);
      setShowProductsDropdownArrowDirection('⮝');
    } else {
      setShowProductsDropdown(false);
      setShowProductsDropdownArrowDirection('⮟');
    }
  };

  useEffect(() => {
    const openMobileMenu = () => {
      if (mobileMenuContainer.current?.style.display !== 'flex') {mobileMenuContainer.current.style.display = 'flex';}
    };

    const closeMobileMenu = () => {
      if (mobileMenuContainer.current?.style.display !== 'none') {
        mobileMenuContainer.current.classList.add('mobile-menu-fade-out');

        setTimeout(() => {
          mobileMenuContainer.current.style.display = 'none';
          mobileMenuContainer.current.classList.remove('mobile-menu-fade-out');
        }, 375); // mobile-menu-fade-out animation is 400ms, allowing 25ms of hedge for events
      }
    };

    const handleClickOutsideMobileMenu = (event) => {
      let eventTarget = event.target;
      if (mobileMenuContainer.current?.contains(eventTarget) && !mobileMenu.current?.contains(eventTarget)) {closeMobileMenu();}
    };

    const handleViewportResize = () => {
      const viewportWidth = window.innerWidth;
      if (viewportWidth >= 1200) {closeMobileMenu();}
    };

    const currentMobileMenuButtonOpen = mobileMenuButtonOpen.current;
    const currentMobileMenuButtonClose = mobileMenuButtonClose.current;

    currentMobileMenuButtonOpen?.addEventListener('click', openMobileMenu);
    currentMobileMenuButtonClose?.addEventListener('click', closeMobileMenu);
    document.addEventListener('click', handleClickOutsideMobileMenu);
    window.addEventListener('resize', handleViewportResize);

    return () => {
      currentMobileMenuButtonOpen?.removeEventListener('click', openMobileMenu);
      currentMobileMenuButtonClose?.removeEventListener('click', closeMobileMenu);
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
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about-us">About Us</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li>
                <a href="#" onClick={() => handleShowProductsDropdownClick()}>
                  Products
                  {showProductsDropdownArrowDirection && <span className="NavBar-Navigation-Links-Products-Dropdown-Arrow">{showProductsDropdownArrowDirection}</span>}
                </a>
                <ul ref={mobileMenuProductsDropdown} className="NavBar-Navigation-Links-Products-Dropdown-Content" style={{height: showProductsDropdown ? '80px' : '0px'}}>
                  <li><button onClick={() => handleProductClick("homepage-papertrade-section")}><p>PaperTrade</p></button></li>
                  <li><button onClick={() => handleProductClick("homepage-financial-planner-section")}><p>Financial Planners</p></button></li>
                  <li><button onClick={() => handleProductClick("homepage-financial-calculator-section")}><p>Investant Calculator</p></button></li>
                </ul>
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
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about-us">About Us</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li className="NavBar-Navigation-Links-Products-Dropdown">
                  <a href="#">Products<span className="NavBar-Navigation-Links-Products-Dropdown-Arrow">&#11167;</span></a>
                  <ul className="NavBar-Navigation-Links-Products-Dropdown-Content">
                    <li><button onClick={() => handleProductClick("homepage-papertrade-section")}><p>PaperTrade</p></button></li>
                    <li><button onClick={() => handleProductClick("homepage-financial-planner-section")}><p>Financial Planners</p></button></li>
                    <li><button onClick={() => handleProductClick("homepage-financial-calculator-section")}><p>Investant Calculator</p></button></li>
                  </ul>
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