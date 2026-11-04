import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AboutPage from './about-page.tsx'
import { applyTheme } from '@/lib/theme'

applyTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AboutPage />
  </StrictMode>,
)
