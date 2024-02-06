const {
  fetchComments,
  fetchCommentsLogged,
  fetchCommentPost,
  fetchPost,
} = require("../lib/aggregations");
const { authGuard } = require("../middlewares/authGuard");
const { CommentModel, Post, UserModel } = require("../models/models");
const mongoose = require("mongoose");

module.exports = (app) => {
  app.post("/new/comment/:parentId", authGuard, async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const parentId = new mongoose.Types.ObjectId(req.params.parentId);

    const comment = {
      content: req.body.params,
      parentId,
      userId,
    };

    try {
      if (req.body.target === "post") {
        const existingPost = await Post.findById(parentId);
        if (!existingPost) {
          return res.send({ message: "404 Post not Found" }).status(404);
        }

        await Post.findOneAndUpdate(
          { _id: parentId },
          { $inc: { __v: 1, commentsCount: 1 } }
        );
      } else if (req.body.target === "comment") {
        const existingComment = await CommentModel.findById(parentId);

        if (!existingComment) {
          return res.send({ message: "404 Comment not Found" }).status(404);
        }

        await CommentModel.findOneAndUpdate(
          { _id: parentId },
          { $inc: { __v: 1, commentsCount: 1 } }
        );
      }
      const newComment = await new CommentModel(comment).save();
      const user_info = await UserModel.findById(userId);

      delete newComment.parentId;
      delete newComment.userId;

      return res.send({ ...newComment._doc, user_info }).status(200);
    } catch (err) {
      console.log(`Error: ${err.message}`);
      res
        .send({ message: "An error has Occured, try again later" })
        .status(404);
    }
  });

  app.get("/comments/:postId", async (req, res) => {
    try {
      const postId = new mongoose.Types.ObjectId(req.params.postId);
      const userId = req.user
        ? new mongoose.Types.ObjectId(req.user._id)
        : null;

      if (!userId) {
        const comments = await CommentModel.aggregate(fetchComments(postId));
        return res.send(comments).status(200);
      } else {
        const comments = await CommentModel.aggregate(
          fetchCommentsLogged(postId, userId)
        );
        return res.send(comments).status(200);
      }
    } catch (err) {
      return res.send({ message: "an error has occured", err });
    }
  });

  app.get("/comment/:postId", async (req, res) => {
    try {
      const postId = new mongoose.Types.ObjectId(req.params.postId);
      const userId = req.user
        ? new mongoose.Types.ObjectId(req.user._id)
        : null;

      if (userId) {
        const obj = await CommentModel.aggregate(
          fetchCommentPost(postId, userId)
        );

        return res.send(obj.pop()).status(200);
      } else if (!userId) {
        const obj = await CommentModel.aggregate(fetchCommentPost(postId));

        return res.send(obj.pop()).status(200);
      }
    } catch (err) {
      console.log("An error has Occured at /comment/:postId", err);

      return res.send({ message: "An error has Occured", ErrorMessage: err });
    }
  });

  app.delete("/comment/:commentId/delete", authGuard, async (req, res) => {
    const user = req.user;
    const commentId = new mongoose.Types.ObjectId(req.params.commentId);

    try {
      const comment = await CommentModel.findById(commentId);

      if (
        !comment.userId.equals(
          new mongoose.Types.ObjectId(user._id) || !user.admin
        )
      ) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      await CommentModel.findOneAndDelete({ _id: commentId });
      return res.status(200).send({ message: "Delete Success" });
    } catch (error) {
      console.log("An error has occurred at /post/:postId/delete", error);
      return res.status(500).send({ message: "An error has occurred" });
    }
  });
};
