import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import viVN from 'antd/locale/vi_VN'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'

import './index.css'
import App from './App.tsx'
import { ConfigProvider } from 'antd'
import type { ThemeConfig } from 'antd'
import { store } from '~/redux/store.ts'

import { injectStore } from '~/utils/authorizedAxios'
injectStore(store)

const persistor = persistStore(store)
const queryClient = new QueryClient()
dayjs.locale('vi')

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
    <ConfigProvider theme={config} locale={viVN}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </ConfigProvider>
  </StrictMode>
)
