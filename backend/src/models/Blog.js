import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    thumbnail: { type: String },
    viewCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["error", "active", "processing"],
      default: "processing",
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
