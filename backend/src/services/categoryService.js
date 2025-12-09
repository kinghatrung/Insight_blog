import Category from "../models/Category.js";
import { slugify } from "../utils/slugify.js";

const categoryService = {
  getCategories: async () => {
    try {
      const categories = await Category.find().populate("blogs");
      return categories;
    } catch (error) {
      throw error;
    }
  },
  createCategory: async (title, status) => {
    try {
      const slug = slugify(title);
      const category = await Category.findOne({ slug });
      if (category) throw new Error("Chủ đề này đã tồn tại");
      const newCategory = new Category({
        title,
        slug,
        status,
      });
      await newCategory.save();
      return newCategory;
    } catch (error) {
      throw error;
    }
  },
  editCategory: async (id, title, status) => {
    try {
      const category = await Category.findOne({ _id: id });
      if (!category) throw new Error("Thể loại không tồn tại");
      const updateData = {};
      if (title) {
        updateData.title = title;
        updateData.slug = slugify(title);
      }
      if (status !== undefined) updateData.status = status;
      const updatedCategory = await Category.findByIdAndUpdate(id, { $set: updateData }, { new: true });
      return updatedCategory;
    } catch (error) {
      throw error;
    }
  },
  deleteCategory: async (id) => {
    try {
      await Category.findByIdAndDelete({ _id: id });

      return true;
    } catch (error) {
      throw error;
    }
  },
};

export default categoryService;
