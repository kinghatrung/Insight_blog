import Category from "../models/Category.js";
import Blog from "../models/Blog.js";
import { slugify } from "../utils/slugify.js";
import { parseDDMMYYYY } from "../utils/parseDDMMYYYY.js";

const categoryService = {
  getCategories: async (page = 1, pageSize = 5, filters = {}) => {
    try {
      const { title, status, startTime, endTime } = filters;
      const query = {};

      if (title) {
        query.title = { $regex: title, $options: "i" };
      }

      if (status) {
        query.status = status;
      }

      if (startTime && endTime) {
        const start = parseDDMMYYYY(startTime);
        const end = parseDDMMYYYY(endTime);
        end.setHours(23, 59, 59, 999);

        query.createdAt = { $gte: start, $lte: end };
      }

      const skip = (page - 1) * pageSize;
      const total = await Category.countDocuments(query);

      const categories = await Category.find(query)
        .populate("blogs")
        // .populate({
        //   path: "blogs",
        //   select: "title",
        // })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean();

      return {
        data: categories,
        total,
      };
    } catch (error) {
      throw error;
    }
  },
  getCategoriesActive: async () => {
    try {
      const categories = await Category.find({ status: "active" }).populate("blogs");
      return categories;
    } catch (error) {
      throw error;
    }
  },
  getCategoryBySlug: async (slugCategory) => {
    try {
      const category = await Category.findOne({ slug: slugCategory }).lean();

      const blogs = await Blog.find({ category: category._id })
        .populate({ path: "author", select: "avatarUrl" })
        .populate({ path: "category", select: "title" })
        .lean();

      category.blogs = blogs;

      return category;
    } catch (error) {
      throw error;
    }
  },
  createCategory: async (title, status, description) => {
    try {
      const slug = slugify(title);
      const category = await Category.findOne({ slug });
      if (category) throw new Error("Chủ đề này đã tồn tại");
      const newCategory = new Category({
        title,
        slug,
        status,
        description,
      });
      await newCategory.save();
      return newCategory;
    } catch (error) {
      throw error;
    }
  },
  editCategory: async (id, title, status, description) => {
    try {
      const category = await Category.findOne({ _id: id });
      if (!category) throw new Error("Thể loại không tồn tại");
      const updateData = {};
      if (title) {
        updateData.title = title;
        updateData.slug = slugify(title);
      }
      if (description) updateData.description = description;
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
