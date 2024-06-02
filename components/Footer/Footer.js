import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <>
            <footer className="footer">
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
            </footer>
        </>
    );
}