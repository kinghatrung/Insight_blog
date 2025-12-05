import authorizedAxiosInstance from '~/utils/authorizedAxios'

export const uploadService = {
  upload: async (file: File) => {
    const formData = new FormData()
    formData.append('thumbnail', file)
    const res = await authorizedAxiosInstance.post(`/upload`, formData)
    return res.data
  },
  deleteImage: async (publicId: string) => {
    const publicIdEncoded = encodeURIComponent(publicId)
    const res = await authorizedAxiosInstance.delete(`/upload/del/${publicIdEncoded}`)
    return res.data
  }
}
