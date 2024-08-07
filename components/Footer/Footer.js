import { isValidEmail } from '@/my_modules/authenticationhelp';
import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";

export default function Footer() {

    // Handle the Newsletter Signup form
    const [newsletterSignUpEmail, setNewsletterSignUpEmail] = useState('');
    const validateNewsletterSignUpEmail = (email) => {return isValidEmail(email);};

    return (
        <>
            <footer className="footer">
                <div className="footer-body">
                    <section className="footer-body-link-forest">
                        <div className="footer-body-link-tree" style={{alignItems: 'center'}}>
                            <div className="footer-body-link-tree-root"><h4>Socials</h4></div>
                            <Link
                                href="https://discord.gg/SFUKKjWEjH"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image
                                    src="/images/socialmedia/discord-investant.png"
                                    alt="Discord Icon"
                                    width={25}
                                    height={20}
                                />
                            </Link>
                            <Link
                                href="https://twitter.com/InvestantGroup"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image
                                    src="/images/socialmedia/x-investant.png"
                                    alt="X Icon"
                                    width={20}
                                    height={20}
                                />
                            </Link>
                            <Link
                                href="https://www.instagram.com/investantgroup/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image
                                    src="/images/socialmedia/insta-investant.png"
                                    alt="Instagram Icon"
                                    width={22}
                                    height={22}
                                />
                            </Link>
                        </div>
                        <div className="footer-body-link-tree">
                            <div className="footer-body-link-tree-root"><h4>Pages</h4></div>
                            <Link href={'/'}>Home</Link>
                            <Link href={'/products'}>Products</Link>
                            <Link href={'/blog'}>Blog</Link>
                            <Link href={'/about-us'}>About</Link>
                        </div>
                        <div className="footer-body-link-tree">
                            <div className="footer-body-link-tree-root"><h4>Products</h4></div>
                            <Link href={'/products?block=PaperTrade'}>PaperTrade</Link>
                            <Link href={'/products?block=FinancialPlanner'}>Financial Planner</Link>
                            <Link href={'/products?block=FinancialCalculator'}>Investant Calculator</Link>
                        </div>
                        <div className="footer-body-link-tree">
                            <div className="footer-body-link-tree-root"><h4>Info</h4></div>
                            <Link href={'/login'}>Sign Up / Login</Link>
                            <Link href={'/account?block=settings'}>Account Settings</Link>
                            <Link href={'/contact-us'}>Contact Us</Link>
                        </div>
                    </section>
                    <section className="footer-join-newsletter-section">
                        <div className="footer-join-newsletter-section-text-container">
                            <div className="footer-join-newsletter-section-title">
                                <h2><span className="footer-join-newsletter-section-title-span">Subscribe</span> to our Newsletter</h2>
                            </div>
                        </div>
                        <div className="footer-join-newsletter-section-sign-up-container">
                            <div className="footer-join-newsletter-section-sign-up-input-container">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="footer-join-newsletter-section-sign-up-email-box"
                                    value={newsletterSignUpEmail}
                                    onChange={(e) => setNewsletterSignUpEmail(e.target.value)}
                                />
                                <Link href={`/login?form=SignUp${validateNewsletterSignUpEmail(newsletterSignUpEmail) === true ? `&email=${newsletterSignUpEmail}` : ""}`} className="footer-join-newsletter-section-sign-up-button">
                                    <h4>Sign Up</h4>
                                </Link>
                            </div>
                            <div className="footer-join-newsletter-section-sign-up-description">
                                <p>Stay current with the latest personal finance news and updates</p>
                            </div>
                        </div>
                    </section>
                </div>
                <div className="footer-baseline">
                    <div className="footer-logo">
                        <Link href="/">
                            <Image
                                src={"/images/branding/FaviconTransparentBordered.png"}
                                alt="Investant Favicon"
                                width={100}
                                height={100}
                                priority
                            />
                        </Link>
                    </div>
                    <div className="footer-copyright">
                        &copy; 2023-{new Date().getFullYear()} investant.net
                    </div>
                </div>
            </footer>
        </>
    );
}