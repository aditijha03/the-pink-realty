import React from 'react'
import { ViteReactSSG } from 'vite-react-ssg'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Services from './pages/Services.jsx'
import PropertyList from './pages/PropertyList.jsx'
import PropertyDetail from './pages/PropertyDetail.jsx'
import ContactUs from './pages/ContactUs.jsx'
import EmiCalculatorPage from './pages/EmiCalculatorPage.jsx'
import AdminRoutes from './admin/AdminRoutes.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

import { Outlet } from 'react-router-dom'

export const routes = [
  {
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      {
        path: '/',
        element: <App />,
        children: [
          { index: true, element: <Home /> },
          { path: 'about-us', element: <About /> },
          { path: 'services', element: <Services /> },
          { path: 'property-list', element: <PropertyList /> },
          { path: 'property/:slug', element: <PropertyDetail /> },
          { path: 'contact-us', element: <ContactUs /> },
          { path: 'emi-calculator', element: <EmiCalculatorPage /> }
        ]
      },
      {
        path: '/admin/*',
        element: <AdminRoutes />
      }
    ]
  }
]

export const createRoot = ViteReactSSG(
  { routes }
)
