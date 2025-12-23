import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["error", "active", "processing"],
      default: "processing",
      lowercase: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

categorySchema.virtual("blogs", {
  ref: "Blog",
  localField: "_id",
  foreignField: "category",
});

// Add index for better query performance
categorySchema.index({ status: 1 });
// categorySchema.index({ slug: 1 });

const Category = mongoose.model("Category", categorySchema);
export default Category;
