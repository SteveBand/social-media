const mongoose = require("mongoose");

/// Likes Model + Schema

const Schema = new mongoose.Schema({
  parentId: String,
  userId: String,
});
const LikesModel =
  mongoose.models.LikesModel || mongoose.model("likes", Schema);

/// User Model + Schema

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

/// Post Model + Schema

const schema = new mongoose.Schema({
  content: String,
  parentId: String,
  date: String,
});

const Post = mongoose.models.Post || mongoose.model("posts", schema);

exports.LikesModel = LikesModel;
exports.UserModel = UserModel;
exports.Post = Post;
