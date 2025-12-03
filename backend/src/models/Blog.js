import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    content: { type: String, required: true },
    thumbnail: { type: String },
    status: {
      type: String,
      enum: ["error", "active", "processing"],
      default: "processing",
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
