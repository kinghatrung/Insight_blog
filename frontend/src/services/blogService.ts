import authorizedAxiosInstance from '~/utils/authorizedAxios'
import type { GetBlogsParams } from '~/types/Blog'

export const blogService = {
  getBlogs: async (params: GetBlogsParams) => {
    const res = await authorizedAxiosInstance.get('/blogs', {
      params
    })
    return res.data
  },
  getBlogsActive: async () => {
    const res = await authorizedAxiosInstance.get('/blogs/active')
    return res.data
  },
  getBlogBySlug: async (slug: string) => {
    const res = await authorizedAxiosInstance.get(`/blogs/${slug}`)
    return res.data
  },
  createBlog: async (
    title: string,
    content: string,
    thumbnail: string,
    status: string,
    author: string,
    description: string
  ) => {
    const res = await authorizedAxiosInstance.post('/blogs/blog', {
      title,
      content,
      thumbnail,
      status,
      author,
      description
    })
    return res.data
  },
  editBlog: async (
    idBlog: string,
    title: string,
    content: string,
    thumbnail: string,
    status: string,
    description: string
  ) => {
    const res = await authorizedAxiosInstance.put(`/blogs/blog/${idBlog}`, {
      title,
      content,
      thumbnail,
      status,
      description
    })
    return res.data
  },
  deleteBlog: async (idBlog: string) => {
    return await authorizedAxiosInstance.delete(`/blogs/del/${idBlog}`)
  }
}
