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
      required: true,
    },
    parentId: {
      type: String,
      index: true,
      lowercase: true,
      required: true,
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
      type: String,
      index: true,
      required: false,
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
      index: true,
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
      lowercase: true,
    },
    follows: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

followersScehma.index({ parnetId: 1, follows: 1 });

const FollowersModel =
  mongoose.models.FollowersModel ||
  mongoose.model("followers", followersScehma);

///Community Model///
const communitySchema = new mongoose.Schema({
  image: String,
  membersCount: Number,
  postsCount: Number,
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
        description: {
          type: String,
          lowercase: true,
        },
      },
    ],
    required: false,
  },
  topics: Array,
  moderatores: [
    {
      type: String,
      lowercase: true,
    },
  ],
});

const Community =
  mongoose.models.communities || mongoose.model("communities", communitySchema);

const communityMemberSchema = new mongoose.Schema(
  {
    parentId: String,
    communityId: String,
  },
  {
    timestamps: true,
  }
);

const CommunityMember =
  mongoose.models.communityMembers ||
  mongoose.model("communityMembers", communityMemberSchema);

// const CommunityPostSchema = new mongoose.Schema(
//   {
//     content: {
//       type: String,
//       index: { text: true },
//       lowercase: true,
//     },
//     parentId: {
//       type: String,
//       index: { text: true },
//     },
//     communityId: {
//       type: String,
//       index: true,
//     },
//     likesCount: {
//       type: Number,
//       default: 0,
//     },
//     commentsCount: {
//       type: Number,
//       default: 0,
//     },
//     sharesCount: {
//       type: Number,
//       default: 0,
//     },
//   },
//   { timestamps: true }
// );

// const CommunityPost =
//   mongoose.models.CommunityPosts ||
//   mongoose.model("communityPosts", CommunityPostSchema);

// const communityLikesSchema = {
//   parentId: String,
//   communityId: String,
//   postId: String,
// };

// const CommunityLike =
//   mongoose.models.communityLikes ||
//   mongoose.model("communityLikes", communityLikesSchema);

// const CommunityCommentSchema = new mongoose.Schema(
//   {
//     content: {
//       type: String,
//       index: { text: true },
//     },
//     parentId: {
//       type: String,
//       index: true,
//     },
//     userId: {
//       type: String,
//       index: true,
//     },
//     communityId: String,
//     likesCount: {
//       type: Number,
//       default: 0,
//     },
//     commentsCount: {
//       type: Number,
//       default: 0,
//     },
//     sharesCount: {
//       type: Number,
//       default: 0,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const CommunityComment =
//   mongoose.models.CommunityComment ||
//   mongoose.model("communityComments", CommunityCommentSchema);

exports.LikesModel = LikesModel;
exports.UserModel = UserModel;
exports.Post = Post;
exports.CommentModel = CommentModel;
exports.FollowersModel = FollowersModel;
exports.Community = Community;
// exports.CommunityPost = CommunityPost;
exports.CommunityMember = CommunityMember;
// exports.CommunityLike = CommunityLike;
// exports.CommunityComment = CommunityComment;
