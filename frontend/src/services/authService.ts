import authorizedAxiosInstance from '~/utils/authorizedAxios'

export const authService = {
  login: async (username: string, password: string) => {
    const res = await authorizedAxiosInstance.post('/auth/signin', { username, password })
    return res.data
  },
  register: async (email: string, username: string, password: string, lastName: string, firstName: string) => {
    const res = await authorizedAxiosInstance.post('/auth/signup', {
      email,
      username,
      password,
      lastName,
      firstName
    })
    return res.data
  },
  logout: async () => {
    return await authorizedAxiosInstance.delete('/auth/signout')
  },
  refreshToken: async () => {
    const res = await authorizedAxiosInstance.post('/auth/refresh')
    return res.data.accessToken
  }
}
