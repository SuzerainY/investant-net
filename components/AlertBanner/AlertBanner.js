import React from "react";

export default function AlertBanner({message, link, linkMessage}) {
  return (
    <div className="alert-banner">
      <h3>
        {message}{" "}
        <a href={link} target="_blank" rel="noopener noreferrer">
          {linkMessage}
        </a>
      </h3>
    </div>
  );
}