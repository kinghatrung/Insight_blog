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
