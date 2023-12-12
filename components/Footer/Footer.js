import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <>
            <div className="footer">
                <div className="footer-logo">
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
            </div>
        </>
    );
};