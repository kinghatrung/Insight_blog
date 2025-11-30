import bcrypt from "bcrypt";

import User from "../models/User.js";
import { generateToken, verifyToken } from "../providers/jwtProvider.js";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "14d";

const authService = {
  signIn: async (username, password) => {
    try {
      if (!username || !password) throw new Error("Vui lòng điền đầy đủ thông tin!");
      const user = await User.findOne({ username });
      if (!user) throw new Error("Tài khoản và mật khẩu không chính xác!");
      const passwordMatch = await bcrypt.compare(password, user.hashPassword);
      if (!passwordMatch) throw new Error("Tài khoản và mật khẩu không chính xác!");
      const accessToken = generateToken({ userId: user._id }, process.env.JWT_SECRET_TOKEN, ACCESS_TOKEN_TTL);
      const refreshToken = generateToken({ userId: user._id }, process.env.JWT_SECRET_TOKEN, REFRESH_TOKEN_TTL);

      return { user, accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  },

  signUp: async (username, password, email, firstName, lastName) => {
    try {
      if (!username || !password || !email || !firstName || !lastName)
        throw new Error("Vui lòng điền đầy đủ thông tin!");

      const user = await User.findOne({ username });
      const checkEmail = await User.findOne({ email });
      if (user) throw new Error("Tên đăng nhập đã tồn tại!");
      if (checkEmail) throw new Error("Email đã tồn tại!");

      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        username,
        hashPassword: hashedPassword,
        email,
        displayName: `${lastName} ${firstName}`,
      });

      return true;
    } catch (error) {
      throw error;
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const refreshTokenDecoded = verifyToken(refreshToken, process.env.JWT_SECRET_TOKEN);
      const accessToken = generateToken(
        { userId: refreshTokenDecoded.userId },
        process.env.JWT_SECRET_TOKEN,
        ACCESS_TOKEN_TTL
      );

      return accessToken;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
