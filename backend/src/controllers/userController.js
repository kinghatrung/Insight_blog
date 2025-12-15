import userService from "../services/userService.js";

const userController = {
  authMe: async (req, res) => {
    try {
      const user = req.user;
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getUsers: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 5;

      const filters = {
        username: req.query.username || "",
        email: req.query.email || "",
        displayName: req.query.displayName || "",
        role: req.query.role || "",
        startTime: req.query.startTime || "",
        endTime: req.query.endTime || "",
      };

      const users = await userService.getUsers(page, pageSize, filters);

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  createUser: async (req, res) => {
    try {
      const { username, password, email, firstName, lastName, avatarUrl, avatarId } = req.body;
      await userService.createUser(username, password, email, firstName, lastName, avatarUrl, avatarId);

      res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  editUser: async (req, res) => {
    try {
      const idUser = req.params.id;
      const { displayName, password, avatarUrl, avatarId, role } = req.body;
      const user = await userService.editUser(idUser, displayName, password, avatarUrl, avatarId, role);
      res.status(200).json({ message: `Cập nhập người dùng ${user.displayName} thành công` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);
      res.status(200).json({ message: "Xóa người dùng thành công" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default userController;
