import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true, index: true },
  },
  { timestamps: true }
);

likeSchema.index({ blogId: 1, userId: 1 }, { unique: true });

const Like = mongoose.model("Like", likeSchema);
export default Like;
