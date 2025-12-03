import authorizedAxiosInstance from '~/utils/authorizedAxios'

export const blogService = {
  getBlogs: async (current = 1, pageSize = 5) => {
    const res = await authorizedAxiosInstance.get('/blogs', {
      params: {
        page: current,
        pageSize: pageSize
      }
    })
    return res.data
  },
  getBlog: async (id: string) => {
    const res = await authorizedAxiosInstance.get(`/blogs/${id}`)
    return res.data
  },
  createBlog: async (title: string, content: string, thumbnail: string, status: string, author: string) => {
    const res = await authorizedAxiosInstance.post('/blogs/blog', { title, content, thumbnail, status, author })
    return res.data
  },
  editBlog: async (idBlog: string, title: string, content: string, thumbnail: string, status: string) => {
    const res = await authorizedAxiosInstance.put(`/blogs/blog/${idBlog}`, { title, content, thumbnail, status })
    return res.data
  },
  deleteBlog: async (idBlog: string) => {
    return await authorizedAxiosInstance.delete(`/blogs/del/${idBlog}`)
  }
}
