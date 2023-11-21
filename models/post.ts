import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    parentId: String,
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.models.posts || mongoose.model("posts", postSchema);

export default PostModel;
