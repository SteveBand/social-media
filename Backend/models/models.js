const mongoose = require("mongoose");

/// Likes Model + Schema

const likesSchema = new mongoose.Schema({
  parentId: {
    type: mongoose.Types.ObjectId,
    lowercase: true,
    index: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    lowercase: true,
    index: true,
  },
  authorId: mongoose.Types.ObjectId,
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
    followers: {
      type: Number,
      default: 0,
    },
    following: {
      type: Number,
      default: 0,
    },
    githubId: String,
    facebookId: String,
    googleId: String,
    admin: Boolean,
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
      required: true,
    },
    parentId: {
      type: mongoose.Types.ObjectId,
      index: {
        unique: true,
      },
      required: true,
      lowercase: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    sharesCount: {
      type: Number,
      default: 0,
    },
    isPost: {
      type: Boolean,
      default: true,
    },
    communityId: {
      type: mongoose.Types.ObjectId,
      index: true,
      required: false,
    },
    authorId: {
      type: mongoose.Types.ObjectId,
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
      type: mongoose.Types.ObjectId,
      index: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      index: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    sharesCount: {
      type: Number,
      default: 0,
    },
    isComment: {
      type: Boolean,
      default: true,
    },
    authorId: mongoose.Types.ObjectId,
  },
  { timestamps: true }
);

const CommentModel =
  mongoose.models.CommentModel || mongoose.model("comments", commentSchema);

const followersScehma = new mongoose.Schema(
  {
    parentId: {
      type: mongoose.Types.ObjectId,
    },
    follows: {
      type: mongoose.Types.ObjectId,
    },
  },
  { timestamps: true }
);

followersScehma.index({ parnetId: 1, follows: 1 });

const FollowersModel =
  mongoose.models.FollowersModel ||
  mongoose.model("followers", followersScehma);

///Community Model///
const communitySchema = new mongoose.Schema(
  {
    image: {
      type: String,
      defaultValue: "",
    },
    membersCount: {
      type: Number,
      default: 1,
    },
    postsCount: {
      type: Number,
      default: 0,
    },
    about: {
      type: String,
      index: {
        text: true,
      },
    },
    title: {
      type: String,
      index: {
        text: true,
      },
    },
    rules: {
      type: [
        {
          description: {
            type: String,
          },
          _id: String,
        },
      ],
      required: false,
      default: [],
    },
    admin: mongoose.Types.ObjectId,
    membership: String,
  },
  {
    timestamps: true,
  }
);

const Community =
  mongoose.models.communities || mongoose.model("communities", communitySchema);

const communityMemberSchema = new mongoose.Schema(
  {
    parentId: {
      type: mongoose.Types.ObjectId,
    },
    communityId: {
      type: mongoose.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

communityMemberSchema.index({ parentId: 1, communityId: 1 });

const CommunityMember =
  mongoose.models.communityMembers ||
  mongoose.model("communityMembers", communityMemberSchema);

exports.LikesModel = LikesModel;
exports.UserModel = UserModel;
exports.Post = Post;
exports.CommentModel = CommentModel;
exports.FollowersModel = FollowersModel;
exports.Community = Community;
exports.CommunityMember = CommunityMember;
