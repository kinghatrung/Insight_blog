import multer from "multer";

// Lưu file trong memory thay vì disk
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

export default upload;
