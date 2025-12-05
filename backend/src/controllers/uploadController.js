import uploadService from "../services/uploadService.js";

const uploadController = {
  uploadImage: async (req, res) => {
    try {
      const file = req.file;
      const result = await uploadService.uploadImages(file);
      res.status(200).json({
        message: "Tải ảnh thành công",
        data: result,
      });
    } catch (error) {
      res.status(500).json({ message: "Tải ảnh thất bại" });
    }
  },

  deleteImage: async (req, res) => {
    try {
      const { publicId } = req.params;
      await uploadService.deleteImage(publicId);
      res.status(200).json({ message: "Xóa ảnh thành công" });
    } catch (error) {
      res.status(500).json({ message: "Xóa ảnh thất bại" });
    }
  },
};

export default uploadController;
