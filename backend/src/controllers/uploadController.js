import uploadService from "../services/uploadService.js";

const uploadController = {
  uploadImage: async (req, res) => {
    try {
      const file = req.file;
      const results = await uploadService.uploadImages(file);
      res.status(200).json({
        message: "Tải ảnh thành công",
        data: results,
      });
    } catch (error) {
      res.status(500).json({ message: "Tải ảnh thất bại" });
    }
  },
};

export default uploadController;
