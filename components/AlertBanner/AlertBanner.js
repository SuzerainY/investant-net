import React from "react";

function AlertBanner({message, link, linkMessage}) {
  return (
    <div className="alert-banner">
      <h3>
        {message}{" "}
        <a href={link} target="_blank">
         {linkMessage}
        </a>
      </h3>
    </div>
  );
}

export default AlertBanner;
