# Exploring custom events in `Plausible` in `Next.js`

> [!IMPORTANT]
>
> This guide assumes you've already set up `Plausible` on your website.
> Check [`README.md`](./README.md#4-exploring-custom-events-in-plausible) for more information.
> Make sure you've set up `Plausible` and the integration in your `Next.js` site.

For more information about custom events in `Plausible`,
check [`custom-events.md`](./custom-events.md).


## 4.1 Sending custom events from `Next.js`

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


## 4.2 Custom events insights in our self-hosted `Plausible` server

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


## 4.3 Seeing custom events' props in `Plausible` dashboard

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

