import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";
import Image from "next/image";
import { useInvestantUserAuth } from "@/context/GlobalContext";

export default function Header() {

  const router = useRouter();
  const { userSignedIn, clearInvestantUser } = useInvestantUserAuth();

  // Mobile menu references
  const mobileMenuContainer = useRef(null);
  const mobileMenu = useRef(null);
  const mobileMenuButtonOpen = useRef(null);
  const mobileMenuButtonClose = useRef(null);
  const mobileMenuProductsDropdown = useRef(null);

  //Mobile menu state
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const handleShowProductsDropdownClick = () => {
    if (!showProductsDropdown) {
      setShowProductsDropdown(true);
    } else {
      setShowProductsDropdown(false);
    }
  };

  // Route to product sections if navigated to via header
  const handleProductClick = (productId) => {
    // Close the mobile menu & route the user
    if (router.pathname === '/products') {
      closeMobileMenu();
      const productSection = document.getElementById(productId);
      if (productSection) {productSection.scrollIntoView({ behavior: 'smooth' });}

    } else {
      document.body.classList.remove('no-scroll');
      router.push('/products').then(() => {
        setTimeout(() => {
          const productSection = document.getElementById(productId);
          if (productSection) {productSection.scrollIntoView({ behavior: 'smooth' });}
        }, 100);
      });
    }
  };

  const openMobileMenu = () => {
    if (mobileMenuContainer.current?.style.display !== 'flex') {
      mobileMenuContainer.current.style.display = 'flex';
      document.body.classList.add('no-scroll');
    }
  };

  const closeMobileMenu = () => {
    if (mobileMenuContainer.current?.style.display !== 'none') {
      setShowProductsDropdown(false);
      mobileMenuContainer.current.classList.add('mobile-menu-fade-out');
      document.body.classList.remove('no-scroll');

      setTimeout(() => {
        mobileMenuContainer.current.style.display = 'none';
        mobileMenuContainer.current.classList.remove('mobile-menu-fade-out');
      }, 375); // mobile-menu-fade-out animation is 400ms, allowing 25ms of hedge for events
    }
  };

  // Mobile links should allow scrolling of page again
  const MobileNavLink = ({ href, className, style, children }) => {
    const handleMobileNavLinkClick = () => {document.body.classList.remove('no-scroll');};
    return (
      <Link href={href} className={className} style={style} onClick={handleMobileNavLinkClick}>
        {children}
      </Link>
    );
  };

  useEffect(() => {
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
          <div className="mobile-menu-logout-close-container">
            {userSignedIn === true ? (
              <button className="mobile-menu-logout-user" onClick={() => {document.body.classList.remove('no-scroll'); clearInvestantUser();}}>
                <p>Logout</p>
              </button>
            ) : (
              <MobileNavLink href="/login?form=Login" className="mobile-menu-logout-user" style={{ opacity: '1.0', color: '#E81CFF' }}><p style={{ fontWeight: 'bold' }}>Login</p></MobileNavLink>
            )}
            <div ref={mobileMenuButtonClose} className="mobile-menu-close">
              <Image
                src={"/images/clipart/White-X.svg"}
                alt="Close Menu"
                width={40}
                height={40}
              />
            </div>
          </div>
          <div className="mobile-menu-navigation">
            <ul>
              <li><MobileNavLink href="/">Home</MobileNavLink></li>
              <li><MobileNavLink href="/blog">Blog</MobileNavLink></li>
              <li><MobileNavLink href="/about-us">About</MobileNavLink></li>
              <li>
                <div className="mobile-menu-navigation-products" onClick={() => handleShowProductsDropdownClick()}>
                  Products
                  <span className="NavBar-Navigation-Links-Products-Dropdown-Arrow">
                    <Image
                      src={"/images/clipart/WhiteDropDownArrow.png"}
                      alt="Products Drop Down Arrow"
                      width={20}
                      height={20}
                      style={{rotate: showProductsDropdown ? '-180deg' : '0deg'}}
                    />
                  </span>
                </div>
                <ul ref={mobileMenuProductsDropdown} className="NavBar-Navigation-Links-Products-Dropdown-Content" style={{height: showProductsDropdown ? '80px' : '0px'}}>
                  <li><button onClick={() => handleProductClick("productspage-papertrade-section")}><p>PaperTrade</p></button></li>
                  <li><button onClick={() => handleProductClick("productspage-financial-planner-section")}><p>Financial Planners</p></button></li>
                  <li><button onClick={() => handleProductClick("productspage-financial-calculator-section")}><p>Investant Calculator</p></button></li>
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
                  src={"/images/branding/FaviconTransparentBordered.png"}
                  alt="Investant Favicon"
                  width={50}
                  height={50}
                  priority
                />
              </Link>
            </div>
            <div className="mobile-menu-sign-in-user">
              {userSignedIn === true ? (
                <Link href="/account" className="NavBar-Investant-Sign-Up-Button"><p>Account</p></Link>
              ) : (
                <Link href="/login?form=SignUp" className="NavBar-Investant-Sign-Up-Button"><p>Sign Up</p></Link>
              )}
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
            <div className="NavBar-Investant-Logo-Container">
              <Link href="/">
                <Image
                  src={"/images/branding/FaviconTransparentBordered.png"}
                  alt="Investant Logo"
                  width={50}
                  height={50}
                  priority
                />
              </Link>
              {userSignedIn === true ? (
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <Link
                    href="/account"
                    className="NavBar-Investant-Sign-In-Button"
                    style={{ height: 'auto', marginLeft: '-10px', marginBottom: '2px', padding: '4px 10px' }}>
                    <p>Account</p>
                  </Link>
                  <button
                    onClick={clearInvestantUser}
                    className="NavBar-Investant-Sign-In-Button"
                    style={{ height: 'auto', marginLeft: '0px', marginBottom: '2px', padding: '4px 0px', backgroundColor: 'transparent', color: 'white' }}>
                    <p>Logout</p>
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login?form=SignUp"
                    className="NavBar-Investant-Sign-In-Button"
                    style={{ marginLeft: '-10px' }}
                  >
                    <p>Sign Up</p>
                  </Link>
                  <Link
                    href="/login?form=Login"
                    className="NavBar-Investant-Sign-In-Button"
                    style={{ marginLeft: '0px', padding: '5px 0px', backgroundColor: 'transparent', color: 'white' }}
                  >
                    <p>Login</p>
                  </Link>
                </>
              )}
            </div>
            <div className="NavBar-Navigation-Links">
              <ul>
                <li><Link href="/">Home</Link></li>
                <li style={{marginRight: '20px'}} className="NavBar-Navigation-Links-Products-Dropdown">
                  <Link href="/products">
                    Products
                    <span className="NavBar-Navigation-Links-Products-Dropdown-Arrow">
                      <Image
                        src={"/images/clipart/WhiteDropDownArrow.png"}
                        alt="Products Drop Down Arrow"
                        width={22}
                        height={22}
                      />
                    </span>
                  </Link>
                  <ul className="NavBar-Navigation-Links-Products-Dropdown-Content">
                    <li><button onClick={() => handleProductClick("productspage-papertrade-section")}><p>PaperTrade</p></button></li>
                    <li><button onClick={() => handleProductClick("productspage-financial-planner-section")}><p>Financial Planners</p></button></li>
                    <li><button onClick={() => handleProductClick("productspage-financial-calculator-section")}><p>Investant Calculator</p></button></li>
                  </ul>
                </li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/about-us">About</Link></li>
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