import mongoose from "mongoose";

const saveSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound unique index để tránh save trùng
saveSchema.index({ blogId: 1, userId: 1 }, { unique: true });

const Save = mongoose.model("Save", saveSchema);

export default Save;
