const mongoose = require("mongoose");

/// Likes Model + Schema

const likesSchema = new mongoose.Schema({
  parentId: String,
  userId: String,
});
const LikesModel =
  mongoose.models.LikesModel || mongoose.model("likes", likesSchema);

/// User Model + Schema

const userSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    name: String,
    phoneNumber: String,
    gender: String,
    bio: String,
    avatar_url: String,
    followers: Number,
    following: Number,
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.models.users || mongoose.model("users", userSchema);

/// Post Model + Schema

const postSchema = new mongoose.Schema(
  {
    content: String,
    parentId: String,
    date: String,
    likesCount: Number,
    commentsCount: Number,
    sharesCount: Number,
    isPost: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model("posts", postSchema);

/// Comment Model + Schema

const commentSchema = new mongoose.Schema(
  {
    content: String,
    parentId: String,
    userId: String,
    likesCount: Number,
    commentsCount: Number,
    sharesCount: Number,
    isComment: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const CommentModel =
  mongoose.models.CommentModel || mongoose.model("comments", commentSchema);

const followersScehma = new mongoose.Schema(
  {
    parnetId: String,
    following: String,
  },
  { timestamps: true }
);

const FollowersModel =
  mongoose.model.FollowersModel || mongoose.model("followers", followersScehma);

exports.LikesModel = LikesModel;
exports.UserModel = UserModel;
exports.Post = Post;
exports.CommentModel = CommentModel;
exports.FollowersModel = FollowersModel;
