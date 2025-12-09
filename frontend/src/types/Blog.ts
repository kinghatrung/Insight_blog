export interface Author {
  _id: string
  username: string
  displayName: string
  avatarUrl: string
}

export interface Category {
  _id: string
  title?: string
  slug: string
  status: string
}

interface FileListItem {
  url?: string
  response?: string
}

export interface Blog {
  _id: string
  title: string
  description: string
  content: string
  category: string | Category
  thumbnail: string
  slug: string
  status: string
  author: Author
  createdAt: string
  updatedAt: string
}

export interface BlogFromValues {
  title: string
  description: string
  content: string
  thumbnail: string | FileListItem[]
  status: string
  category: string
}

export interface GetBlogsParams {
  page: number
  pageSize: number
  title?: string
  category?: string
  status?: string
  startTime?: string
  endTime?: string
}
