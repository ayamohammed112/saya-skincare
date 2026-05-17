import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { LanguageProvider } from './context/LanguageContext'
import { AccountProvider } from './context/AccountContext'
import { RecentlyViewedProvider } from './context/RecentlyViewedContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AccountProvider>
          <CartProvider>
            <RecentlyViewedProvider>
              <App />
            </RecentlyViewedProvider>
          </CartProvider>
        </AccountProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
