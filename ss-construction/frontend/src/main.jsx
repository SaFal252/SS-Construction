import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B8860B]"></div>
  </div>
)

const rootContainer = document.getElementById('root')
// The warning about createRoot is typically for using ReactDOM.render instead of createRoot.
// This code already uses createRoot. The conditional check `if (!rootContainer._reactRoot)`
// is a common pattern for development environments with HMR to prevent re-creating the root.
// If a warning persists, it might be related to a specific React version or setup,
// but the current usage of createRoot is generally correct.
const root = ReactDOM.createRoot(rootContainer)

root.render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <HelmetProvider>
        <Suspense fallback={<LoadingFallback />}>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#10B981',
                  color: '#fff',
                },
              },
              error: {
                duration: 4000,
                style: {
                  background: '#EF4444',
                  color: '#fff',
                },
              },
            }}
          />
        </Suspense>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
