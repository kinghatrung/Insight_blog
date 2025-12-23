import authorizedAxiosInstance from '~/utils/authorizedAxios'
import type { GetBlogsParams } from '~/types/Blog'

export const blogService = {
  getBlogs: async (params?: GetBlogsParams) => {
    const res = await authorizedAxiosInstance.get('/blogs', {
      params
    })
    return res.data
  },
  getBlogsStats: async () => {
    const res = await authorizedAxiosInstance.get('/blogs/stats')
    return res.data
  },
  getBlogsActive: async (search?: string) => {
    const res = await authorizedAxiosInstance.get('/blogs/active', { params: { search } })
    return res.data?.blogsActive
  },
  getBlogsActiveForAuthor: async (idUser?: string) => {
    const res = await authorizedAxiosInstance.get(`/blogs/active/${idUser}`)
    return res.data
  },
  getBlogBySlug: async (slug: string) => {
    const res = await authorizedAxiosInstance.get(`/blogs/${slug}`)
    return res.data
  },
  getBlogsLiked: async (idUser?: string) => {
    const res = await authorizedAxiosInstance.get(`/blogs/${idUser}/like`)
    return res.data
  },
  likeBlog: async (idBlog: string) => {
    return await authorizedAxiosInstance.post(`/blogs/${idBlog}/like`)
  },
  unlikeBlog: async (idBlog: string) => {
    return await authorizedAxiosInstance.delete(`/blogs/${idBlog}/like`)
  },
  getBlogsSave: async (idUser?: string) => {
    const res = await authorizedAxiosInstance.get(`/blogs/${idUser}/save`)
    return res.data
  },
  saveBlog: async (idBlog: string) => {
    return await authorizedAxiosInstance.post(`/blogs/${idBlog}/save`)
  },
  unsaveBlog: async (idBlog: string) => {
    return await authorizedAxiosInstance.delete(`/blogs/${idBlog}/save`)
  },
  createBlog: async (
    title: string,
    content: string,
    thumbnail: string,
    status: string,
    author: string,
    description: string,
    category: string
  ) => {
    const res = await authorizedAxiosInstance.post('/blogs/blog', {
      title,
      content,
      thumbnail,
      status,
      author,
      description,
      category
    })
    return res.data
  },
  editBlog: async (
    idBlog: string,
    title: string,
    content: string,
    category: string,
    thumbnail: string,
    status: string,
    description: string
  ) => {
    const res = await authorizedAxiosInstance.put(`/blogs/blog/${idBlog}`, {
      title,
      content,
      category,
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
