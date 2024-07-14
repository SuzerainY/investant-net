import { STRAPIurl } from '@/my_modules/bloghelp';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Parse the Alert Banner Message and the Linked Portion of the message to create the text element with proper link location
const generateAlertBannerComponent = (fullMessage, linkedPortion, linkURL) => {
  // Default message to send on failure
  let alertBannerMessage = (<h3>Investant | Financial Tools, Literacy, & Education | <Link href={'https://investant.net/contact-us'}>Contact Us</Link></h3>);
  try {
    if (fullMessage.includes(linkedPortion) === false) {
      return alertBannerMessage;
    } else {
      for (let i = 0; i < fullMessage.length; i++) {
        if (fullMessage[i] === linkedPortion[0]) {
          for (let j = 0; j < linkedPortion.length; j++) {
            if ((j === linkedPortion.length - 1) && (fullMessage[i + j] === linkedPortion[j])) {
              return (
                <h3>
                  {fullMessage.substring(0, i)}
                  <Link href={linkURL} target="_blank" rel="noopener noreferrer">{linkedPortion}</Link>
                  {fullMessage.length - 1 > i + j ? fullMessage.substring(i + j + 1) : ''}
                </h3>
              );
            }
          }
        }
      }
      return alertBannerMessage;
    }
  } catch (error) {return alertBannerMessage;}
};

export default function AlertBanner() {

  const [clientShowAlertBanner, setClientShowAlertBanner] = useState(false);
  const [serverShowAlertBanner, setServerShowAlertBanner] = useState(null);
  const [fullMessage, setFullMessage] = useState(null);
  const [linkedPortion, setLinkedPortion] = useState(null);
  const [linkURL, setLinkURL] = useState(null);

  useEffect(() => {
    const fetchAlertBannerProps = async () => {
      const fetchParams = {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          query: `
            query GetWebAlertBanner {
              webAlertBanner {
                data {
                  id
                  attributes {
                    ShowAlertBanner
                    FullMessage
                    LinkedPortion
                    LinkURL
                  }
                }
              }
            }
          `
        })
      };
      try {
        const res = await fetch(`${STRAPIurl}/graphql`, fetchParams);
        const data = await res.json();

        // Set the components
        setFullMessage(await data.data.webAlertBanner.data.attributes.FullMessage);
        setLinkedPortion(await data.data.webAlertBanner.data.attributes.LinkedPortion);
        setLinkURL(await data.data.webAlertBanner.data.attributes.LinkURL);
        setServerShowAlertBanner(await data.data.webAlertBanner.data.attributes.ShowAlertBanner);

      } catch (error) {setServerShowAlertBanner(false);}
    }; fetchAlertBannerProps();
  }, []);

  // Check if user has alert banner closed in browser storage
  useEffect(() => {
    const isAlertBannerClosed = localStorage.getItem("investantNetAlertBannerClosed");
    if (!isAlertBannerClosed) {setClientShowAlertBanner(true);}
  }, []);

  // Events to trigger before terminating page session
  useEffect(() => {
    const handleBeforeUnload = () => {localStorage.removeItem("investantNetAlertBannerClosed");};
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {window.removeEventListener("beforeunload", handleBeforeUnload);};
  }, []);

  // Handle the closing of the alert banner with browser storage
  const handleCloseAlertBanner = () => {
    setClientShowAlertBanner(false);
    localStorage.setItem("investantNetAlertBannerClosed", "true");
  };

  return (
    <>
      {(clientShowAlertBanner === true) && (serverShowAlertBanner === true) && (
        <div className="alert-banner">
          <div className="alert-banner-text">
            {generateAlertBannerComponent(fullMessage, linkedPortion, linkURL)}
          </div>
          <div className="alert-banner-exit" onClick={handleCloseAlertBanner}>
            <Image
              src={'/images/clipart/White-X.svg'}
              alt={'Close Alert Banner'}
              width={50}
              height={50}
            />
          </div>
        </div>
      )}
    </>
  );
};