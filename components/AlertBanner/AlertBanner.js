import React from "react";
import Link from "next/link";

export default function AlertBanner({message, link, linkMessage}) {
  return (
    <div className="alert-banner">
      <h3>
        {message}{" "}
        <Link href={link} target="_blank" rel="noopener noreferrer">
          {linkMessage}
        </Link>
      </h3>
    </div>
  );
}