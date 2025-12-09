import categoryService from "../services/categoryService.js";

const categoryController = {
  getCategories: async (req, res) => {
    try {
      const categories = await categoryService.getCategories();

      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getCategoriesActive: async (req, res) => {
    try {
      const categories = await categoryService.getCategoriesActive();

      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  createCategory: async (req, res) => {
    try {
      const { title, status, description } = req.body;
      const category = await categoryService.createCategory(title, status, description);
      res.status(200).json({ category, message: `Tạo chủ đề ${category.title} thành công!` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  editCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, status, description } = req.body;
      const category = await categoryService.editCategory(id, title, status, description);
      res.status(200).json({ message: "Sửa thể loại thành công", category });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      await categoryService.deleteCategory(id);
      res.status(200).json({ message: "Xóa thể loại thành công" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default categoryController;
