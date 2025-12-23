import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    hashPassword: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    displayName: { type: String, required: true, trim: true },
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
    role: { type: String, enum: ["custom", "admin"], default: "custom" },
    avatarUrl: { type: String },
    avatarId: { type: String },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ username: 1, email: 1 });

const User = mongoose.model("User", userSchema);
export default User;
