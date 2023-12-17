import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  phoneNumber: String,
  gender: String,
  bio: String,
  avatar_url: String,
});

const UserModel = mongoose.models.users || mongoose.model("users", userSchema);

export default UserModel;
