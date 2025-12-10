import authorizedAxiosInstance from '~/utils/authorizedAxios'

export const categoryService = {
  getCategories: async () => {
    const res = await authorizedAxiosInstance.get('/categories')
    return res.data
  },
  getCategoriesActive: async () => {
    const res = await authorizedAxiosInstance.get('/categories/active')
    return res.data
  },
  getCategoryBySlug: async (slug: string) => {
    const res = await authorizedAxiosInstance.get(`/categories/${slug}`)
    return res.data
  },
  createCategory: async (title: string, status: string) => {
    const res = await authorizedAxiosInstance.post('/categories/category', {
      title,
      status
    })
    return res.data
  },
  editCategory: async (idCategory: string, title: string, status: string) => {
    const res = await authorizedAxiosInstance.put(`/categories/category/${idCategory}`, {
      title,
      status
    })
    return res.data
  },
  deleteCategory: async (idCategory: string) => {
    return await authorizedAxiosInstance.delete(`/categories/del/${idCategory}`)
  }
}
