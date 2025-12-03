import authorizedAxiosInstance from '~/utils/authorizedAxios'

export const userService = {
  fetchMe: async () => {
    const res = await authorizedAxiosInstance.get('/users/me')
    return res.data.user
  }
}
