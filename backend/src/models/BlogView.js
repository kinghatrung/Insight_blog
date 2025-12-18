import mongoose from "mongoose";

const blogViewSchema = new mongoose.Schema(
  {
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
    ipAddress: { type: String },
    userAgent: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    viewedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

blogViewSchema.index({ blogId: 1, viewedAt: -1 });
blogViewSchema.index({ ipAddress: 1, blogId: 1, viewedAt: 1 });

const BlogView = mongoose.model("BlogView", blogViewSchema);
export default BlogView;
