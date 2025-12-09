import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["error", "active", "processing"],
      default: "processing",
    },
  },
  { timestamps: true }
);

categorySchema.virtual("blogs", {
  ref: "Blog",
  localField: "_id",
  foreignField: "category",
});

categorySchema.set("toJSON", { virtuals: true });
categorySchema.set("toObject", { virtuals: true });

const Category = mongoose.model("Category", categorySchema);
export default Category;
