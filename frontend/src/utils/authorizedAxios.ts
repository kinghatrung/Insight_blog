import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios'
import type { Store } from '@reduxjs/toolkit'
import { message } from 'antd'

import { logoutUser } from '~/redux/slices/authSlice'
import { authService } from '~/services/authService'
import type { AppDispatch } from '~/redux/store'

interface ErrorResponse {
  message?: string
}

let axiosReduxStore: { dispatch: AppDispatch } | undefined

export const injectStore = (mainStore: Store) => {
  axiosReduxStore = mainStore
}

const authorizedAxiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 1000 * 60 * 10,
  withCredentials: true
})

let refreshTokenPromise: Promise<string | undefined> | null = null

// Request interceptor
authorizedAxiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor
authorizedAxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response?.data.message) {
      message.success(response.data.message)
    }

    return response
  },
  async (error: AxiosError) => {
    const status = error.response?.status
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // TH1: Access token hết hạn hoặc không hợp lệ
    if (status === 401) {
      axiosReduxStore?.dispatch(logoutUser())
      return Promise.reject(error)
    }

    // TH2: Refresh token còn hạn => gọi API refresh
    if (status === 410 && !originalRequest._retry) {
      originalRequest._retry = true

      if (!refreshTokenPromise) {
        refreshTokenPromise = authService
          .refreshToken()
          .then((data) => {
            return data
          })
          .catch((_error) => {
            axiosReduxStore?.dispatch(logoutUser())
            return Promise.reject(_error)
          })
          .finally(() => {
            refreshTokenPromise = null
          })
      }

      try {
        await refreshTokenPromise
        return authorizedAxiosInstance(originalRequest)
      } catch (err) {
        return Promise.reject(err)
      }
    }

    // TH3: Các lỗi khác
    if (status !== 410 && status !== 401) {
      message.error((error.response?.data as ErrorResponse)?.message || 'Đã xảy ra lỗi!')
    }

    return Promise.reject(error)
  }
)

export default authorizedAxiosInstance
