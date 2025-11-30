import jwt from "jsonwebtoken";

export const generateToken = (userInfo, secretSignature, tokenLife) => {
  try {
    return jwt.sign(userInfo, secretSignature, {
      algorithm: "HS256",
      expiresIn: tokenLife,
    });
  } catch (error) {
    throw error;
  }
};

export const verifyToken = (token, secretSignature) => {
  try {
    return jwt.verify(token, secretSignature);
  } catch (error) {
    throw error;
  }
};
