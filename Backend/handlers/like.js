const { authGuard } = require("../middlewares/authGuard");
const { LikesModel, Post, CommentModel } = require("../models/models");
const mongoose = require("mongoose");

module.exports = (app) => {
  app.post("/new/post/like", authGuard, async (req, res) => {
    /// checks if the query is valid and not a malware

    if (!mongoose.Types.ObjectId.isValid(req.query.postId)) {
      return res.status(404).send({ message: "Bad Request" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.query.author)) {
      return res.status(404).send({ message: "Bad Request" });
    }
    try {
      const postId = new mongoose.Types.ObjectId(req.query.postId);
      const userId = new mongoose.Types.ObjectId(req.user._id);
      const authorId = new mongoose.Types.ObjectId(req.query.author);
      /// creating the like document body
      const likeBody = { parentId: postId, userId, authorId };

      // checks if a like already exists to avoid duplicates
      const existingLike = await LikesModel.findOne(likeBody);
      // if like already exists return code 400 bad request
      if (existingLike) {
        return res.status(400).send({ message: "Already Liked" });
      }
      // check if liked Post exists if not return code 404
      const existingPost = await Post.findById(postId);

      if (!existingPost) {
        return res.status(404).send({ message: "404 Posts doesnt exist" });
      }

      /// update post likesCount field whenever liked
      await Post.updateOne(
        { _id: postId },
        { $inc: { __v: 1, likesCount: 1 } }
      );

      likeBody.origin = postId;

      // creates new like
      const newLike = await new LikesModel(likeBody).save();

      return res.status(200).send({ message: "Success" });
    } catch (err) {
      console.log("Falls within /new/like Route!", err);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  });

  app.post("/new/comment/like", authGuard, async (req, res) => {
    try {
      const postId = new mongoose.Types.ObjectId(req.query.postId);
      const userId = new mongoose.Types.ObjectId(req.user._id);
      const authorId = new mongoose.Types.ObjectId(req.query.author);

      const likeBody = { parentId: postId, userId, authorId };
      const existingLike = await LikesModel.findOne(likeBody);

      if (existingLike) {
        return res.status(400).send({ message: "Already Liked" });
      }

      const existingPost = await CommentModel.findById(postId);

      if (!existingPost) {
        return res.status(404).send({ message: "404 Posts doesnt exist" });
      }

      await CommentModel.updateOne(
        { _id: postId },
        { $inc: { __v: 1, likesCount: 1 } }
      );

      likeBody.origin = existingPost.origin;

      await new LikesModel(likeBody).save();
      return res.status(200).send({ message: "Success" });
    } catch (err) {
      console.log("Falls within /new/like Route!", err);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  });

  app.post("/delete/post/like", authGuard, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.query.postId)) {
      return res.status(404).send({ message: "Bad Request" });
    }
    try {
      const userId = new mongoose.Types.ObjectId(req.user._id);
      const postId = new mongoose.Types.ObjectId(req.query.postId);

      //updating post and lessering likesCount by 1

      const post = await Post.updateOne(
        { _id: postId },
        { $inc: { __v: 1, likesCount: -1 } }
      );
      // if 0 documents changed it means an error/didnt find the document then return code 400
      if (post.modifiedCount < 0) {
        return res.status(400).send({ message: "Bad Request" });
      }
      /// Deletes like
      const like = await LikesModel.deleteOne({
        parentId: postId,
        userId: userId,
      });
      ///Checks if like actually deleted
      if (like.deletedCount < 0) {
        return res.status(400).send({ message: "Bad Request" });
      }
      return res.status(200).send({ message: "Success" });
    } catch (err) {
      console.log("Error Occured at Delete/like ROUTE!", err);
      return res.status(500).send({ message: "Error Occured!!!" });
    }
  });

  app.post("/delete/comment/like", authGuard, async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.user._id);
      const postId = new mongoose.Types.ObjectId(req.query.postId);

      const comment = await CommentModel.updateOne(
        { _id: postId },
        { $inc: { __v: 1, likesCount: -1 } }
      );

      if (comment.modifiedCount < 0) {
        return res.status(400).send({ message: "Bad Request" });
      }

      const like = await LikesModel.deleteOne({
        parentId: postId,
        userId: userId,
      });

      if (like.deletedCount < 0) {
        return res.status(400).send({ message: "Bad Request" });
      }

      return res.status(200).send({ message: "Success" });
    } catch (err) {
      console.log("Error Occured at Delete/like ROUTE!", err);
      return res.status(500).send({ message: "Error Occured!!!" });
    }
  });
};
