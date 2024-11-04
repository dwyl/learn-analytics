# Exploring custom events in `Plausible` in `Next.js`

> [!IMPORTANT]
> This guide assumes you've already set up `Plausible` on your website.
> Check
> [`README.md`](./README.md#4-exploring-custom-events-in-plausible)
> for more information.
> Make sure you've set up `Plausible`
> and the integration in your `Next.js` site.

- [Exploring custom events in `Plausible` in `Next.js`](#exploring-custom-events-in-plausible-in-nextjs)
  - [4.1 Custom events - full integration](#41-custom-events---full-integration)
    - [4.1.1 Creating custom events from `Next.js`](#411-creating-custom-events-from-nextjs)
    - [4.1.2 Custom events insights in our self-hosted `Plausible` server](#412-custom-events-insights-in-our-self-hosted-plausible-server)
    - [4.1.3 Seeing custom events' props in `Plausible` dashboard](#413-seeing-custom-events-props-in-plausible-dashboard)
  - [4.2 Custom events - practical examples](#42-custom-events---practical-examples)
    - [4.2.1 Search custom event](#421-search-custom-event)
    - [4.2.2 Page scroll depth](#422-page-scroll-depth)
      - [4.2.2.1 Why use both `pages` and `app` routers together](#4221-why-use-both-pages-and-app-routers-together)
      - [4.2.2.2 Challenges with `layout.tsx` in App Router](#4222-challenges-with-layouttsx-in-app-router)
      - [4.2.2.3 Restructure the project](#4223-restructure-the-project)
      - [4.2.2.4 Creating the new depth tracking components](#4224-creating-the-new-depth-tracking-components)
      - [4.2.2.5 Running the app](#4225-running-the-app)
      - [4.2.2.6 Visualizing in `Plausible`](#4226-visualizing-in-plausible)
  - [4.3 Funnel analysis](#43-funnel-analysis)

## 4.1 Custom events - full integration

Let's explore custom events in `Plausible`!

### 4.1.1 Creating custom events from `Next.js`

Sending custom events from `Next.js`

Let's shallowly explore what we can do with `Plausible`!
With `next-plausible`,
we have very fine control of what we can send over
to our `Plausible` analytics server!

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

- we've added the
  [`'use client'` directive](https://nextjs.org/docs/app/building-your-application/rendering/client-components#using-client-components-in-nextjs)
  to the top of the file.
This is because we're adding interactivity to this page
by invoking an event handler when clicking a button.
- added the
  [`usePlausible()` hook](https://github.com/4lejandrito/next-plausible#send-custom-events)
  from `next-plausible`.
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

### 4.1.2 Custom events insights in our self-hosted `Plausible` server

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

### 4.1.3 Seeing custom events' props in `Plausible` dashboard

Remember when we sent the `customEventName` with props in
[3.1 Sending custom events from `Next.js`](#31-sending-custom-events-from-nextjs)?
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




## 4.2 Custom events - practical examples

Let's explore some practical examples of custom events.
For both of the following examples,
we are going to introduce a rudimentary session system
to keep track of the person's session.

> [!NOTE]
>
> You can find more informations about session management in `Next.js` in the
> [official docs](https://nextjs.org/docs/app/building-your-application/authentication#session-management).

We are going to be creating a **session ID**
that will be stored in a cookie.
This session ID will be sent with every custom event
and will be used to track the user's session.
A session will be considered as a user's visit to the website
until they close the tab or browser.

Let's start by installing two required packages:
- [**`uuid`**](https://github.com/uuidjs/uuid),
  a package that generates unique identifiers.
- [**`js-cookie`**](https://github.com/js-cookie/js-cookie),
  a package that allows us to work with cookies.

Run the following command to install:

```sh
pnpm add js-cookie uuid
```

### 4.2.1 Search custom event

Let's create a custom event for when
a user searches for something on our website.
We want to track the top searches that are being made
on our website.

Similarly to the below,
to not clog the database,
we shouldn't send a custom event at every type, even debouncing.
Only when they click on the search button/press enter/click on result,
we send the custom event.

We are going to create a custom component called `Search.tsx`:
Let's preemptively add it to `app/components/nav.tsx`'s return statement.

```tsx
import SearchInput from "./search";

// ...

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
        <SearchInput/> // add this line
      </div>
    </aside>
  );
```

Now let's create `<SearchInput>`!
Create a file in `app/components/search.tsx`:

```tsx
import { usePlausible } from "next-plausible";
import React, { useState, useCallback, useEffect } from "react";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

export default function SearchInput() {
  const plausible = usePlausible();
  const [searchValue, setSearchValue] = useState("");
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    // Check if a session ID already exists in cookies
    let id = Cookies.get("sessionId");
    if (!id) {
      // Generate a new session ID if it doesn't exist
      id = uuidv4();
      // Set cookie to expire to 0 days.
      // This means the cookie will be deleted when the browser is closed.
      // See https://stackoverflow.com/questions/2537060/can-a-cookie-expire-when-either-some-time-passes-or-browser-is-closed
      Cookies.set("sessionId", id, { expires: 0 }); 
    }
    setSessionId(id);
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      plausible("searchValue", {
        props: {
          value: searchValue || "",
          sessionId: sessionId,
        },
      });
    },
    [searchValue, sessionId]
  );

  return (
    <form className="max-w-md" onSubmit={handleSubmit}>
      <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search for anything"
          required
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button
          type="submit"
          className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Search
        </button>
      </div>
    </form>
  );
}
```

- **check for an existing session** id using
  the `useEffect` hook,
  checking if a session ID already exists in the cookies using:
  `Cookies.get("sessionId")`.
- **generate a new session ID**.
  If no session ID exists, we generate a new one using `uuidv4()`
  and store it in the cookies using:
  `Cookies.set("sessionId", id, { expires: 0 })`.
  The `{ expires: 0 }` option sets the cookie to expire when the browser is closed.
- **store the session ID in the component** state using `setSessionId(id)`.
- **include the session ID in the custom event properties**
  when the form is submitted using:
  `plausible("searchValue", { props: { value: searchValue || "", sessionId: sessionId } })`.

If you run the application (`sudo pnpm run dev`)
with `Plausible` instance running on your `localhost` too,
and type something in the search bar and click the search button,
you will see a custom event being sent.

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/2609ca1d-8cfc-49ba-936a-bae7bc1ee380">
</p>

If you go to `http://localhost:8000/localhost/settings/properties`
(this assumes you've created a `localhost` website
in your `Plausible` instance),
you can set the properties of custom events on the dashboard.
When `Plausible` receives custom events,
it will automatically detect the properties sent with the event.

<p align="center">
    <img width="45%" src="https://github.com/user-attachments/assets/926a8972-2b4b-4d54-b3d6-d828fbfd2c12">
    <img width="45%" src="https://github.com/user-attachments/assets/adffa503-2508-43bd-ae50-ec1a89655491">
</p>

Now, if you go back to the dashboard and scroll down to the end of the page,
you'll be able to see information about the custom events that we're seeing
under `properties`.
We get a ranking of the most searched terms on our website!

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/8596f10c-7b8f-4228-bf12-6b7864c3e10f">
</p>

That is not all.
We can filter all the information we have on the dashboard
by the properties we've defined.
Scroll back up and on `Filter`and select on `Properties`
and on the `value` prop we're passing in our custom event.

<p align="center">
    <img width="45%" src="https://github.com/user-attachments/assets/35d5ceb1-10e7-4cf2-994d-a02b82dae8fd">
    <img width="45%" src="https://github.com/user-attachments/assets/96f89ac9-d954-4454-87b2-a89e8d5bb54f">
</p>

Now all of the dashboards are filtered by the `value` prop
that contains a set of terms we've defined!

<p align="center">
    <img width="700" src="https://github.com/user-attachments/assets/bd1c064a-1b88-46b7-8d54-39f09a0f6372">
</p>

This will give us insights on what people are searching for on our website
and what we should focus on to increase engagement.

### 4.2.2 Page scroll depth

In this section,
we will discuss the implementation of page scroll depth tracking.
This is a common metric used to understand user engagement on a website
and can be used to identify the most engaging parts of a page.

This involves using both the
[`pages` and `app` routers](https://dev.to/dcs_ink/nextjs-app-router-vs-pages-router-3p57) together.
We'll explain why this is necessary in a moment.

#### 4.2.2.1 Why use both `pages` and `app` routers together

In `Next.js`, 
the **app directory** (`App Router`) introduces
a new way to structure and manage routes,
while the **pages directory** (`Pages Router`)
follows the traditional routing approach.
Using both routers together allows for a gradual migration
from the `Pages Router `to the `App Router`
or a hybrid setup where different parts of the application
can leverage the strengths of each router.

One of the key reasons for using both routers
together in this context **is the need for client components**.
Plausible requires client-side execution.
The App Router's layout component is not easily compatible this purpose
(since App Router is by default a *server component*),
 leading to the decision to use the Pages Router
 to easily add scroll depth tracking capabilities to all pages.

We can declare client components within App Router pages
by using the `"use client"` directive at the top of the file.
But doing this for every page can be cumbersome.


#### 4.2.2.2 Challenges with `layout.tsx` in App Router

The
[`layout.tsx`](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
file in the App Router
allows us to define a layout that wraps around all pages.
This is a great way to ensure consistent styling across all pages.

Adding scroll depth tracking was attempted here.
However, this approach faced several challenges:

- **Hydration Errors**: 
  Including `<html>`, `<head>`, and `<body>` tags
  in the layout component led to hydration errors
  because these tags are managed by `Next.js`
  and should not be included in the component.

- **Client-Side Execution**:
  The `window` object, which is required for scroll depth tracking,
  is only available on the client side.
  Ensuring that the code accessing the `window` object
  runs only on the client side was challenging within the `layout` component.

To address these challenges,
the scroll depth tracking functionality was moved to the Pages Router,
allowing for easier integration and client-side execution.

#### 4.2.2.3 Restructure the project

Restructure the project to the following:

```sh
.
├── app
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── page.tsx
│   ├── robots.ts
│   ├── sitemap.ts
│   ├── rss
│   ├── blog
│   └── og
├── pages
│   ├── _app.tsx
│   ├── long-page.tsx
├── components
│   ├── nav.tsx
│   ├── posts.tsx
│   ├── search.tsx
│   ├── mdx.tsx
│   └── footer.tsx
├── global.css
```

- keep the blog and many pages  inside the `app` directory.
- move the components to a dedicated `components` directory.
- move hte `global.css` file to the root of the project.
- create a `pages` directory
  and create a `_app.tsx` file inside it.

Create the `pages/long-page.tsx` file:

```tsx
const LongPage = () => {
  return (
    <div>
      <h1>Long Page for Scroll Testing</h1>
      {Array.from({ length: 100 }, (_, i) => (
        <p key={i}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      ))}
    </div>
  );
};

export default LongPage;
```

This is a simple page.
We're just adding a long page with 10 paragraphs
of [`lorem ipsum` text](https://www.lipsum.com/).

With this new page,
we're going to add a `Link` to it in the `app/page.tsx`,
which is the main page of our website.

```tsx
import { BlogPosts } from 'components/posts'
import Link from 'next/link' // add this

export default function Page() {
  return (
    <section>
      
      ...
      
      <Link
        key={"long-page"}
        className="flex flex-col space-y-1 mb-4"
        href={`/long-page/`}
      >
        <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
          <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
            Visit the "long-page" to check scroll depth custom event
          </p>
        </div>
      </Link>
    </section>
  )
}
```

Now, let's create the `pages/_app.tsx` file:

```tsx
// pages/_app.tsx
import '../global.css'
import type { AppProps } from 'next/app'
import { Navbar } from '../components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from '../components/footer'
import PlausibleProvider from 'next-plausible'
import ClientApplication from '../components/client-pages-root'

const PagesApp = ({ Component, pageProps }: AppProps) => {
  return (
    <div
      className={`text-black bg-white dark:text-white dark:bg-black`}
    >
      <PlausibleProvider domain="localhost" selfHosted trackLocalhost enabled />
      <div className="antialiased max-w-xl mx-4 mt-8 lg:mx-auto">
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
          <Navbar />
          <ClientApplication>
            <Component {...pageProps} />
          </ClientApplication>
          <Footer />
          <Analytics />
          <SpeedInsights />
        </main>
      </div>
    </div>
  )
}

export default PagesApp
```

As you may have noticed,
it's very similar to the `app/layout.tsx` file,
albeit with a main difference:
**we've added a `<ClientApplication>` component**.
We will create this component in the next section.


#### 4.2.2.4 Creating the new depth tracking components

To implement scroll depth tracking,
we are going to add a couple of new components.

First one, is the **`ScrollDepthTracker` component**,
which is responsible for tracking the maximum scroll depth
and sending the data to Plausible.
It uses the `useEffect` hook to add and remove event listeners
for `scroll` and `beforeunload` events.
The `window` object is accessed for scroll tracking.

Create a new file `app/components/depth-tracker.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { usePlausible } from "next-plausible";

const ScrollDepthTracker = () => {
  const [maxDepth, setMaxDepth] = useState(0);
  const plausible = usePlausible();
  const [eventSent, setEventSent] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Ensure this code runs only on the client side
    if (typeof window === "undefined") return;

    const path = window.location.pathname;

    const handleScroll = () => {
      // Clear the previous timeout if it exists
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Set a new timeout to update the max depth after a delay
      // This is a debounce to address the edge case where the user scrolls quickly
      // and doesn't really read the content.
      setScrollTimeout(
        setTimeout(() => {
          const scrollTop = window.scrollY;
          const windowHeight = window.innerHeight;
          const docHeight = document.documentElement.scrollHeight;
          const totalScroll = (scrollTop + windowHeight) / docHeight;

          const depth = Math.floor(totalScroll * 100 / 10) * 10; // Floor to nearest 10%

          if (depth > maxDepth) {
            setMaxDepth(depth);
          }
        }, 2000) // 2-second debounce
      );
    };

    const sendEvent = () => {
      if (!eventSent && maxDepth > 0) {
        plausible("scrollDepth", {
          props: {
            path: path,
            depth: `${maxDepth}%`,
            tag: `${path}|${maxDepth}%`, // Combine path and depth into a tag
          },
        });
        setEventSent(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("beforeunload", sendEvent);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", sendEvent);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [maxDepth, eventSent, plausible, scrollTimeout]);

  return null;
};

export default ScrollDepthTracker;
```

Let's go over what we've implemented:

- we've calculated the scroll depth as a percentage of the total scroll height.
- we've sent a custom event **`scrollDepth`** to Plausible with:
  - `path`, the path of the page.
  - `depth`, a percentage of the scrolling depth. 
  - `tag`, a combination of the path and depth.
    This property is necessary to filter the data in the Plausible dashboard.
    This is mostly because Plausible doesn't allow filtering
    by multiple properties under a given path.
    So, instead, we have to combine the properties into a single property
    and add a filter which limits to `tag` values that contain `/some/page`.
    You will see this in action later in section
    [4.2.2.6 Visualizing in `Plausible`](#4226-visualizing-in-plausible).
- we've removed the event listeners when the component is unmounted.

In this file, we have some considerations
that affected what we've implemented.
We are addressing a few edge cases:

- people can scroll up and down the page quickly scanning for something
  in particular. 
  Quickly scrolling down the page and back up is not relevant to us.
  That's why we are **debouncing this behaviour**,
  meaning that we are only setting the `maxDepth`
  if the person stays for at least `2 seconds`
  (we found this value appropriate,
  you can always tweak this value).
- no events are emitted for `0%`.
  This metric is virtually the same as a page view.
- the event is only sent whenever the page is unloaded.
  Meaning that **only one event** is send,
  right before the person either closes the page,
  navigates to another or closes the browser.

Now, let's create the `<ClientApplication>` component
that is found in the `/pages/_app.tsx` file:

Create a file called `/components/client-pages-root.tsx`:

```tsx
"use client";

import { ReactNode } from "react";
import ScrollDepthTracker from "./depth-tracker";

interface ClientApplicationProps {
  children: ReactNode;
}

const ClientApplication = ({ children }: ClientApplicationProps) => {
  return (
    <>
      <ScrollDepthTracker />
      {children}
    </>
  );
};

export default ClientApplication;
```

This component is used in the `pages/_app.tsx` file
and is applied to all Pages Router pages.


#### 4.2.2.5 Running the app

Now, let's run the app!
Run `sudo pnpm run dev` to start the development server.
You should see the following pages in `https://localhost:3000`.

<p align="center">
    <img width="45%" src="https://github.com/user-attachments/assets/56b57b15-c8e5-4c1b-be17-ac3afcdb0c11">
    <img width="45%" src="https://github.com/user-attachments/assets/02ebdd09-955d-4946-b895-384522f238a2">
</p>

As you can see,
you are able to navigate to `/long-page` from the homepage through the link.

When you scroll,
when moving to another page/leaving the page/closing the browser,
an event is sent to the `Plausible` server.

Now, let's see it in action!

#### 4.2.2.6 Visualizing in `Plausible`

If you go to the `Plausible` dashboard,
go to your website's settings
and check the `Custom Events` section
(like we did previously),
you can add the `tag` and `path` property
from our newly created custom event
to the dashboard.

<p align="center">
    <img width="800" src="https://github.com/user-attachments/assets/6cb73717-324c-4cd1-8b61-ec1cb7b596af">
</p>

If you do so,
you can check it in the main dashboard,
like so.

<p align="center">
    <img width="800" src="https://github.com/user-attachments/assets/36091652-11bf-4034-96a7-88b09e1af9d0">
</p>

Great!
But this information is useless.
We are going to leverage this `tag` property
to filter the data in the dashboard
so we can see the scroll depth of a specific page
and how much people are scrolling on it.

Scroll up, click on `Filter`
and select `Properties` and `tag`.
We are going to filter it so it contains `/long-page`
(or any other page you want to track).

<p align="center">
    <img width="800" src="https://github.com/user-attachments/assets/057d86c7-bf94-41b7-b189-261bd4ea7626">
</p>

This, as we know,
will apply the filter to all the data in the whole dashboard page.
If we scroll back down to the `Goals` section,
check the properties
and see the `depth` property we've defined,
we will see how much people are scrolling on the page!

<p align="center">
    <img width="800" src="https://github.com/user-attachments/assets/518ce1f8-16ff-472c-9c79-1ab614f17bee">
</p>

As you can see,
we can leverage the way we filter out the data in the dashboard
to get these insights!

Give yourself a pat on the back!
🎉

## 4.3 Funnel analysis

As of time of writing,
`Plausible` does not support funnel analysis
for CE (Community Edition) users.
This feature is only available for Cloud users.

However, Plausible is planning on releasing
this feature for CE users in the future.
Check
[plausible/analytics#4639](https://github.com/plausible/analytics/discussions/4639)
for more information.
