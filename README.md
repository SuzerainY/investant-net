# <span style="color:#E81CFF">[Investant](https://investant.net) | Frontend Application</span>

![Investant Favicon](https://github.com/SuzerainY/investant-net/blob/main/public/images/branding/OriginalLogoInvestantTHIN.png?raw=true)

**Investant** is an online platform founded for the financial literacy and education of new professionals.

## Background

This webapp runs on [Next.js](https://nextjs.org/) and is hosted with Vercel. This webapp is fully developed and maintained by [Ryan White](https://github.com/SuzerainY).

Join our [Investant Discord](https://discord.gg/SFUKKjWEjH) to speak with the team and try out [PaperTrade on Discord](https://github.com/SuzerainY/investant-discord)!

# <span style="color:#E81CFF">Application Documentation</span>

## Brief Summary

In its current state, the Next.js application speaks to a [STRAPI](https://strapi.io/) Content Management System (CMS) application hosted with [Digital Ocean](https://www.digitalocean.com/) on a subdomain of [investant.net](https://investant.net). There is one Postgres 16 database with Digital Ocean to support the CMS. For photo and media delivery, we are using the [Cloudinary](https://cloudinary.com/) api. For email delivery, we are using the [Twilio SendGrid](https://sendgrid.com/content/sendgrid/global/en-us) api.

The Next.js application is in JavaScript with [Sass CSS](https://sass-lang.com/) style sheets.

## Key

**<span style="color:#FFCC00">Alert Yellow:</span> In Development**

## APIs

### Email Verification | `/api/verify-email`

The Email Verification api is used on the sign-up of a new user. Our backend will generate a confirmation token for the new user and deliver a custom email template with a unique URL to the `/api/verify-email` api containing the token in the router query parameters. The token is used to make a GET request to our backend with the token and upon a `ok` response, we route the user to the homepage of the site.

The reason we use this api to make the request with the token rather than having the Verification URL itself make the GET request is due to our decision to create our own email template requiring unique logic and styles. To create this email template, it was necessary to turn off the default users-permissions email verification flow which, in turn, disables us from easily selecting a reroute url. This implementation gives us more control over routing the user on email verification from the frontend and nextjs was the simpler development choice than changing the default logic of the users-permissions plugin on STRAPI.

``` javascript
export default async function handler(req, res) {    
    try {
        const { confirmationToken } = req.query;
        if (!confirmationToken) { throw new Error('No Confirmation Token Provided. Email Verification Failed.'); }
        // Verify the token and confirm the user
        const response = await fetch(`${STRAPIurl}/api/auth/email-confirmation?confirmation=${confirmationToken}`, {
            method: 'GET',
        });
        if (!response.ok) { throw new Error('Email Verification Failed.'); }

        // Redirect to login page
        res.writeHead(302, { Location: '/login' });
        res.end();
    } catch (error) { res.writeHead(302, { Location: '/error?type=EmailVerification' }); res.end(); }
};
```

### Google Recaptcha Verification | `/api/verify-google-recaptcha`

The Google Recaptcha Verification api is used to verify the google recaptcha tokens generated on forms and actions throughout the site. It is called by the `verifyGoogleRecaptcha()` method of the `authenticationhelp.js` module. The api only accepts POST requests and must include the recaptcha token in the request body. We simply pass the token through to google's siteverify api and return the response json.

We are using Google reCAPTCHA V3. Refer to the [official documentation](https://developers.google.com/recaptcha/docs/v3).

``` javascript
export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { token } = req.body;
            if (!token) {throw new Error('Token is missing');}

            const googleRecaptchaSecretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
            if (!googleRecaptchaSecretKey) {throw new Error('Google reCAPTCHA secret key is not provided');}
    
            const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `secret=${googleRecaptchaSecretKey}&response=${token}`
            });
    
            if (!response.ok) {throw new Error('Failed To Verify Google reCAPTCHA Token');}

            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {res.status(400).json({ error: error.message });}
    } else {res.status(405).json({ error: 'Method not allowed' });}
};
```

## Pages

### Home: `/` or `/index.js`

Styles available at `styles\pages\_home.scss`

The landing page for the site, or home page. On arrival, the visitor lands on the site's hero: a young professional dressed in business casual working on his laptop. Leaking onto the viewport is the Investant Handbook: 3 Steps To Take Today.

On the home page, we fetch the latest 5 blog posts for featuring using `getServerSideProps()` method. We have installed a [graphql](https://graphql.org/) layer to our STRAPI CMS APIs which we use to make these requests.

``` javascript
export async function getServerSideProps(context) {
  const fetchParams = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query GetBlogPosts {
          featuredPosts: blogPosts(pagination: { pageSize: 5 } sort: "id:desc") {
            data {
              id
              attributes {
                Title
                BlogPostDescription
                PublishDate
                SLUG
                SPLASH {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      `,
    }),
  };
  const res = await fetch(`${STRAPIurl}/graphql`, fetchParams);
  const data = await res.json();
  return { props: data };
};
```

### About Us: `/about-us`

Styles available at `styles\pages\_about-us.scss`

The About Us page. On this page is information about the [investant.net](https://investant.net) mission and its creators: [Haven Smith](https://www.linkedin.com/in/haven-smith/) and [Ryan White](https://www.linkedin.com/in/ryanrw/).

Content for the About Us page are fetched from the CMS using the `getServerSideProps()` method.

``` javascript
export async function getServerSideProps(context) {
  const fetchParams = {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      query: `
        query GetAboutUsPage {
          aboutUsPage {
            data {
              id
              attributes {
                HavenDescription
                HavenProfilePicture {
                  data {
                    attributes {
                      url
                    }
                  }
                }
                RyanDescription
                RyanProfilePicture {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      `
    })
  };
  const res = await fetch(`${STRAPIurl}/graphql`, fetchParams);
  const data = await res.json();
  return { props: data };
};
```

Long text sections are stored as Markdown, so we make use of `react-markdown` and `rehype-raw` to generate HTML components. The text is passed through our `parseMarkdownHTML()` method to apply unique styling such as the magenta coloring of **<span style="color:#E81CFF">investant.net</span>**.

### Blog: `/blog`

Styles available at `styles\pages\_blog.scss`

The blog page fetches from the CMS with the `getServerSideProps()` method which makes use of the [graphql](https://graphql.org/) layer on our APIs. Navigating by clicking on any blog post will route the user to a dynamic route /blog/[SLUG] where each blog post has a unique SLUG.

### Blog Post: `/blog/[slug]`

Styles available at `styles\pages\_blog.scss`

This dynamic route fetches routes using `getServerSidePaths()` which captures all the SLUGs available for blog posts at build time. We set fallback to true in the return object so that if the user is attempting to fetch a blog post that did not exist at build time, it can still be handled using the `slug` passed from the url into params.

``` javascript
// Fetch the SLUG for the selected BlogPost in order to route the new URL properly
export async function getServerSidePaths() {
  const fetchParams = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        {
          blogPosts {
            data {
              attributes {
                SLUG
              }
            }
          }
        }
      `
    })
  };
  const res = await fetch(`${STRAPIurl}/graphql`, fetchParams);
  const data = await res.json();
  const paths = data.data.blogPosts.data.map((post) => ({
    params: { slug: post.attributes.SLUG },
  }));
  return { paths, fallback: true };
};
```

The `getServerSideProps()` method fetches the content from our CMS for the blog post that has the unique `slug` requested.

``` javascript
// Fetch the selected blog from the server via graphql
export async function getServerSideProps({ params }) {
  const slug = params.slug;
  const fetchParams = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query getBlogPost($slug: String!) {
          blogPosts(filters: {SLUG: {eq: $slug}}) {
            data {
              attributes {
                Title
                BlogPostBody
                BlogPostDescription
                SLUG
                Author
                PublishDate
                SPLASH {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: {"slug": slug} // Select the BlogPost with this specific SLUG (every BlogPost has a unique SLUG)
    })
  };
  const res = await fetch(`${STRAPIurl}/graphql`, fetchParams);
  const data = await res.json();
  return { props: data };
};
```

We have written a parser in the `my_modules\bloghelp.js` module called `parseMarkdownHTML()` that enables embedded youtube, twitter, and other content to be displayed properly. For twitter embeds specifically, this method will return to the page that a twitter embed exists and so the twitter widget should be fetched and added to the document which is handled as a `useEffect()` when the state of `embeddedTweetExists` changes.

``` javascript
useEffect(() => {
  // Preload Twitter Widget for embedded tweets
  const loadTwitterWidgetScript = () => {
    const script = document.createElement('script');
    script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
    script.setAttribute('async', 'true');

    // Wait for the script to be fully loaded, then append it to the document head
    script.onload = () => {
      // Ensure the DOM is ready before calling load()
      document.addEventListener('DOMContentLoaded', () => {
        window.twttr.widgets.load(document.getElementById("slug-page-body"));
      });
    };
    document.head.appendChild(script);
  };
  // Check if we need to preload the twitter widget and handle accordingly
  const checkAndLoadTwitterWidget = () => {
    // Load Twitter widget script only if we found an embedded tweet in the body of this blog post
    if (embeddedTweetExists) {
      // If we don't have the twitter widget defined, then preload the widget
      if (!window.twttr) {
        loadTwitterWidgetScript();
      } else { // We do have the twitter widget defined, run it
        window.twttr.widgets.load(document.getElementById("slug-page-body"));
      }
    }
  };

  // Check and load Twitter widget script on initial component mount
  checkAndLoadTwitterWidget();

  // Clean up: Remove any event listeners when component unmounts
  return () => {};
}, [embeddedTweetExists]);
```

### Login | `/login`

Styles available at `styles\pages\_login.scss`

This page contains our login and sign-up forms which are protected by google reCAPTCHA V3. We append the recaptcha `<script>` element to the document head on page load and wrap our form submission methods with the `grecaptcha.execute()` method to generate a token. We then verify the token and receive a score which we use to determine whether the user is likely to be a human or a bot. See more in the `/api/verify-google-recaptcha` api.

``` javascript
grecaptcha.execute(googleRecaptchaSiteKey, { action: 'Investant_Web_User_Login' }).then(async (token) => {
  try {
    // Google Recaptcha Verification
    if (await verifyGoogleRecaptcha(token) !== true) {
      setError('We Believe You Are A Bot. Please Contact Us If The Issue Persists.');
      return;
    }

    // This API request will return a signed JWT and user object if the user logs in successfully
    const response = await fetch(`${STRAPIurl}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        identifier: usernameEmail,
        password: password
      })
    });
    const data = await response.json();

    if (!response.ok) {
      // Catch known default STRAPI Errors
      if (data.error.message === 'Invalid identifier or password') {
        setError('Invalid Username/Email or Password');
        return;
      } else {throw new Error('Unaccounted For Error Occurred.');}
    } else if (data.user.confirmed !== true) {
      setError('Please Verify Your Email Before Logging In. If You Do Not See The Email, Check Your Spam Folder.');
      return;
    }

    setLiveLogin(true);
    updateInvestantUser({
      userJWT: data.jwt,
      username: data.user.username,
      userEmail: data.user.email,
      userSubscriptions: {
        blogPostSubscription: data.user.blogPostSubscription
      },
      userSignedIn: true
    });
    if (router.query.referrer) {
      router.push(`/${router.query.referrer}`);
      return;
    }; router.push('/');
  } catch (error) {setLiveLogin(false); setError('Login Failed. Please Contact Us If The Issue Persists.');}
});
```

The user can toggle between the **Login** and **Sign Up** forms. We page's router query also accepts the `form` parameter which can be used to land the user on either of the forms intially. The `email` parameter is also accepted to set the email passed as auto-populated to the email input field. The `referrer` query parameter can be used to determine what page to route to after logging in.

| Router Query | Query Function |
|--------------|----------------|
| form | Define what form will be visible when page first loads |
| email | Pass an email that will be auto-populated in the sign-up form |
| referrer | Define what page of the site will be routed to after logging in |

### Forgot Password | `/recovery/forgot-password`

Styles available at `styles\pages\_login.scss`

The Forgot Password page is meant to initiate the email password recovery flow. The form is protected by google reCAPTCHA V3. The user may input the email address they created their account with and will receive an email with a unique password recovery link. The link will route the user to the New Password page where the password recovery code provided in the email is used to validate the user.

Our STRAPI api will generate the user a password recovery code and provide it in the url attached to the email as a query parameter.

``` javascript
grecaptcha.execute(googleRecaptchaSiteKey, { action: 'investantWebUserForgotPasswordFormSubmission' }).then(async (token) => {
  try {
    // Google Recaptcha Verification
    if (await verifyGoogleRecaptcha(token) !== true) {
      setError('We Believe You Are A Bot. Please Contact Us If The Issue Persists.');
      return;
    }

    const response = await fetch(`${STRAPIurl}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email
      })
    });
    if (!response.ok) {throw new Error('Unaccounted For Error Occurred.');}

    setInfo('Email Sent. Please Check Your Inbox To Rest Your Password. If You Cannot Find The Message, Try Your Spam Folder!');
  } catch (error) {setError('Something Went Wrong. Please Contact Us If The Issue Persists.');}
});
```

### New Password | `/recovery/new-password`

Styles available at `styles\pages\_login.scss`

The New Password page is meant to complete the email password recovery flow. The router query accepts the `code` parameter which should contain the password recovery code provided to the user in the password recovery email. The form is protected by google reCAPTCHA V3.

We pass the user's new password and code to our STRAPI api which handles the password update.

``` javascript
grecaptcha.execute(googleRecaptchaSiteKey, { action: 'investantWebUserForgotPasswordSetNewPasswordFormSubmission' }).then(async (token) => {
  try {
    // Google Recaptcha Verification
    if (await verifyGoogleRecaptcha(token) !== true) {
      setError('We Believe You Are A Bot. Please Contact Us If The Issue Persists.');
      return;
    }

    const response = await fetch(`${STRAPIurl}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: userCode,
        password: newPassword,
        passwordConfirmation: confirmNewPassword
      })
    });
    if (!response.ok) {throw new Error('Unaccounted For Error Occurred.');}

    setInfo('New Password Set! Feel Free To Leave This Page!');
  } catch (error) {setError('Something Went Wrong. Please Contact Us If The Issue Persists.');}
});
```

### Account | `/account`

Styles available at `styles\pages\_account.scss`

The Account page is for users to manage their user info, subscriptions, and account settings. All of the forms are incorporated in the single page and rendered conditionally based on which "block" has been activated/selected.

When the user requests to change username, email, or password, we call a special api route we've created on the STRAPI backend. It accepts a PUT method with the user's JWT token in the Authorization header. It will send back the updated field confirming the change which we use to instantly update the user state.

``` javascript
grecaptcha.execute(googleRecaptchaSiteKey, { action: 'Investant_Web_User_Account_Page_Set_New_Username_Form_Submission' }).then(async (token) => {
  try {
    // Google Recaptcha Verification
    if (await verifyGoogleRecaptcha(token) !== true) {
      setError('We Believe You Are A Bot. Please Contact Us If The Issue Persists.');
      return;
    }
      
    const response = await fetch(`${STRAPIurl}/api/user/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${userJWT}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: newUsername
      })
    });
    const data = await response.json();

    if (!response.ok) {
      // Handle Known Errors
      if (data.message === 'Username already taken') {
        setError('Username Already Taken');
        return;
      }
      throw new Error('Unaccounted For Error Occurred.');
    }
          
    updateInvestantUser({
      username: data.userInfo.username
    });

    setInfo('Username Updated!');
  } catch (error) {setError('Unable To Change Username. Please Contact Us If The Issue Persists.');}
});
```

In the profile block, we allow the user to update their info such as Username, Email, and Password. These forms are connected to our CMS API.

In the subscriptions block, we allow the user to subscribe/unsubscribe from our notifications. In the future, we will be adding the distinction between Paid and Free Subscriptions. Paid subscriptions will be handled through Stripe.

In the settings block, users may Delete Account and change other user-specific web settings for our web-application.

### Contact Us | `/contact-us`

Styles available at `styles\_account.scss`

The Contact Us page is for users to send messages to the Investant Team. We handle this in two different ways based on the current user state in the application.

If the user is logged in, we already have their username and email, so they may just enter their Subject and Message and submit the form. If the user is a public guest, we require they share their name and email so we can respond to them.

On submition, the form will create a new database entry in our admin panel which auto-fires an email to the Investant Executive Team. We hold ourselves accountable to a <strong>same-day response</strong> to the ticket.

``` javascript
grecaptcha.execute(googleRecaptchaSiteKey, { action: 'Investant_Web_User_Contact_Us_Form_Submission' }).then(async (token) => {
  try {
    // Google Recaptcha Verification
    if (await verifyGoogleRecaptcha(token) !== true) {
      setError('We Believe You Are A Bot. Please Try Again Later.');
      return;
    }
        
    const response = await fetch(`${STRAPIurl}/api/contact-us-submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          Subject: contactUsSubject,
          Message: contactUsMessage,
          OpenedAt: new Date().toISOString(),
          ContactName: contactUsName,
          ContactEmail: contactUsEmail,
          TicketClosed: false
        }
      })
    });

    if (!response.ok) {
      // Handle Known Errors
      throw new Error('Unaccounted For Error Occurred.');
    }
    setInfo('Message Delivered! Haven Or Ryan Will Reach Out To You As Soon As Possible!');
  } catch (error) {setError('Unable To Deliver Message. Please Try Again Later.');}
});
```

### Products | `/products`

Styles available at `styles\_products`

The Products page holds the descriptions and links to each Product provided by Investant. These are currently under development as we settle in our the company brand and direction.

#### PaperTrade:

PaperTrade was the initial works of Haven and Ryan which is already available in the [Investant Discord Server](https://discord.gg/SFUKKjWEjH) as a [Discord Bot](https://github.com/SuzerainY/InvestantDiscord/) that allows users to trade with fake incomes on real-time market data through the Yahoo Finance API.

PaperTrade will be brought to the web as a full-fledged online paper money trading platform. This will be gamified with live leaderboards on the homepage of the site and weekly/monthly competitions for the community.

#### Financial Planners

The Investant Financial Planner will be an online personal finance planner and budgeter that provides natural language insights, forecasts, and recommendations to the user based on their personal financial situation.

Inputs will be such as income, expenses, planned expenditures, etc. What-If queries can be performed by the user to receive forecasts, insights, and recommendations to afford certain goals/purchases/loans, retire in a certain time, or overall better understand their current financial situation to make step-by-step improvements.

The user will be able to save a financial plan which can be returned to on our site whenever they please.

#### The Investant Calculator

The Investant Calculator will be an easy-to-approach financial loan and amortization calculator that 1: acts as an API for the public and internal site tools and 2: provides the common consumer brevity in understanding the full costs and impacts of things such as a car loan, home loans, increased income, etc.

### Error | `/error`

Styles available at `styles\_account`

The Error page is used to provide users a safe landing page in the case of breaking api errors or simple redirect issues. As an example, if the user clicks the link in their email to verify email and there is an error, they will land on the `/error` page with a useful message sharing what may have happened and a link to contact us.

## Components

### Alert Banner:

The Alert Banner Component can be found at `components\AlertBanner\AlertBanner.js` and styles at `styles\components\_alert-banner.scss`

The Alert Banner allows us to share any prevelant news or releases to the users. It pulls its message live from the Investant Admin Panel that we are able to change or turn on/off at any moment. This allows us to send any new news to the website users immediately.

We store whether the client browser has closed the Alert Banner during this session in broswer localStorage.

``` javascript
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
```

### Header:

The Header Component can be found at `components\Header\Header.js` and styles at `styles\components\_header.scss`

There are two portions to the Header Component: The mobile navigation menu and the desktop navigation bar.

We will display the "Account" or "Sign Up" button depending on if the user is logged in or a guest. These buttons will always be on the header bar, but on mobile we move the Login/Logout button to the mobile menu.

On mobile viewport width, the mobile application menu can be opened by calling the `openMobileMenu()` method. This method will add the `no-scroll` class to the html document so that the user cannot scroll the page behind the mobile menu. This was added since the entire document would re-render when the state of the `showProductsDropdown` changed. This state change would place the user back at the top of the document regardless of where they had scrolled the page to. If any navigation links are selected or when the `closeMobileMenu()` method is called, the `no-scroll` class is removed from the html document.

``` javascript
const openMobileMenu = () => {
    if (mobileMenuContainer.current?.style.display !== 'flex') {
        mobileMenuContainer.current.style.display = 'flex';
        document.body.classList.add('no-scroll');
    }
};
```
``` javascript
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
```

While each [investant.net](https://investant.net) product itself is being developed, we are simply navigating the users to the section on the products page briefing the product and what's to come. As the products are released, the links will begin navigating the users to each product's dedicated page.

### Footer:

The Footer Component can be found at `components\Footer\Footer.js` and styles at `styles\components\_footer.scss`

The Footer Component contains our rotating favicon and copyright at the baseline. In the body lives the Link Forest (containing each Link Tree of pages and paths around the website) and the Newsletter Signup call to action. The Newsletter Signup element will navigate the user to create an account as we do not want to allow general public to pass non-verified emails.

### Google Analytics:

The Google Analytics Component can be found at `components\GoogleAnalytics\GoogleAnalytics.js`

The Google Analytics Component contains the script link with our website's KEY stored in environment variables.

## Custom Modules

### Authentication Help: `my_modules\authenticationhelp.js`

The purpose of the Authentication Help module is to contain functions regarding the aiding of JWT and other token authentication, form guardrails, and any methods pertaining to verification and authentication of users.

The `isValidUsername()`, `isValidEmail()`, `isValidPassword()`, and `isValidText()` methods verify user inputs from our account and communication related forms to fit our expectations for usernames, emails, passwords, and text bodies. We make use of regular expressions which ensure inputs meet our defined patterns.

We will be attempting to minimize the distasteful usernames that can be created on the site.

The `verifyGoogleRecaptcha()` method calls our Verify Google Recaptcha api and tests the response body to contain a score > 0.5. We are using Google reCAPTCHA V3. Refer to the [official documentation](https://developers.google.com/recaptcha/docs/v3).

``` javascript
export const verifyGoogleRecaptcha = async (token) => {
  try {
    const googleRecaptchaResponse = await fetch('/api/verify-google-recaptcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });
    const googleRecaptchaData = await googleRecaptchaResponse.json();
    if (googleRecaptchaData.success === true && googleRecaptchaData.score > 0.5) {return true;}
    return false;
  } catch (error) {return false;}
};
```

### Blog Help: `my_modules\bloghelp.js`

The purpose of the Blog Help module is to contain functions regarding the aiding of blog posts content, styling, and data preparation.

The `customImage()` method is passed into any `<Markdown></Markdown>` calls as a component that handles the adjustment of any cloudinary images served from our cloudinary blobs to next `<Image/>` components.

``` javascript
// Custom component to conditionally render Cloudinary images as Next.js Image components
export const customImage = ({ alt, src }) => {
  try {
    if (src.includes('https://res.cloudinary.com')) {
      return (
        <Image
          alt={alt || ''}
          src={src}
          width={800}
          height={600}
        />
      );
    }
    return <img alt={alt || ''} src={src}/>;
  } catch (error) {return <img alt={alt || ''} src={src}/>};
};
```

The most essential method of the Blog Help module is `parseMarkdownHTML()` which parses the blog post bodies for edge cases and handles each accordingly by either inserting or removing required characters.

To maintain website styling, it adds the `investant-net-span` class to any **investant.net** found in the text body.

``` javascript
// Case investant.net found (accent with magenta)
if (textBody[i] === 'i' && i + 13 < textBody.length && textBody.substring(i, i + 13) === 'investant.net') {
  if (i - 8 >= 0 && textBody.substring(i - 8, i) === 'https://') {continue;}
  openIndex = i;
  closeIndex = i + 13;
  stringInsert = '<span className="investant-net-span">investant.net</span>';

  textBody = textBody.substring(0, openIndex) + stringInsert + textBody.substring(closeIndex);
  i = openIndex + stringInsert.length;
}
```

The parser centers any embedded Tweets it finds from X/Twitter and sets embeddedTweetExists as true so the `/blog/[slug]` page, as an example, knows to fetch the twitter widget.js script.

``` javascript
// Case: Twitter Embedded Tweet
else if (textBody[i] === '<' && i + 34 < textBody.length && textBody.substring(i, i + 34) === '<blockquote class="twitter-tweet">') {
  // Let's flag that we've found an embedded tweet so we can preload the twitter widget
  if (embeddedTweetExists !== true) {embeddedTweetExists = true;}

  openIndex = i;
  closeIndex = i + 34;
  stringInsert = '<blockquote class="twitter-tweet tw-align-center">';

  // Apply the tw-align-center class to the embedded tweet
  textBody = textBody.substring(0, openIndex) + stringInsert + textBody.substring(closeIndex);
  i = openIndex + stringInsert.length - 1;
}
```

The parser wraps any youtube embedded video iframes in our `youtube-embed-container` class so that we can handle the styling appropriately.

``` javascript
// Case: Youtube Embedded Video
else if (textBody[i] === '<' && i + 7 < textBody.length && textBody.substring(i, i + 7) === '<iframe' && textBody.substring(i - 41, i) != '<div classname="youtube-embed-container">') {
  openIndex = i;
  i += 7;

  while (textBody[i] != '>' && i + 1 < textBody.length) {
    i++;
    // If 'youtube.com/embed' in <iframe> tag, then fetch close of iframe
    if (textBody[i] === 'y' && i + 17 < textBody.length && textBody.substring(i, i + 17) === 'youtube.com/embed') {
      let j = i + 17;
      while (j + 1 < textBody.length && textBody.substring(j - 9, j + 1) != "></iframe>") {j++;}

      // We've exited while loop, check if we found found closing </iframe> tag and apply <div classname="youtube-embed-container"></div>
      if (textBody.substring(j - 9, j + 1) === '></iframe>') {
        closeIndex = j + 1;
        stringInsert = `<div classname="youtube-embed-container">${textBody.substring(openIndex, closeIndex)}</div>`;
        textBody = textBody.substring(0, openIndex) + stringInsert + textBody.substring(closeIndex);
        i = openIndex + stringInsert.length - 1;
        break;
      }
    }
  }
}
```

## Layouts

### Default Layout:

The Default Layout can be found at `layouts\DefaultLayout.js`

The Default Layout is used to render all standard pages containing the Header and Footer components. Attached to the Default Layout are the Vercel Analytics and Speed Insights scripts which allow for visibility on the frontend performance in the Vercel Dashboard. In addition, we are also tracking website activity with Google Analytics which is attached to the Default Layout pages.

## Context

### Global Context:

The Global Context can be found at `context\GlobalContext.js`

The Global Context is used to pull, update, and store variable global state of the application such as the user state.

The user state is verified on the load of the application by checking for a user JWT token stored in the client browser and, if it's not expired, calling our backend for the user object. The user object is updated with its fields and available globally to the application in-memory by wrapping `/_app.js` in the InvestantUserAuthProvider.

``` javascript
useEffect(() => {
  // On application load, we should check if the user has a non-expired JWT and fetch user object if so
  const verifyUserOnLoad = async () => {
    const session = localStorage.getItem('investantUserSession');
    if (!session) {clearInvestantUser(); return;}

    try {
      // If the token is expired, clear the user and return
      const decodedToken = jwtDecode(session);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {clearInvestantUser(); return;}

      const response = await fetch(`${STRAPIurl}/api/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {clearInvestantUser(); return;}
      
      const data = await response.json();
      updateInvestantUser({
        userJWT: session,
        username: data.username,
        userEmail: data.email,
        userSubscriptions: {
          blogPostSubscription: data.blogPostSubscription
        },
        userSignedIn: true
      });
    } catch (error) {clearInvestantUser(); return;}
  }; verifyUserOnLoad();
}, []);
```