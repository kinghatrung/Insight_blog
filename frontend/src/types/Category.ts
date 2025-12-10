import type { Blog } from '~/types/Blog'

export interface CategoryType {
  _id: string
  title: string
  slug: string
  status: string
  description: string
  blogs: Blog[]
  createdAt: string
  updatedAt: string
}

export interface CategoryFromValues {
  title: string
  description: string
  status: string
}

export interface GetCategoryParams {
  page: number
  pageSize: number
  title?: string
  status?: string
  startTime?: string
  endTime?: string
}
