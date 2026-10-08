import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MobileBottomBar from './components/MobileBottomBar'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import ScrollToTop from './components/ScrollToTop'
import PageTransition from './components/PageTransition'
import IntroLoader from './components/IntroLoader'
import { Head } from 'vite-react-ssg'

import ClientOnly from './components/ClientOnly'

function App() {
  const isStaging = import.meta.env.VITE_SITE_ENV === 'staging';

  return (
    <>
      <ScrollToTop />
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#D6246E" />
        {isStaging && <meta name="robots" content="noindex, nofollow" />}
      </Head>
      <Navbar />
      <main className="min-h-screen">
        <ClientOnly>
          <div aria-hidden="true">
            <IntroLoader />
          </div>
        </ClientOnly>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <aside aria-label="Quick Actions">
        <MobileBottomBar />
        <FloatingWhatsApp />
      </aside>
    </>
  )
}

export default App
