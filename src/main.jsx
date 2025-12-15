import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// 1. Import the Provider
import { LanguageProvider } from './context/LanguageContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Wrap App inside the Provider */}
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)