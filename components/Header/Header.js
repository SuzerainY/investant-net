import React from "react";
import Link from "next/link";
import Image from "next/image";

function Header() {
  return (
    <nav className="header">

      <Link href="/">
        <Image
          src={"/images/branding/TransparentLogoHeader.png"}
          alt="Investant Logo"
          width={300}
          height={60}
          priority
        />
      </Link>
   
      <ul>
        <li className="page-nav-link">
          <Link href="/">Home</Link>
        </li>
        <li className="page-nav-link">
          <Link href="/papertrade">PaperTrade</Link>
        </li>
        <li className="page-nav-link">
          <Link href="/about-us">About Us</Link>
        </li>
        <li className="page-nav-link">
          <Link href="/blog">Blog</Link>
        </li>
      </ul>

      <div className="social-media-container">
        <ul>        
          <li className="social-media-container-item">
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
          <li className="social-media-container-item">
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
          <li className="social-media-container-item">
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
}

export default Header;
