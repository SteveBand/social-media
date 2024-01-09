const mongoose = require("mongoose");

/// Likes Model + Schema

const likesSchema = new mongoose.Schema({
  parentId: {
    type: String,
    lowercase: true,
    index: true,
  },
  userId: {
    type: String,
    lowercase: true,
    index: true,
  },
});
const LikesModel =
  mongoose.models.LikesModel || mongoose.model("likes", likesSchema);

/// User Model + Schema

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      index: { unique: true, text: true },
      lowercase: true,
    },
    password: String,
    name: {
      type: String,
      index: { text: true },
      lowercase: true,
    },
    phoneNumber: String,
    gender: String,
    bio: {
      type: String,
      index: { text: true },
    },
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
    content: {
      type: String,
      index: {
        text: true,
      },
    },
    parentId: {
      type: String,
      index: true,
      lowercase: true,
    },
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
    content: {
      type: String,
      index: {
        text: true,
      },
    },
    parentId: {
      type: String,
      index: true,
      lowercase: true,
    },
    userId: {
      type: String,
      lowercase: true,
    },
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
    parentId: {
      type: String,
      index: true,
      lowercase: true,
    },
    follows: {
      type: String,
      index: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const FollowersModel =
  mongoose.models.FollowersModel ||
  mongoose.model("followers", followersScehma);

///Community Model///
const communityModel = new mongoose.Schema({
  image: String,
  membersCount: Number,
  postsCount: 0,
  about: String,
  title: {
    type: String,
    index: {
      text: true,
      unique: true,
    },
  },
  rules: {
    type: [
      {
        id: Number,
        description: String,
        lowercase: true,
      },
    ],
    required: false,
  },
  topics: Array,
  moderatores: {
    type: [],
    lowercase: true,
  },
});

exports.LikesModel = LikesModel;
exports.UserModel = UserModel;
exports.Post = Post;
exports.CommentModel = CommentModel;
exports.FollowersModel = FollowersModel;
