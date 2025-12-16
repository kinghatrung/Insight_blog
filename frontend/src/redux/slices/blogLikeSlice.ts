import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { blogService } from '~/services/blogService'

interface BlogLikeState {
  loading: boolean
}

const initialState: BlogLikeState = {
  loading: false
}

export const likeBlog = createAsyncThunk('blogLike/likeBlog', async (idBlog: string) => {
  await blogService.likeBlog(idBlog)
  return idBlog
})

export const unlikeBlog = createAsyncThunk('blogLike/unlikeBlog', async (idBlog: string) => {
  await blogService.unlikeBlog(idBlog)
  return idBlog
})

export const blogLikeSlice = createSlice({
  name: 'blogLike',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(likeBlog.pending, (state) => {
        state.loading = true
      })
      .addCase(likeBlog.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(unlikeBlog.fulfilled, (state) => {
        state.loading = false
      })
  }
})

export const blogLikeReducer = blogLikeSlice.reducer
