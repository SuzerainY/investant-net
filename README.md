## [Investant](https://investant.net) | Frontend Application

![Investant Favicon](https://github.com/SuzerainY/investant-net/blob/main/public/images/branding/OriginalLogoInvestantTHIN.png?raw=true)

Investant is an online platform founded for the financial literacy and education of new professionals.

## Background

This webapp runs on [Next.js](https://nextjs.org/) and is hosted with Vercel. This webapp is developed by [Ryan White](https://github.com/SuzerainY).

Join our [Investant Discord](https://discord.gg/SFUKKjWEjH) to speak with the team and try out [PaperTrade on Discord](https://github.com/SuzerainY/investant-discord)!

## Application Documentation

### Brief Summary

In its current state, the Next.js application speaks to a [STRAPI](https://strapi.io/) Content Management System (CMS) application hosted with [Digital Ocean](https://www.digitalocean.com/) on a subdomain of [investant.net](https://investant.net). There is one Postgres 16 database with Digital Ocean to support the CMS. For photo and media delivery, we are using the [Cloudinary](https://cloudinary.com/) api. For email delivery, we are using the [Twilio SendGrid](https://sendgrid.com/content/sendgrid/global/en-us) api.

The Next.js application is in JavaScript with [Sass CSS](https://sass-lang.com/) style sheets.

### Layouts

<strong>Default Layout:</strong> The Default Layout can be found at `layouts\DefaultLayout.js`

The Default Layout is used to render all standard pages containing the Header and Footer components. Attached to the Default Layout are the Vercel Analytics and Speed Insights scripts which allow for visibility on the frontend performance in the Vercel Dashboard. In addition, we are also tracking website activity with Google Analytics which is also attached to the Default Layout pages.

The Alert Banner can be closed by the user, which triggers the handleCloseAlertBanner() function. This function stores a cookie on the client stating that the Alert Banner is closed. This cookie is removed on the unload of the application, which means while navigating the site the Alert Banner will remain closed on each subsequent page, but upon closing or refreshing the tab containing the application, the cookie will be reset. This enables us to have an Alert Banner with any custom messaging that will be visible on each user's unique visit of the site, but can be closed for the current session.

### Components

<strong>Alert Banner:</strong> The Alert Banner Component can be found at `components\AlertBanner\AlertBanner.js` and styles at `styles\components\_alert-banner.scss`

The Alert Banner allows us to share any prevelant news or releases to the users. It takes a dynamic message and link that is displayed at the top of the screen. It also takes an `onClose()` method that will be called if the user closes the component.

<strong>Header:</strong> The Header Component can be found at `components\Header\Header.js` and styles at `styles\components\_header.scss`

There are two portions to the Header Component: The mobile navigation menu and the desktop navigation bar.

On mobile viewport width, the mobile application menu can be opened by calling the `openMobileMenu()` method. This method will add the `no-scroll` class to the html document so that the user cannot scroll the page behind the mobile menu. This was added since the entire document would re-render when the state of the `showProductsDropdown` changed. This state change would place the user back at the top of the document regardless of where they had scrolled the page to. If any navigation links are selected or when the `closeMobileMenu()` method is called, the `no-scroll` class is removed from the html document.

While each [investant.net](https://investant.net) product itself is being developed, we are simply navigating the users to the section on the landing page briefing the product and what's to come. As the products are released, the links will begin navigating the users to each product's dedicated page.