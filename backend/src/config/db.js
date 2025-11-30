import mongoose from "mongoose";

export const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECT_URL);
    console.log("Kết nối đến database MongoDB Atlas thành công");
  } catch (error) {
    console.log("Lỗi kết nối đến database", error);
    process.exit(1);
  }
};
