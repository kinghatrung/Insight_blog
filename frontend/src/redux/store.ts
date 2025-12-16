import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { authReducer } from '~/redux/slices/authSlice'
import { blogLikeReducer } from '~/redux/slices/blogLikeSlice'

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['auth']
}

const reducers = combineReducers({
  auth: authReducer,
  blogLike: blogLikeReducer
})

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
