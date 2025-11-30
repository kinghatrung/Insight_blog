import User from "../models/User.js";
import { verifyToken } from "../providers/jwtProvider.js";

const authMiddleware = {
  isAuthorized: async (req, res, next) => {
    const accessTokenFromCookie = req.cookies?.accessToken;
    if (!accessTokenFromCookie) {
      res.status(401).json({ message: "Không tìm thấy Token!" });
      return;
    }
    try {
      const accessTokenDecoded = await verifyToken(accessTokenFromCookie, process.env.JWT_SECRET_TOKEN);
      const user = await User.findOne({ _id: accessTokenDecoded.userId }).select("-hashPassword");
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng!" });
      }
      req.jwtDecoded = accessTokenDecoded;
      req.user = user;
      next();
    } catch (error) {
      // Token thông báo đã hết hạn
      // if (error.message?.includes("jwt expired")) return res.status(410).json({ message: "Token expired" });

      if (error.name === "TokenExpiredError" || error.message?.includes("jwt expired")) {
        return res.status(410).json({ message: "Token expired" });
      }

      // "message": "Token không hợp lệ hoặc đã hết hạn!"
      res.status(401).json({ message: "Unauthorized" });
    }
  },
};

export default authMiddleware;
