import authorizedAxiosInstance from '~/utils/authorizedAxios'
import type { GetUserParams } from '~/types/User'

export const userService = {
  getUsers: async (params: GetUserParams) => {
    const res = await authorizedAxiosInstance.get(`/users`, {
      params
    })
    return res.data
  },
  createUser: async (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
    avatarUrl: string,
    avatarId: string
  ) => {
    const res = await authorizedAxiosInstance.post(`/users/user`, {
      username,
      password,
      email,
      firstName,
      lastName,
      avatarUrl,
      avatarId
    })
    return res.data
  },
  fetchMe: async () => {
    const res = await authorizedAxiosInstance.get('/users/me')
    return res.data.user
  },
  editUsers: async (
    idUser: string,
    data: { displayName?: string; password?: string; avatarUrl?: string; avatarId?: string; role?: string }
  ) => {
    const res = await authorizedAxiosInstance.put(`/users/user/${idUser}`, data)
    return res.data
  },
  deleteUsers: async (idUser: string) => {
    return await authorizedAxiosInstance.delete(`/del/${idUser}`)
  }
}
