# Self-hosting `Plausible Analytics`

- [Self-hosting `Plausible Analytics`](#self-hosting-plausible-analytics)
- [Why? 🤷‍](#why-)
- [What? 💭](#what-)
- [Who? 👤](#who-)
- [How? 👩‍💻](#how-)
  - [Pre-requisites](#pre-requisites)
  - [0. Quickstart](#0-quickstart)
  - [0.2 A preface](#02-a-preface)
  - [1. Getting `Plausible CE` running on your `localhost`](#1-getting-plausible-ce-running-on-your-localhost)
    - [1.1. Configuring `plausible-conf.env`](#11-configuring-plausible-confenv)
    - [1.2 Configuring `reverse-proxy/docker-compose.caddy-gen.yml` for production](#12-configuring-reverse-proxydocker-composecaddy-genyml-for-production)
    - [1.3 Running it!](#13-running-it)
  - [2. Monitoring a simple `HTML` website](#2-monitoring-a-simple-html-website)
  - [3. (*Optional*) Monitoring a `Next.js` website](#3-optional-monitoring-a-nextjs-website)
    - [3.1 Clone the `Next.js` site](#31-clone-the-nextjs-site)
    - [3.2 Using `next-plausible` to monitor website](#32-using-next-plausible-to-monitor-website)
      - [3.2.1 Wrapping the application with `<PlausibleProvider>`](#321-wrapping-the-application-with-plausibleprovider)
      - [3.2.2 Proxying the analytics script](#322-proxying-the-analytics-script)
      - [3.2.3 Running our `Next.js` app in `HTTPS`](#323-running-our-nextjs-app-in-https)
  - [4. Exploring custom events in `Plausible`](#4-exploring-custom-events-in-plausible)
    - [4.1 Sending custom events from `Next.js`](#41-sending-custom-events-from-nextjs)
    - [4.2 Custom events insights in our self-hosted `Plausible` server](#42-custom-events-insights-in-our-self-hosted-plausible-server)
    - [4.3 Seeing custom events' props in `Plausible` dashboard](#43-seeing-custom-events-props-in-plausible-dashboard)
  - [5. Deploying to `fly.io`](#5-deploying-to-flyio)
    - [4.1 Clone the template](#41-clone-the-template)
    - [4.2 Setting up `clickhouse`](#42-setting-up-clickhouse)
    - [4.3 Setting up `plausible`](#43-setting-up-plausible)
      - [4.3.1 Creating `.env` file](#431-creating-env-file)
      - [4.3.2 Creating, migrating and initializing database](#432-creating-migrating-and-initializing-database)
  - [6. Deploying to `DigitalOcean` Droplet](#6-deploying-to-digitalocean-droplet)
    - [6.1 Create a `Droplet` instance](#61-create-a-droplet-instance)
    - [6.2 Connecting to the `Droplet` through `SSH`](#62-connecting-to-the-droplet-through-ssh)
    - [6.3 Cloning and getting `Plausible` running in our `Droplet`](#63-cloning-and-getting-plausible-running-in-our-droplet)



# Why? 🤷‍

In today's data-driven environment,
it's _crucial_ to understand how users interact with your website.
However, relying on third-party analytics services can raise concerns about data privacy, compliance with regulations like GDPR, and potential data leaks. 
Deploying `Plausible Analytics` on-premises **gives you full control over your data**,
ensuring privacy while still benefiting from actionable insights.


# What? 💭

`Plausible Analytics`: 
[plausible.io](https://plausible.io/)
is an open-source, privacy-friendly, and lightweight web analytics tool. 
`Plausible` is designed to be simple to use, yet powerful enough to provide meaningful insights without compromising user privacy.

`Plausible` provides you [two versions of their product](https://github.com/plausible/analytics#can-plausible-be-self-hosted):
- `Plausible Analytics Cloud`,
their cloud-hosting solution that is *paid*.
Since it's an [IaaS](https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/what-is-iaas),
most of the heavy lifting is done for you,
and it's quick to set up.
- `Plausible Community Edition`, their open-source.
self-hosting solution.
We have to do it all ourselves: setting up a server,
and managing it.
Updates and improvements are made available twice a year.

Deploying `Plausible` on-premises ensures you maintain full ownership of your data
and avoid the privacy pitfalls associated with traditional analytics solutions.

So this is where we'll be focusing in this tutorial!


# Who? 👤

This guide is intended for developers, system administrators, and tech-savvy individuals
who want to self-host Plausible Analytics to maintain control over their website’s analytics data.
It's particularly relevant for those concerned with privacy, compliance, or simply preferring to avoid third-party dependencies.


# How? 👩‍💻

## Pre-requisites

In this tutorial,
we are assuming you have [`Docker`](https://docs.docker.com/engine/install/) installed.
Additionally,
we will be using `npx` (which should be included in the `npm` install)
and [`pnpm` ](https://pnpm.io/installation)
as package manager,
since we're going to be using a simple [`Next.js`](https://nextjs.org/) application to get insights from
(alongside a simpler, barebones `HTML` website).

**We assume you have basic knowledge of the aforementioned**.

We'll go over on setting up `Plausible CE`
in your `localhost` and seeing insights
with a website running on `localhost` as well.
We'll later focus on getting our self-hosted `Plausible` instance
deployed in `fly.io`,
so make sure you have [`flyctl` installed](https://fly.io/docs/flyctl/install/).

Ready to go fast?

Don't worry,
it's actually simple!

Let's go! 🏃

> [!NOTE]
>
> This tutorial will attempt you to provide a way
> to get up and running with `Plausible CE` as fast as possible.
> Some details may be omitted,
> so we highly recommend you check out the [official docs](https://github.com/plausible/community-edition/#install)
> if you want more detailed explanation.


## 0. Quickstart

Do you want to just see it running?
We got you covered!

1. Follow sections [1. Getting `Plausible CE` running on your `localhost`](#1-getting-plausible-ce-running-on-your-localhost)
and [1.1. Configuring `plausible-conf.env`](#11-configuring-plausible-confenv)
to download `Plausible CE` and having it running on your `localhost`.
It's really fast, don't worry!
After cloning and setting up the env variables,
run `docker compose -f docker-compose.yml -f reverse-proxy/docker-compose.caddy-gen.yml up -d` in your terminal.
Follow through the instructions in the screen
(see [1.3 Running it!](#13-running-it) for more detail).
**Make sure you set the `domain` of the site to `localhost`**
when following through the wizard.

2. Go to the `next_website` folder,
and run `pnpm run install` and `sudo pnpm run dev`.
This will run the sample website.
To see the insights in `Plausible`,
you need to have it running in a terminal,
and the `Next.js` website in another:
**`Plausible` is running in `http://localhost:8000`**
and **the website is running in `https://localhost:3000`**.
If you interact with the website and navigate around the pages,
you will see the dashboard displaying insights.

   - Alternatively,
you can run the `simple_website.html` file
for a simpler website version,
without having to use `Next.js`.
Simply run `npx http-server --cors` inside the `plausible` folder
to serve the `HTML` file
and navigate to `http://localhost:8080/simple_website.html`
in your browser.

And that's it! 😊

Do you want to follow through the tutorial more in-depth?
Keep on reading!


## 0.2 A preface

When reading this document, be aware that `Plausible` has three different components:
- the `Plausible` service, which is a web application.
- a `PostgreSQL` database that saves user and general data.
- a `Clickhouse` database that saves event data generated by website traffic.

Throughout this guide,
you will see all of these three mentioned.
So keep that in mind! 🙂


## 1. Getting `Plausible CE` running on your `localhost`

Let's start with `Plausible` before going over to a sample `Next.js` application.

First, clone https://github.com/plausible/community-edition.
It's everything you need to start our own `Plausible CE` server.

```sh
git clone https://github.com/plausible/community-edition
```

If you peruse over the cloned folder,
you'll notice two files at root level.
- `docker-compose.yml`, which orchestrates the services that make up the `Plausible Analytics` platform.
These include the server and the databases.
- `plausible-conf.env`, which configures the server.
You can check all the options [in the docs](https://github.com/plausible/community-edition/#configure),
but we'll focus on minimal changes to get started ASAP.

If you're *opting out* of reverse proxy and `HTTPS`,
you'd need to adjust `docker-compose.yml`,
and change the service configuration to ensure it's not limited only to `localhost`.
However,
we do not need/want to do this,
both for heightened security and to keep this tutorial simpler.


### 1.1. Configuring `plausible-conf.env`

Let's start with `plausible-conf.env`.

```sh
BASE_URL=replace-me
SECRET_KEY_BASE=replace-me
TOTP_VAULT_KEY=replace-me
```

To generate `SECRET_KEY_BASE`
(which configures the secret used for sessions in the dashboards),
we'll generate a key using [``](https://www.openssl.org/).
OpenSSL
```sh
openssl rand -base64 48
```

> [!IMPORTANT]
> Don't share these credentials with anyone.
> Keep it safe.

Copy and paste the value into the `.env` file.

To generate `TOPT_VAULT_KEY`,
which is used to encrypt [TOTP](https://en.wikipedia.org/wiki/Time-based_one-time_password) secrets,
we'll also generate a key using `OpenSSL`.

```sh
openssl rand -base64 32
```

> [!IMPORTANT]
> Don't share these credentials with anyone.
> Keep it safe.

Copy and paste the value into the `.env` file.

Now, the last key we need to change, is `BASE_URL`.
In normal circumstances,
this would be the domain where you'd host the server.
Because we're doing everything to run on `localhost` for demonstration purposes,
let's change it to our `http://localhost:8000`.

Here is how our `plausible-conf.env` should look like.

```sh
BASE_URL=http://localhost:8000
SECRET_KEY_BASE=bCjZ6M2MPIwIVq+Zd5UBlGaIHyXQzbrQuPGYJB5kbvofLm0sbz1mx6cojCYCVeZU
TOTP_VAULT_KEY=sMAJ3mdbLDj0WzFIqlhsWNSFcnNpgt8aRJLgfN+w/NQ=
```

> [!NOTE]
>
> These key values are for illustration purposes,
> therefore they're not valid.
> We reiterate, do not share these publicly or push it version control!


### 1.2 Configuring `reverse-proxy/docker-compose.caddy-gen.yml` for production

> [!NOTE]
> This section is *optional*.
> You don't need to configure this if you're going to run **only on `localhost`**.

Now that our `Plausible` server is configured,
let's shift our focus to our [reverse proxy](https://www.cloudflare.com/en-gb/learning/cdn/glossary/reverse-proxy/) service.

`Plausible` uses [**`Caddy`**](https://caddyserver.com/docs/quick-starts/reverse-proxy)
as a reverse proxy.
`Caddy` will help us issue [`TLS` certificates](https://www.digicert.com/tls-ssl/tls-ssl-certificates)
so our website to run in `HTTPS` and properly communicate with our base URL.

While this is not needed for out example (since we're running on `localhost`),
it's important enough to know how to configure this service
so you can use it in production.

> [!NOTE]
>
> If you're using this in production, and not in `localhost`,
> this is where you'd point the domain's `DNS` records
> to the IP address of the instance.
> This is needed for `Caddy` to issue `TLS` certificates.

Now we need to let `Caddy` know the domain name
for which to issue the `TLS` certificate and the service to redirect the requests to.
To do this,
head over to `reverse-proxy/docker-compose.caddy-gen.yml`
and change `virtual.host` and `virtual.tls-email`.

```yml
  plausible:
    labels:
      virtual.host: "plausible.example.com"                   # change to your domain name
      virtual.port: "8000"
      virtual.tls-email: "admin@plausible.example.com" # change to your email
```

And now you can simply change your `plausible-conf.env`
with the `BASE_URL` as `HTTPS`
(say adiós to `HTTP` drama! 👋).

```sh
BASE_URL=https://plausible.example.com
SECRET_KEY_BASE=bCjZ6M2MPIwIVq+Zd5UBlGaIHyXQzbrQuPGYJB5kbvofLm0sbz1mx6cojCYCVeZU
TOTP_VAULT_KEY=sMAJ3mdbLDj0WzFIqlhsWNSFcnNpgt8aRJLgfN+w/NQ=
```

### 1.3 Running it!

Wasn't that easy!
It's *even easier* to run it!
Go to your terminal and type:

```sh
docker compose -f docker-compose.yml -f reverse-proxy/docker-compose.caddy-gen.yml up -d
```

You should see your terminal downloading and installing
the needed images to run the `Docker` container.

```sh
[+] Running 19/19
 ✔ plausible_db 9 layers [⣿⣿⣿⣿⣿⣿⣿]          Pulled
 ✔ plausible_events_db 7 layers [⣿⣿⣿⣿⣿⣿⣿]   Pulled
 ✔ plausible 7 layers [⣿⣿⣿⣿⣿⣿⣿]             Pulled
 ✔ caddy-gen 8 layers [⣿⣿⣿⣿⣿⣿⣿⣿]            Pulled
[+] Running 5/5
 ✔ Network hosting_default                  Created
 ✔ Container hosting-plausible_db-1         Started
 ✔ Container hosting-plausible_events_db-1  Started
 ✔ Container hosting-plausible-1            Started
 ✔ Container caddy-gen                      Started
```

Wait for the command to run successfully.
In the first time, it will take longer
because it's downloading the needed images to execute the services
and setting up the `PostgreSQL` and `ClickHouse` databases.

After that's done,
head over to `http://localhost:8000`.

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/69499cdf-57a9-4197-8ef7-60e91874459e">
</p>

Congratulations! 🎉
You've `Plausible CE` up and running!
Now it's ready to get some juicy insights! 📈

Click on `Register` and fill out the form.
You can use a test e-mail,
since all the info is being saved into your computer.

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/85a84ba1-42ca-4184-a6f9-2c7de7bd5bc3">
</p>

Next up, we'll be asked to add a website we want to monitor.
As aforementioned,
we're going to be tracking a `Next.js` site running on `localhost`.
So, let's add it to the `domain` field.

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/d2a28e4a-b705-4297-915d-6654b3a0a63c">
</p>

After that,
you should be done! 👏


<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/d67d93b2-0cd6-4a77-bf80-edd3d8d0c036">
</p>

You'll be prompted a screen suggesting you
how to add the `Plausible` script to your website
so your self-hosted `Plausible` server can get its data.

Click on `Start collecting data`.
You will be redirected to the next page.

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/2d71f564-5165-42cb-b651-d548a99e55a5">
</p>

As you can see, `Plausible` is waiting for anyone
to visit the page on `localhost` to display insights.

As of now, we have no website running on our `localhost`.
So let's fix that!


## 2. Monitoring a simple `HTML` website

Let's monitor a simple website made of just a few lines of `HTML`.
Create a file called `simple_website.html`

```html
<!doctype html>
<html>
  <head>
    <title>A simple site to test Plausible Analytics</title>
  </head>
  <body>
    <p>Just a simple HTML page to test if Plausible Analytics is working. Great for testing!</p>
  </body>
</html>
```

To start tracking this website,
all we need to do is follow the instructions that `Plausible` gave us
after finishing adding the website to the `Plausible CE` server -
**adding the analytics script**.

Change it to the following.

```html
<!doctype html>
<html>
  <head>
    <title>A simple site to test Plausible Analytics</title>
    <script defer data-domain="localhost" src="http://localhost:8000/js/script.local.js"></script>
  </head>
  <body>
    <p>Just a simple HTML page to test if Plausible Analytics is working. Great for testing!</p>
  </body>
</html>
```

`Plausible` offers different analytics scripts for different scenarios.
You can check an overview in https://plausible.io/docs/script-extensions#all-our-script-extensions.
In this case,
because we're running only on `localhost`,
we'll use the **`script.local.js`** script.

Now, we can *serve* the `HTML` file
by running `npx http-server --cors`
and navigating to `http://localhost:8080/simple_website.html` in the browser.

> [!IMPORTANT]
>
> Make sure you have `Plausible CE` running in another terminal
> to record the events our simple website is sending to it.

If you visit `http://localhost:8000/localhost`
(which is where our `Plausible CE` server is being executed),
you will see that it recorded the site's very first page view!

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/677e1de1-11c9-4525-a155-0f9de59f019b">
</p>

Awesome! 🎉
This means we've correctly integrated `Plausible` in our simple site!


## 3. (*Optional*) Monitoring a `Next.js` website

> [!NOTE]
>
> This section *is optional*,
> as it will be focussing on setting up integration
> in a `Next.js` app.
>
> To learn more about custom events,
> feel free to skip to [4. Exploring custom events in `Plausible`](#4-exploring-custom-events-in-plausible).

Now that we've our neat `Plausible CE` server instance
running on our `http://localhost:8000`,
it's time for us to monitor our site!

We're going to be using `Next.js` to quickly get a simple website running
and monitor it accordingly!
We'll be using a template website to get going quicker,
since gathering website analytics is *the focus of this tutorial*,
not developing the site itself.

With this in mind,
we'll use the [*Portfolio Starter Kit* ](https://vercel.com/templates/next.js/portfolio-starter-kit) template,
run it on our `localhost`
and monitor it!


### 3.1 Clone the `Next.js` site

Let's clone the website.
Run the following command:

```sh
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/blog blog
```

After executing this command,
you will see that a folder called `blog` has been created,
with the following output in the terminal.

```sh
.../19144357ea5-146e                     |   +1 +
.../19144357ea5-146e                     | Progress: resolved 1, reused 0, downloaded 1, added 1, done
Creating a new Next.js app in /Users/lucho/Documents/dwyl/learn-analytics/plausible/website/blog.

Downloading files from repo https://github.com/vercel/examples/tree/main/solutions/blog. This might take a moment.

Installing packages. This might take a couple of minutes.

Lockfile is up to date, resolution step is skipped
Packages: +168
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Downloading typescript@5.3.3: 5.76 MB/5.76 MB, done
Downloading next@14.2.0-canary.62: 20.57 MB/20.57 MB, done
Downloading @next/swc-darwin-arm64@14.2.0-canary.62: 36.90 MB/36.90 MB, done
Progress: resolved 168, reused 139, downloaded 29, added 168, done
node_modules/.pnpm/@vercel+speed-insights@1.0.9_next@14.2.0-canary.62_react@18.2.0/node_modules/@vercel/speed-insights: Running postinstall script, done in 40ms

dependencies:
+ @tailwindcss/postcss 4.0.0-alpha.13
+ @types/node 20.11.17
+ @types/react 18.2.55
+ @types/react-dom 18.2.19
+ @vercel/analytics 1.1.3
+ @vercel/speed-insights 1.0.9
+ geist 1.2.2
+ next 14.2.0-canary.62
+ next-mdx-remote 4.4.1
+ postcss 8.4.35
+ react 18.2.0
+ react-dom 18.2.0
+ sugar-high 0.6.0
+ tailwindcss 4.0.0-alpha.13
+ typescript 5.3.3

Done in 11.7s

Success! Created blog at /Users/lucho/Documents/dwyl/learn-analytics/plausible/website/blog
Inside that directory, you can run several commands:

  pnpm run dev
    Starts the development server.

  pnpm run build
    Builds the app for production.

  pnpm start
    Runs the built app in production mode.

We suggest that you begin by typing:

  cd blog
  pnpm run dev
```

Navigate into the folder (`cd blog`)
and run `pnpm run dev` to see if it works properly.

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/08dcbd0e-4449-4a18-9df3-532cd33be653">
</p>

It seems to be working properly!
Awesome! 🌈


### 3.2 Using `next-plausible` to monitor website

`Plausible` suggests you to add a `<script>` to the `<head>` of your site,
which fetches the script used to send events to the `Plausible` server
to gather insights.

However, because we're using `Next.js` in our website
*and* we're self-hosting,
we'll be doing things a bit differently.

To this effect,
we'll install https://github.com/4lejandrito/next-plausible
to integrate our site to our `Plausible` server.

Let's install it.
In the root of your project,
run the following command:

```sh
pnpm add next-plausible
```

Now, it's time to set it up!


#### 3.2.1 Wrapping the application with `<PlausibleProvider>`

First, we need to wrap the whole `Next.js` application
with `<PlausibleProvider>`.
Head over to `app/layout.tsx`,
abd add the following line to the `RootLayout` function,
above `<body>`.

```tsx
import PlausibleProvider from 'next-plausible'

// ...


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      {/* Add the following `<head>` lines */}
      <head>
        <PlausibleProvider domain="localhost" selfHosted trackLocalhost enabled />
      </head>
      <body className="antialiased max-w-xl mx-4 mt-8 lg:mx-auto">
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
          <Navbar />
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  )
}
```

> [!NOTE]
>
> We're using the [App Router](https://nextjs.org/docs/app) in our site.
> You may be using the [`Pages Router`](https://nextjs.org/docs/pages).
> If that's the case,
> you wrap your application in `pages/_app.js`:
> 
> ```js
> // pages/_app.js
> import PlausibleProvider from 'next-plausible'
> 
> export default function MyApp({ Component, pageProps }) {
>   return (
>     <PlausibleProvider domain="example.com">
>       <Component {...pageProps} />
>     </PlausibleProvider>
>   )
> }
> ```
>
> This method can also be used for specific components/pages
> that you want to track individually.

Let's break down the properties we've used in `<PlausibleProvider>`.

- **`domain`** is the domain of the site we want to monitor.
It should be the same name of the site we've defined
when we set up our `Plausible` server.
See [1.3 Running it!](#13-running-it) for context.

- **`selfHosted`** has to be set to `true` if we're self-hosting `Plausible`.
Otherwise, we'll get a `404` when the website we're monitoring
requests the analytics script.

> [!NOTE]
> The analytics script is what the website that is being monitored
> fetches from the `Plausible` server
> and allows the communication between both.
> This exchange of events is what enables `Plausible` to show insights.

- **`enabled`** decides whether to download/render the analytics script.
Normally, this only works in production environments
(e.g. only production builds work).
However, because we're just wanting to test the integration,
we want it to work when running `pnpm run dev`
(dev environment).

- **`trackLocalhost`** enables `localhost` tracking
(it's turned off by default).

To run on `localhost`, these will suffice,
You can check the rest of the possible props
in https://github.com/4lejandrito/next-plausible#plausibleprovider-props.


#### 3.2.2 Proxying the analytics script

To avoid being blocked by adblockers,
[`Plausible` recommends proxying the analytics script.](https://plausible.io/docs/proxy/introduction).
This is because many adblockers block analytics domain
(which include Google Analytics)
to maintain user's privacy.

Proxying the analytics script is important
if you don't want to miss data from people that use adblockers.
However,
because we're self-hosting,
the probability of the domain that's hosting our `Plausible CE` instance
to be in the adblockers blacklist is quite minimal
(see https://github.com/plausible/analytics/issues/158 for more information).

*However*,
we'll proxy it just to be sure 😉.

Luckily for this,
`next-plausible` provides a plugin
that proxies our `Next.js` application,
we just need to sprinkle it with some configuration.

Inside the root of the project,
create a [`next.config.js`](https://nextjs.org/docs/app/api-reference/next-config-js) file.

```js
// @ts-check

const { withPlausibleProxy } = require('next-plausible')

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

module.exports = withPlausibleProxy({customDomain: "http://localhost:8000"})(nextConfig)
```

As you can see,
we've defined a **`customDomain`** field
in the `withPlausibleProxy()` plugin.
**`customDomain`** is the domain
that *will serve the analytics script*.
If we were using the cloud solution,
we could have used the default value (which points to https://plausible.io/).
But because *we're self-hosting*,
we need to add the domain where our `Plausible` server is hosted.
In our case, that's `http://localhost:8000`,
the value we've defined in [1.1. Configuring `plausible-conf.env`](#11-configuring-plausible-confenv).


#### 3.2.3 Running our `Next.js` app in `HTTPS`

When you were adding the website to monitor
in the `Plausible CE` dashboard in section [1.3 Running it!](#13-running-it),
you may have noticed that they only support `HTTPS` domains.

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/178a9f40-14d4-4be4-afe6-f1f569760a00">
</p>

Because our `Next.js` runs in `HTTP` in development mode,
that poses a problem.
Sure, we could build our website and serve it under a reverse proxy with `Docker`.
But that's out of scope for this tutorial.
So, in the spirits of [KISS](https://en.wikipedia.org/wiki/KISS_principle),
we can leverage an experimental flag when running our `pnpm run dev` script
in `package.json`.

As per https://vercel.com/guides/access-nextjs-localhost-https-certificate-self-signed,
we can change our `"dev"` script inside our `package.json`,
like so:

```json
  "scripts": {
    "dev": "next dev --experimental-https",     // add the flag here
    "build": "next build",
    "start": "next start"
  },
```

We've added the `--experimental-https` flag
so `Next.js` self-signs our website
so we can run it under `https://localhost:3000`,
instead of `http`.

Do notice that
you **need to run `pnpm run dev` with the `sudo` command** from now on,
like such:

```sh
sudo pnpm run dev
```

Otherwise, `Next.js` won't be able to generate self-signed certificates
so our website is served under `HTTPS`.

> [!NOTE]
>
> If you're on `MacOS`,
> you will be prompted to input your password
> so `Next.js` can generate the certificates properly.
> 
> <p align="center">
>     <img width="300" src="https://github.com/user-attachments/assets/240a6136-3d89-44a2-8333-b0acd20308c0">
> </p>

Now, if you open `https://localhost:3000`
and navigate through the website,
you'll find that our `Plausible CE` server
is fetching information and displaying it correctly!
You can check it at `http://localhost:8000`.


<p align="center">
  <img width="45%" src="https://github.com/user-attachments/assets/82519902-aae7-4620-bab6-c780af4576ef">
  <img width="45%" src="https://github.com/user-attachments/assets/ac3e0530-7891-43e9-b478-2e05ee855d5b">
</p>

As you can see,
the paths we've visited in our `Next.js` website
are being correctly displayed in our `Plausible` dashboard.

Ain't that cool? 🎉

We can verify that it is working if we check our browser console.
If you click on `Network`,
you'll see that our analytics script is being correctly downloaded
from our self-hosted `Plausible CE` server
and we're sending a `pageview` event to it!

<p align="center">
  <img width="45%" src="https://github.com/user-attachments/assets/395e449f-e4f8-4c1b-bd13-a06c076af82f">
  <img width="45%" src="https://github.com/user-attachments/assets/1b563df2-8614-4be7-aa95-b7b1ffcfc9ca">
</p>


## 4. Exploring custom events in `Plausible`

We're already gaining awesome insights!
But we can go a little further.


### 4.1 Sending custom events from `Next.js`

Let's shallowly explore what we can do with `Plausible`!
With `next-plausible`,
we have very fine control of what we can send over to our `Plausible` analytics server!

One feature that is a perfect example of this are **custom events**.
Let's send a custom event from our website to our `Plausible CE` server!

Head over to `app/components/nav.tsx`
and change it like so:

```tsx
'use client'

import Link from "next/link";
import { usePlausible } from 'next-plausible'

const navItems = {
  "/": {
    name: "home",
  },
  "/blog": {
    name: "blog",
  },
  "https://vercel.com/templates/next.js/portfolio-starter-kit": {
    name: "deploy",
  },
};

export function Navbar() {
  const plausible = usePlausible()

  function handleClick() {
    plausible("customEventName", {
      props: {
        buttonId: "foo",
      },
    })
  }

  return (
    <aside className="-ml-[8px] mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav className="flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative" id="nav">
          <div className="flex flex-row space-x-0 pr-10">
            {Object.entries(navItems).map(([path, { name }]) => {
              return (
                <Link
                  key={path}
                  href={path}
                  className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1"
                >
                  {name}
                </Link>
              );
            })}
          </div>
          <button
            id="foo"
            onClick={handleClick}
          >
            Send event to Plausible!
          </button>
        </nav>
      </div>
    </aside>
  );
}
```

Let's break down our changes:

- we've added the [`'use client'` directive](https://nextjs.org/docs/app/building-your-application/rendering/client-components#using-client-components-in-nextjs) to the top of the file.
This is because we're adding interactivity to this page
by invoking an event handler when clicking a button.
- added the [`usePlausible()` hook](https://github.com/4lejandrito/next-plausible#send-custom-events) from `next-plausible`.
This hook will allow us to send custom events.
- the `handleClick()` function is invoked every time the button is clicked.
In here, we make use of the object returned by `usePlausible()`
to send a **custom event with props**.
This custom even is called `"customEventName"`.
- added a `<button>` inside `Navbar` which,
when clicked, invokes `handleClick()`.

That's it!
If we run our application again
(`sudo pnpm run dev`),
and click the button with the browser dev tools open...

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/478198c2-a348-4ef7-9f84-80530f5964f8">
</p>


...we'll see our event being sent to the `Plausible` server!

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/26775161-c6e1-40a3-8776-b31158e1fab5">
</p>

Great job! 🥳

Let's see what's on the other side 👀.


### 4.2 Custom events insights in our self-hosted `Plausible` server

Our `Plausible` server is receiving these events.
However, how do we see them?

If you scroll to the bottom of the page,
you'll see a **`Goal Conversions`** section,
where we can define *goals* depending on custom events we've defined.
Click on `Set up goals ->`.

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/02f60e33-1760-481a-a1e2-66ce9dd002d6">
</p>

Let's add a goal by clicking `+ Add Goal`
and adding the name of the same event
that we've defined in our `Next.js` site.
You'll inclusively see that `Plausible` displays some text
stating that it already found custom events being sent,
so we know we're on the right track!

<p align="center">
  <img width="45%" src="https://github.com/user-attachments/assets/7656bafe-69f0-40a8-be84-5c04604f6e31">
  <img width="45%" src="https://github.com/user-attachments/assets/0879a560-d140-4a9e-b004-df87bce3ef88">
</p>

After adding the goal,
navigate back to the dashboard
and you'll see that it's correctly tracking this newly added custom event!

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/8293270d-7de4-48d3-bb45-842e41d67844">
</p>

Boom, baby! 😎
This opens a whole new world of possibilities
of what we can track in our website.

But wait ✋!
We ain't done yet 😉!


### 4.3 Seeing custom events' props in `Plausible` dashboard

Remember when we sent the `customEventName` with props
in [3.1 Sending custom events from `Next.js`](#31-sending-custom-events-from-nextjs)?
These props can also be shown in the dashboard
to analyze stats that aren't automatically tracked by `Plausible`.

Therefore,
this is *an additional way of tracking the behaviour of people using our site*.
And we can define custom metrics with these props
and track it accordingly!

For this, click on the `Properties` tab in the `Goals` section.

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/0141abf3-e520-437d-8e62-9a6b1c28bc2a">
</p>

Click on `Set up props ->`.

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/39290aed-5e04-4448-a993-16bd9b8fa16e">
</p>

Click on `+ Add Property`.
This will be the same property that we were sending with the custom event
we've defined earlier.

When you open it,
you will be shown a combo list.
You will be able to choose `buttonId`,
the prop we've sent with the custom event.
Yet again,
you will see that `Plausible` detected this new prop automatically.

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/6bae7032-2c89-4633-a40a-dae40ccdda4f">
</p>

Click on `Add Property`.
This property has now been successfully added.

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/1e2e7ecc-e71c-456f-a19d-88f328dfb3e0">
</p>

Now, if we head back to the main dashboard of our website,
you will see that we can now choose the propertie(s) to show in the dashboard.
Choose `buttonId`,
and you'll see it displayed in all its glory!

<p align="center">
  <img width="45%" src="https://github.com/user-attachments/assets/380777d8-cb10-4504-916e-e74aa21f5e92">
  <img width="45%" src="https://github.com/user-attachments/assets/861e5748-5879-44fb-bc46-fbe9f7f0874d">
</p>

`"foo"` is the value of the prop we've passed.

With this,
you can cover many use cases
and gain a myriad of insights on how people
are interacting with your website,
their journey
and what you need to focus on to increase engagement.

The possibilities are endless! ✨


## 5. Deploying to `fly.io`

> [!IMPORTANT]
>
> We didn't quite get this to work on `fly.io`,
> because the `Plausible` app was not able to connect properly to the `PostgreSQL` database.
> We are still keeping this section in case we can make it work
> or/and to provide you more insights on the process.
>
> The process is based off the following resources:
> - https://iagocavalcante.com/articles/how-to-deploy-plausible-analytics-at-fly-io
> - https://blog.liallen.me/self-host-plausible-with-fly
>
> Our files are more up-to-date than the ones used in the aforementioned resources
> but the process is the same.
> Check the following links for more context on what's happening
> (they may have new information after the time of writing):
> - https://github.com/plausible/analytics/issues/2900
> - https://github.com/plausible/analytics/issues/405
> - https://github.com/plausible/analytics/discussions/1336
> - https://github.com/plausible/analytics/discussions/4268
> - https://github.com/plausible/analytics/discussions/4232
> - https://github.com/plausible/analytics/discussions/3729
> - https://github.com/plausible/analytics/discussions/3070
> - https://github.com/plausible/analytics/discussions/1192

We've everything working on `localhost`.

But `Plausible CE` shines when it's published
somewhere that's *publicly accessible*.

In this section,
we'll be focusing on deploying our self-hosted `Plausible CE` instance
to [`fly.io`](https://fly.io/).


If this is your first time using `fly.io`,
we *highly recommend* you read
their [`Fly.io Essentials`](https://fly.io/docs/getting-started/essentials/) docs.


### 4.1 Clone the template

We'll use https://github.com/intever/plausible-hosting
to kickstart the process of publishing to `fly.io`.

Let's clone it.

```sh
git clone https://github.com/intever/plausible-hosting.git flyio_deploy
```

You should see a folder called `flyio_deploy` in your computer now.
If you navigate into it,
you should notice that we've a folder dedicated
to `clickhouse` and another for `plausible`.

Let's start with the former.
Before starting, though,
you need to [create an organization in `fly.io`](https://fly.io/docs/flyctl/orgs/).


### 4.2 Setting up `clickhouse`

Navigate to the `clickhouse` folder
(`cd clickhouse`).
We'll create our fly app by running the following command:

```sh
fly launch --no-deploy --org <ORG_NAME>
```

Follow the instructions.
We'll be calling this app
**"plausible-ce-clickhouse"**.

After confirming the changes,
let's create a volume to persist files
([fly machines are ephemeral](https://community.fly.io/t/ephemeral-fly-machine/6965)).
Run the following command:

```sh
fly volumes create plausible_clickhouse_data --region mad --size 1

Warning! Every volume is pinned to a specific physical host. You should create two or more volumes per application to avoid downtime. Learn more at https://fly.io/docs/volumes/overview/
? Do you still want to use the volumes feature? Yes
                  ID: vol_XXXXXXXXXXXXXXXXX
                Name: plausible_clickhouse_data
                 App: plausible-ce-clickhouse
              Region: mad
                Zone: e024
             Size GB: 1
           Encrypted: true
          Created at: 12 Aug 24 12:00 UTC
  Snapshot retention: 5
 Scheduled snapshots: true
```

After creating the volume successfully,
we can now deploy our `Clickhouse` app!
Simply run:

```sh
fly deploy
```

And we're done with `Clickhouse`!


### 4.3 Setting up `plausible`

Now let's head over to the `Plausible` folder.

```sh
cd ../plausible
```

We're going to follow the same steps,
as we've previously done with `clickhouse`.
First, launch the app with `fly`.

```sh
fly launch --no-deploy --org <ORG_NAME>
```

Follow the prompts.
When prompted with
`? Do you want to tweak these settings before proceeding?`,
type `Y`.
This will open a browser.
Scroll down to the Database section, and set it to the following settings.

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/ae651b7a-2ef3-49e4-a396-05b2a8ae33bb">
</p>

At the end,
save the changes.
- our `PostgreSQL` database is called **`"plausible-ce-db"`**.
- our app name is called **`"plausible-ce-app"`**.

After saving,
`fly.io` will start provisioning machines for the `PostgreSQL` database.
After this,
it will give you a `DATABASE_URL` secret,
which is added to the app we're deploying.

```sh
Waiting for launch data... Done
Created app 'plausible-ce-app' in organization 'dwyl-atm'
Admin URL: https://fly.io/apps/plausible-ce-app
Hostname: plausible-ce-app.fly.dev
Creating postgres cluster in organization dwyl-atm
Creating app...
Setting secrets on app plausible-ce-db...
Provisioning 1 of 1 machines with image flyio/postgres-flex:16.3@sha256:30a323ca2e2c0fa12b241d9be2fa5603bf2033e371c59f0e2a6176637ff0c4d0
Waiting for machine to start...
Machine 17815deefe14e8 is created
==> Monitoring health checks
  Waiting for 17815deefe14e8 to become healthy (started, 3/3)

Postgres cluster plausible-ce-db created
  Username:    postgres
  Password:    password
  Hostname:    plausible-ce-db.internal
  Flycast:     fdaa:2:792f:0:1::3
  Proxy port:  5432
  Postgres port:  5433
  Connection string: postgres://postgres:twJ3Q7r6gWDIMFy@plausible-ce-db.flycast:5432

Save your credentials in a secure place -- you won't be able to see them again!

Connect to postgres
Any app within the dwyl-atm organization can connect to this Postgres using the above connection string

Now that you've set up Postgres, here's what you need to understand: https://fly.io/docs/postgres/getting-started/what-you-should-know/
Checking for existing attachments
Registering attachment
Creating database
Creating user

Postgres cluster plausible-ce-db is now attached to plausible-ce-app
The following secret was added to plausible-ce-app:
  DATABASE_URL=<DATABASE_URL>
Postgres cluster plausible-ce-db is now attached to plausible-ce-app
Wrote config file fly.toml
Validating /Users/lucho/Documents/dwyl/learn-analytics/plausible/flyio_deploy/plausible/fly.toml
✓ Configuration is valid
Your app is ready! Deploy with `flyctl deploy`
```

You'll see that the `fly.toml` has been updated
with the settings you've defined.
Open it and change the `CLICKHOUSE_DATABASE_URL`
to the URL we've deployed in the previous section
[4.2 Setting up `clickhouse`](#42-setting-up-clickhouse).
Like so:

```sh
[env]
  CLICKHOUSE_DATABASE_URL = 'http://plausible-ce-clickhouse.internal:8123/plausible_dev'
```

#### 4.3.1 Creating `.env` file

Let's create an `.env` file
with the configuration needed to start up our `Plausible` instance.
This the same configuration discussed in [1.1. Configuring `plausible-conf.env`](#11-configuring-plausible-confenv).

In the same folder (inside `plausible`),
create a file called `.env`:

```sh
SECRET_KEY_BASE=your_secret_key
ADMIN_USER_NAME=Your_Name
ADMIN_USER_EMAIL=your_email@example.com
ADMIN_USER_PWD=generated_password
BASE_URL=https://yourdomain.com
DISABLE_REGISTRATION=true
```

Fill the values accordingly.
We are leaving [`DISABLE_REGISTRATION`](https://github.com/plausible/community-edition#registration)
as `invite_only` so it restricts registration of new people to us.
The `BASE_URL` can be pointed to the domain
of the `fly.io` machine that is being deployed.
You can find it in your organization dashboard,
and clicking on the app name.

*We are going to use this `.env` file to set the secrets in our `fly.io` app.*
Let's set these secrets now.

```sh
fly secrets import < .env
Secrets are staged for the first deployment
```

#### 4.3.2 Creating, migrating and initializing database

We're super close to deploying our `Plausible CE` service
with a `PostgreSQL`!
We need to make *one final change* to our `fly.toml`
(inside `/plausible`).
Change the `release_command` from `db migrate` to **`db createdb`**.

```toml
[deploy]
  release_command = 'db createdb'
```

Now we can finally deploy!

```sh
fly deploy
```

> [!NOTE]
>
> Your release command may not succeed at first.
> This is probably because your `clickhouse` app is not running.
> Wake it up before deploying by visiting its URL.
>
> Another alternative is making sure that the `clickhouse` app is always running.
> Because `plausible` needs both the `PostgreSQL` and `Clickhouse` apps to be running,
> you can go to the `clickhouse/fly.toml` file and make sure that a machine is always on
> by changing the `[http_service]` section.
>
> ```toml
> auto_stop_machines = 'off'
> auto_start_machines = true
> min_machines_running = 1
> ```
>
> Because we only have 3 apps in the lowest tier,
> this should be free.
> However, check https://fly.io/docs/about/pricing/#free-allowances for more information about pricing.

The release command may succeed, but the machine might not be healthy.
This is where we change the `release_command` from `db createdb` to **`db migrate`**.

Deploy again.

```sh
fly deploy
```

Finally, change the `release_command` from `db migrate` to **`db init-admin`**.

Deploy again.

```sh
fly deploy
```

And that's it!
Revert the `release_command` to `db migrate` and leave it as it is.

> [!IMPORTANT]
>
> The sequence of commands that should be executed should be:
> **`db createdb`** -> **`db migrate`** -> **`db init-admin`**.

And that's it!
If you visit the `Plausible` app that we've just created
at `https://<app_name>.fly.dev/`
(in our case, it was https://plausible-ce-app.fly.dev/),
you will see the self-hosted `Plausible CE` in all its glory!

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/2a4f186d-d8d8-4237-95f7-08beac307202">
</p>


## 6. Deploying to `DigitalOcean` Droplet

Deploying to `DigitalOcean` is easy.
We just need to:
- boot up a [`Droplet` virtual machine](https://www.digitalocean.com/products/droplets) with `Docker` installed.
- have a domain so the `Droplet` has a hostname.
- `ssh` into the machine and `git clone` the https://github.com/plausible/community-edition
repo into it.
- follow the steps we did in [1. Getting `Plausible CE` running on your `localhost`](#1-getting-plausible-ce-running-on-your-localhost)
to get it running.

This section will be easy because, luckily,
`DigitalOcean` already provides some guides for us to do this.
So instead of re-writing their guides,
we'll guide you through the whole process
while referencing specifics to their links.

You need to have an account on `DigitalOcean`,
so make sure you create an account.

Ready to get started?
Let's go! 🏃🏻‍♀️


### 6.1 Create a `Droplet` instance

> [!TIP]
>
> Follow the guide in https://www.digitalocean.com/community/tutorials/how-to-use-the-docker-1-click-install-on-digitalocean
> to get the full process in more detail.

We first need a `Droplet` instance
to host our `Plausible` application.
We want our `Droplet` to **to have `Docker`**
so we can run the `Docker` images inside the virtual machine
(much like we did in our `localhost` before).

Go to https://marketplace.digitalocean.com/apps/docker
and click on `Create Docker Droplet`.

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/7cdd9c55-ed0b-4b6c-bf98-0dd448b6a8da">
</p>

Inside `Marketplace`, choose the `Docker on Ubuntu` image.

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/933f266e-21d0-496b-926f-4753c79f9c3e">
</p>

After clicking, you can accept some of the defaults.
However, make sure you set these changes:
- choose a datacenter region close to you.
- choose a plan.
If you want to go *lowcost*,
we recommend going as low as `1GB` of `RAM`.
This will cost you `$6` per month
(at the time of writing).
- choose an authentication method.
We recommend going with `SSH Key`, it's safer.
The process is simple, follow the steps in https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-linux-server.
This will you to access the virtual machine from your own computer easily!
- choose an identifying name.
We've named ours `"dwyl-plausible"`.

<p align="center">
  <img width="32%" src="https://github.com/user-attachments/assets/b980690a-bd6d-4415-85d1-525ca4cc7b49">
  <img width="32%" src="https://github.com/user-attachments/assets/221c358b-780d-4805-ac5b-24e5402530ec">
  <img width="32%" src="https://github.com/user-attachments/assets/320941de-032b-4de8-875f-8350c8062614">
</p>

After this, click on `Create Droplet`.
You will be redirected to your project's page
with the `Droplet` being created with a loading bar.
After it's finished,
you'll have access to the IP address other configurations of the `Droplet` you've just created.

<p align="center">
  <img width="45%" src="https://github.com/user-attachments/assets/de7b4888-6bd4-489e-b6e2-58965222157b">
  <img width="45%" src="https://github.com/user-attachments/assets/968181f1-c459-42fd-ba88-279a9ee92735">
</p>

If you hover the IP address, you can copy it to your clipboard.
This is going to be useful for the next step,


### 6.2 Connecting to the `Droplet` through `SSH`

> [!TIP]
>
> If you've never connected to a virtual machine through `SSH`
> and/or want to a more detailed guide on how to connect to the `Droplet`,
> visit https://docs.digitalocean.com/products/droplets/how-to/connect-with-ssh/

Once you've spun up your Docker Droplet,
you will need to connect to it through `SSH`.
You can do that from the command line.

Follow the link above to create an `SSH` key,
and connect to it.
Use the server IP you've copied in the previous section.

```sh
ssh root@<SERVER_IP_YOU_COPIED>
```

Alternatively,
you can connect to the virtual machine in your `Droplet` page online.
Go to the dashboard in `DigitalOcean`.

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/740b68c8-3426-4831-995b-80ef3d6fd779">
</p>

And expand the Droplet you've just created.
You will see that there's a `Console` button to the right.

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/803f4e6e-7357-41d0-b42f-32bbadbf87fa">
</p>

Click it and a terminal will be opened in a new browser window.

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/c0797c9a-eef2-4661-8fb1-182298454641">
</p>

Awesome!
We're in 👨‍💻.


### 6.3 Cloning and getting `Plausible` running in our `Droplet`

Now that you're inside your Droplet instance,
let's clone the `Plausible CE` repo!

```sh
git clone https://github.com/plausible/community-edition.git plausible
```

This will create a folder called `plausible`.
Navigate into it (`cd plausible`).

From now on, we just need to follow the same instructions
that we've done in [1. Getting `Plausible CE` running on your `localhost`](#1-getting-plausible-ce-running-on-your-localhost).
You can also [follow the quick start of the official repo](https://github.com/plausible/community-edition#quick-start)
(which are the same as we previously done, but may be more up-to-date, so it's recommended).

So, change the `plausible-conf.env`.

```sh
BASE_URL=replace-me
SECRET_KEY_BASE=replace-me
TOTP_VAULT_KEY=replace-me
DISABLE_REGISTRATION=true
```

You can check all the env variables you can add to the config
[in the official repo](https://github.com/plausible/community-edition#required).
By default, the [`DISABLE_REGISTRATION`](https://github.com/plausible/community-edition#disable_registration)
env variable (which restricts registration of new people)
is set to `true` by default.
This means that the first person to create the account after deploying
**is the only one that can login from then on**.
You can set this to `invite_only`,
so only invited people can register.

To invite other people,
check https://plausible.io/docs/users-roles.

> [!IMPORTANT]
>
> With the IP address of your Droplet,
> you need to go to your domain and add it to the DNS records.
> Here's an example done in `Cloudflare`:
>
> <p align="center">
>     <img width="700" src="https://github.com/user-attachments/assets/548f1b12-0634-4e3b-8a32-9ff50646cf6a">
> </p>
>
> See that the IP address is the same as our Droplet's.
>
> <p align="center">
>     <img width="700" src="https://github.com/user-attachments/assets/42896765-08b0-480a-8232-b6a4c5e59517">
> </p>

As you know, by default, a reverse proxy is set up for us
(we change the settings in `reverse-proxy/docker-compose.caddy-gen.yml`).
Just make sure it matches the domain you wish to deploy to
and that you set in the `BASE_URL` in `plausible-conf.env`.

After that, you can simply launch it!

```sh
docker compose -f docker-compose.yml -f reverse-proxy/docker-compose.caddy-gen.yml up -d
```

Wait for everything to set up.
You can now visit the website and you should see the registration page!

Well done! 🎉

> [!NOTE]
>
> Depending on the Droplet that you chose,
> you may have some problems with weaker ones.
> For example, if you wanted to add
> [geolocation MMDB](https://github.com/plausible/community-edition#ip-geolocation)
> to your `Plausible` instance,
> you Docker containers may have trouble starting
> (see https://github.com/plausible/analytics/discussions/3607).
>
> In these cases, check `docker compose logs`
> and see [`Plausible`'s Github Discussions](https://github.com/plausible/analytics/discussions/categories/self-hosted-support)
> to see if someone had the same issue as you.
> In the link above,
> it was because the person needed a `Droplet` with more `RAM` 😉.

> [!NOTE]
>
> If you want to access the `Plausible`, or `ClickHouse`
> or `PostgreSQL` instances in your terminal inside the `Droplet`,
> check the commands in https://github.com/plausible/community-edition#faq.





