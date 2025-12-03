import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

import './index.css'
import App from './App.tsx'
import { ConfigProvider } from 'antd'
import type { ThemeConfig } from 'antd'
import { store } from '~/redux/store.ts'

import { injectStore } from '~/utils/authorizedAxios'
injectStore(store)

const persistor = persistStore(store)

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
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </ConfigProvider>
  </StrictMode>
)
