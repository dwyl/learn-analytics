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