const { authGuard } = require("../middlewares/authGuard");
const { LikesModel, Post, CommentModel } = require("../models/models");
const mongoose = require("mongoose");

module.exports = (app) => {
  app.post("/new/post/like", authGuard, async (req, res) => {
    try {
      const postId = new mongoose.Types.ObjectId(req.body._id);
      const userId = new mongoose.Types.ObjectId(req.user._id);

      const likeBody = { parentId: postId, userId };
      const existingLike = await LikesModel.findOne(likeBody);

      if (existingLike) {
        return res.status(400).send({ message: "Already Liked" });
      }

      const existingPost = await Post.findById(postId);

      if (!existingPost) {
        return res.status(404).send({ message: "404 Posts doesnt exist" });
      }

      await Post.updateOne(
        { _id: postId },
        { $inc: { __v: 1, likesCount: 1 } }
      );

      const newLike = await new LikesModel(likeBody).save();

      return res.status(200).send({ message: "Success" });
    } catch (err) {
      console.log("Falls within /new/like Route!");
      return res.status(500).send({ message: "Internal Server Error" });
    }
  });

  app.post("/new/comment/like", authGuard, async (req, res) => {
    try {
      const { _id } = req.body;
      const userData = req.userData;
      const likeBody = { parentId: _id, userId: userData.email };
      const existingLike = await LikesModel.findOne(likeBody);

      if (existingLike) {
        return res.status(400).send({ message: "Already Liked" });
      }

      const existingPost = await CommentModel.findOne({ _id });

      if (!existingPost) {
        return res.status(404).send({ message: "404 Posts doesnt exist" });
      }

      await CommentModel.updateOne(
        { _id },
        { $inc: { __v: 1, likesCount: 1 } }
      );

      await new LikesModel(likeBody).save();
      return res.status(200).send({ message: "Success" });
    } catch (err) {
      console.log("Falls within /new/like Route!");
      return res.status(500).send({ message: "Internal Server Error" });
    }
  });

  app.post("/delete/post/like", authGuard, async (req, res) => {
    try {
      const userData = req.userData;
      const post = await Post.updateOne(
        { _id: req.body._id },
        { $inc: { __v: 1, likesCount: -1 } }
      );
      if (post.modifiedCount < 0) {
        return res.status(400).send({ message: "Bad Request" });
      }
      const like = await LikesModel.deleteOne({
        parentId: req.body._id,
        userId: userData.email,
      });
      if (like.deletedCount < 0) {
        return res.status(400).send({ message: "Bad Request" });
      }
      return res.status(200).send({ message: "Success" });
    } catch (err) {
      console.log("Error Occured at Delete/like ROUTE!");
      return res.status(500).send({ message: "Error Occured!!!" });
    }
  });

  app.post("/delete/comment/like", authGuard, async (req, res) => {
    try {
      const userData = req.userData;
      const comment = await CommentModel.updateOne(
        { _id: req.body._id },
        { $inc: { __v: 1, likesCount: -1 } }
      );

      if (comment.modifiedCount < 0) {
        return res.status(400).send({ message: "Bad Request" });
      }

      const like = await LikesModel.deleteOne({
        parentId: req.body._id,
        userId: userData.email,
      });

      if (like.deletedCount < 0) {
        return res.status(400).send({ message: "Bad Request" });
      }

      return res.status(200).send({ message: "Success" });
    } catch (err) {
      console.log("Error Occured at Delete/like ROUTE!");
      res.status(500).send({ message: "Error Occured!!!" });
    }
  });
};
