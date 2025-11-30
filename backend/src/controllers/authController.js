import authService from "../services/authService.js";
import ms from "ms";

const authController = {
  signIn: async (req, res) => {
    try {
      const { username, password } = req.body;
      const { user, accessToken, refreshToken } = await authService.signIn(username, password);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: ms("15m"),
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: ms("14d"),
      });

      res.status(200).json({ message: `Người dùng ${user.displayName} đăng nhập thành công!`, accessToken });
    } catch (error) {
      res.status(500).json("Lỗi hệ thống, vui lòng thử lại sau!");
      console.log({ message: error.message });
    }
  },

  signUp: async (req, res) => {
    try {
      const { username, password, email, firstName, lastName } = req.body;
      await authService.signUp(username, password, email, firstName, lastName);

      res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
      res.status(500).json("Lỗi hệ thống, vui lòng thử lại sau!");
      console.log({ message: error.message });
    }
  },

  signOut: async (req, res) => {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res.status(200).json({ message: "Đăng xuất thành công!" });
    } catch (error) {
      res.status(500).json("Lỗi hệ thống, vui lòng thử lại sau!");
      console.log({ message: error.message });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const token = req.cookies?.refreshToken;
      const accessToken = await authService.refreshToken(token);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: ms("15m"),
      });

      res.status(200).json({ accessToken });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

export default authController;
