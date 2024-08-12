# Deploying `Plausible Analytics` on-prem


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

In this tutorial,
we are assuming you have [`Docker`](https://docs.docker.com/engine/install/) installed.
Additionally,
we will be using [`pnpm` ](https://pnpm.io/installation)
as package manager,
since we're going to be using a simple [`Next.js`](https://nextjs.org/) application
to get insights from.

Ready to go fast!
Don't worry,
it's actually simple!

Let's go! 🏃

> [!NOTE]
>
> This tutorial will attempt you to provide a way
> to get up & running with `Plausible CE` as fast as possible.
> Some details may be omitted,
> so we highly recommend you check out the [official docs](https://github.com/plausible/community-edition/#install).


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
we'll generate a key using [`OpenSSL`](https://www.openssl.org/).

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

## 1.3 Running it!

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
    <img width="900" src="https://github.com/user-attachments/assets/69499cdf-57a9-4197-8ef7-60e91874459e">
</p>

Congratulations! 🎉
You've `Plausible CE` up and running!
Now it's ready to get some juicy insights! 📈

Click on `Register` and fill out the form.
You can use a test e-mail,
since all the info is being saved into your computer.

<p align="center">
    <img width="900" src="https://github.com/user-attachments/assets/85a84ba1-42ca-4184-a6f9-2c7de7bd5bc3">
</p>

Next up, we'll be asked to add a website we want to monitor.
As aforementioned,
we're going to be tracking a `Next.js` site running on `localhost`.
So, let's add it to the `domain` field.

<p align="center">
    <img width="900" src="https://github.com/user-attachments/assets/d2a28e4a-b705-4297-915d-6654b3a0a63c">
</p>

After that,
you should be done! 👏


<p align="center">
    <img width="900" src="https://github.com/user-attachments/assets/d67d93b2-0cd6-4a77-bf80-edd3d8d0c036">
</p>

You'll be prompted a screen suggesting you
how to add the `Plausible` script to your website
so your self-hosted `Plausible` server can get its data.
For now, you can safely ignore this suggestion,
because we're going to be doing it differently
in our `Next.js` site.

Click on `Start collecting data`.
You will be redirected to the next page.

<p align="center">
    <img width="900" src="https://github.com/user-attachments/assets/2d71f564-5165-42cb-b651-d548a99e55a5">
</p>

As you can see, `Plausible` is waiting for anyone
to visit the page on `localhost` to display insights.

As of now, we have no website running on our `localhost`.
So let's fix that!

