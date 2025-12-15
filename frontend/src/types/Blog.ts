import type { CategoryType } from '~/types/Category'
import type { Author } from '~/types/User'

interface FileListItem {
  url?: string
  response?: string
}

export interface Blog {
  _id: string
  title: string
  description: string
  content: string
  category: CategoryType
  thumbnail: string
  slug: string
  status: string
  likes: number
  likeBy?: Author[]
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
