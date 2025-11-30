import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.tsx'
import { ConfigProvider } from 'antd'
import type { ThemeConfig } from 'antd'

const config: ThemeConfig = {
  token: {
    fontSize: 14,
    borderRadius: 16,
    fontFamily: '"Montserrat Alternates", sans-serif',
    colorPrimary: '#1677ff',
    colorInfo: '#1677ff'
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={config}>
      <App />
    </ConfigProvider>
  </StrictMode>
)
