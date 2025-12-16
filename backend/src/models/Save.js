import mongoose from "mongoose";

const saveSchema = new mongoose.Schema(
  {
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

saveSchema.index({ blogId: 1, userId: 1 }, { unique: true }); // tránh save trùng

const Save = mongoose.model("Save", saveSchema);
export default Save;
