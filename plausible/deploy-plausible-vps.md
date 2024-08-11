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
we'll be hosting 
No newline at end of file
