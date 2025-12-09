export interface User {
  _id: string
  email: string
  username: string
  password: string
  displayName: string
  role: string
  avatarUrl?: string
  createAt?: string
  updatedAt?: string
}

export interface Author {
  _id: string
  username: string
  displayName: string
  avatarUrl: string
}
