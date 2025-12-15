import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '~/redux/store'

import { authService } from '~/services/authService'
import { userService } from '~/services/userService'
import type { User } from '~/types/User'

interface AuthState {
  currentUser: User | null
  loading: boolean
}

interface EditUserPayload {
  idUser: string
  data: {
    displayName?: string
    password?: string
    avatarUrl?: string
    avatarId?: string
    role?: string
  }
}

const initialState: AuthState = {
  currentUser: null,
  loading: false
}

export const loginUser = createAsyncThunk<User, { username: string; password: string }>(
  'auth/loginUser',
  async ({ username, password }, { dispatch }) => {
    const res = await authService.login(username, password)
    const user = await dispatch(fetchMe()).unwrap()
    const { accessToken } = res
    const infoUser = { accessToken, ...user }
    return infoUser
  }
)

export const editUser = createAsyncThunk<User, EditUserPayload>(
  'auth/editUser',
  async ({ idUser, data }, { dispatch }) => {
    await userService.editUsers(idUser, data)
    const user = await dispatch(fetchMe()).unwrap()
    return user
  }
)

export const fetchMe = createAsyncThunk<User>('auth/fetchMe', async () => {
  const user = await userService.fetchMe()
  return user
})

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  const res = await authService.logout()
  return res.data
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.currentUser = action.payload
        state.loading = false
      })

      .addCase(editUser.pending, (state) => {
        state.loading = true
      })
      .addCase(editUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.currentUser = action.payload
        state.loading = false
      })
      .addCase(editUser.rejected, (state) => {
        state.loading = false
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null
        state.loading = false
      })
  }
})

export const authSelectors = (state: RootState) => {
  return state.auth
}

export const authReducer = authSlice.reducer
