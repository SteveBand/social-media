const {
  fetchComments,
  fetchCommentsLogged,
  fetchCommentPost,
  fetchPost,
} = require("../lib/aggregations/comments/aggregations");
const { authGuard } = require("../middlewares/authGuard");
const { CommentModel, Post, UserModel } = require("../models/models");
const mongoose = require("mongoose");

module.exports = (app) => {
  app.post("/new/comment/:parentId", authGuard, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.parentId)) {
      return res.status(404).send({ message: "Bad Request" });
    }
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const parentId = new mongoose.Types.ObjectId(req.params.parentId);
    const target = req.body.target;
    const comment = {
      content: req.body.params,
      parentId,
      userId,
    };

    try {
      /// if post is being commented
      if (target === "post") {
        comment.origin = parentId;

        const existingPost = await Post.findById(parentId);
        if (!existingPost) {
          return res.send({ message: "404 Post not Found" }).status(404);
        }

        await Post.findOneAndUpdate(
          { _id: parentId },
          { $inc: { __v: 1, commentsCount: 1 } }
        );
      } else if (target === "comment") {
        const existingComment = await CommentModel.findById(parentId);
        /// checks for exisinting comment to avoid duplicates
        if (!existingComment) {
          return res.send({ message: "404 Comment not Found" }).status(404);
        }
        comment.origin = existingComment.origin;
        ///updates Parent commentsCount field
        await CommentModel.findOneAndUpdate(
          { _id: parentId },
          { $inc: { __v: 1, commentsCount: 1 } }
        );
      }

      const newComment = await new CommentModel(comment).save();
      const user_info = await UserModel.findById(userId);

      delete newComment.parentId;
      delete newComment.userId;

      delete user_info.password;

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
      if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
        return res.status(404).send({ message: "Bad Request" });
      }

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
        return res.status(200).send(comments);
      }
    } catch (err) {
      console.log("An error has occurred at /comments/:postId", err);
      return res.status(500).send({ message: "an error has occured" });
    }
  });

  app.get("/comment/:postId", async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
        return res.status(404).send({ message: "Bad Request" });
      }
      const postId = new mongoose.Types.ObjectId(req.params.postId);
      const userId = req.user
        ? new mongoose.Types.ObjectId(req.user._id)
        : null;

      if (userId) {
        const obj = await CommentModel.aggregate(
          fetchCommentPost(postId, userId)
        );

        return res.status(200).send(obj.pop());
      } else if (!userId) {
        const obj = await CommentModel.aggregate(fetchCommentPost(postId));

        return res.status(200).send(obj.pop());
      }
    } catch (err) {
      console.log("An error has Occured at /comment/:postId", err);

      return res.status(500).send({ message: "An error has Occured" });
    }
  });

  app.delete("/comment/:commentId/delete", authGuard, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
      return res.status(404).send({ message: "Bad Request" });
    }
    const user = req.user;
    const commentId = new mongoose.Types.ObjectId(req.params.commentId);

    try {
      const comment = await CommentModel.findById(commentId);
      ///checks if logged User is admin or creator of comment
      if (
        !comment.userId.equals(
          new mongoose.Types.ObjectId(user._id) || !user.admin
        )
      ) {
        return res.status(401).send({ message: "Unauthorized" });
      }
      ///finds the comment and deleting
      await CommentModel.findOneAndDelete({ _id: commentId });
      return res.status(200).send({ message: "Delete Success" });
    } catch (error) {
      console.log("An error has occurred at /post/:postId/delete", error);
      return res.status(500).send({ message: "An error has occurred" });
    }
  });
};
