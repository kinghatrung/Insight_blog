import cloudinary from "../config/cloudinary.js";

const uploadService = {
  uploadImages: async (file) => {
    try {
      if (!file) {
        throw new Error("Không có ảnh nào được upload");
      }
      const streamUpload = (buffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: process.env.CLOUDINARY_FOLDER_NAME,
              format: "webp",
              resource_type: "image",
              quality: "auto:good",
            },
            (error, result) => {
              if (result) resolve(result);
              else {
                reject(error);
              }
            }
          );
          stream.end(buffer);
        });

      const result = await streamUpload(file.buffer);
      return result.secure_url;
    } catch (error) {
      console.error("LỖI CLOUDINARY:", error);
      throw error;
    }
  },
};

export default uploadService;
