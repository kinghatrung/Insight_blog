import authorizedAxiosInstance from '~/utils/authorizedAxios'
import type { GetCategoryParams } from '~/types/Category'

export const categoryService = {
  getCategories: async (params: GetCategoryParams) => {
    const res = await authorizedAxiosInstance.get('/categories', {
      params
    })
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
  createCategory: async (title: string, status: string, description: string) => {
    const res = await authorizedAxiosInstance.post('/categories/category', {
      title,
      status,
      description
    })
    return res.data
  },
  editCategory: async (idCategory: string, title: string, status: string, description: string) => {
    const res = await authorizedAxiosInstance.put(`/categories/category/${idCategory}`, {
      title,
      status,
      description
    })
    return res.data
  },
  deleteCategory: async (idCategory: string) => {
    return await authorizedAxiosInstance.delete(`/categories/del/${idCategory}`)
  }
}
