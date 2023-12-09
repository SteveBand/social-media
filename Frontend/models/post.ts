import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  content: String,
  parentId: String,
  date: String,
});

const PostModel = mongoose.models.posts || mongoose.model("posts", postSchema);

export default PostModel;
