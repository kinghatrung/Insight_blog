import { parseDDMMYYYY } from "../utils/parseDDMMYYYY.js";
import bcrypt from "bcrypt";

import User from "../models/User.js";

const userService = {
  getUsers: async (page = 1, pageSize = 5, filters = {}) => {
    try {
      const { username, email, displayName, role, startTime, endTime } = filters;
      const query = {};

      if (username) {
        query.username = { $regex: username, $options: "i" };
      }
      if (email) {
        query.email = { $regex: email, $options: "i" };
      }
      if (displayName) {
        query.displayName = { $regex: displayName, $options: "i" };
      }
      if (role) {
        query.role = { $regex: role, $options: "i" };
      }
      if (startTime && endTime) {
        const start = parseDDMMYYYY(startTime);
        const end = parseDDMMYYYY(endTime);
        end.setHours(23, 59, 59, 999);

        query.createdAt = { $gte: start, $lte: end };
      }
      const skip = (page - 1) * pageSize;
      const total = await User.countDocuments(query);
      const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean();

      return {
        data: users,
        total,
      };
    } catch (error) {
      throw error;
    }
  },
  createUser: async (username, password, email, firstName, lastName, avatarUrl, avatarId) => {
    try {
      const user = await User.findOne({ $or: [{ username }, { email }] });
      if (user) throw new Error("Username hoặc email đã tồn tại!");

      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        username,
        hashPassword: hashedPassword,
        email,
        displayName: `${lastName} ${firstName}`,
        avatarUrl,
        avatarId,
      });

      return true;
    } catch (error) {
      throw error;
    }
  },
  editUser: async (idUser, displayName, password, avatarUrl, avatarId, role) => {
    try {
      const updateData = {};
      if (displayName) {
        updateData.displayName = displayName;
      }

      if (avatarUrl) updateData.avatarUrl = avatarUrl;
      if (avatarId) updateData.avatarId = avatarId;

      if (role) {
        updateData.role = role;
      }
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.hashPassword = hashedPassword;
      }
      const updateUser = await User.findByIdAndUpdate(idUser, { $set: updateData }, { new: true, runValidators: true });
      if (!updateUser) throw new Error("Người dùng không tồn tại");
      return updateUser;
    } catch (error) {
      throw error;
    }
  },
  deleteUser: async (id) => {
    try {
      await User.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;
