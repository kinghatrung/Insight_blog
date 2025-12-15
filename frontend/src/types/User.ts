import type { Blog } from '~/types/Blog'

interface Avatar {
  url: string
  public_id: string
}

export interface User {
  _id: string
  email: string
  username: string
  password: string
  displayName: string
  avatarUrl: string
  avatarId: string
  blogs?: Blog[]
  role: string
  createAt: string
  updatedAt: string
}

export interface Author {
  _id: string
  username: string
  displayName: string
  avatarUrl: string
}

export interface UserFromValues {
  email: string
  username: string
  displayName: string
  role: string
  avatarUrl: Avatar[]
  firstName: string
  lastName: string
  password: string
}

export interface GetUserParams {
  page: number
  pageSize: number
  email?: string
  username?: string
  displayName?: string
  avatarUrl?: string
  avatarId?: string
  role?: string
  startTime?: string
  endTime?: string
}
