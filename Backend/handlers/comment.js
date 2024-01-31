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
          { _id: req.params.parentId },
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
    const postId = new mongoose.Types.ObjectId(req.params.postId);
    const userId = req.user ? new mongoose.Types.ObjectId(req.user._id) : null;
    try {
      if (!userId) {
        const comments = await CommentModel.aggregate(fetchComments(postId));
        return res.send(comments).status(200);
      } else {
        const comments = await CommentModel.aggregate(
          fetchCommentsLogged(postId, userId)
        );
        console.log(comments);
        return res.send(comments).status(200);
      }
    } catch (err) {
      return res.send({ message: "an error has occured", err });
    }
  });

  app.get(
    "/comment/post/:postId",
    /*catchCookies,*/ async (req, res) => {
      const postId = req.params.postId;
      const userId = req.userData.email;
      try {
        if (userId) {
          const obj = await CommentModel.aggregate(
            fetchCommentPost(postId, req.userData.email)
          );
          console.log(obj);
          return res.send(obj.pop()).status(200);
        } else if (!userId) {
          const obj = await CommentModel.aggregate(
            fetchCommentPost(postId, req.userData.email)
          );
          console.log(obj);
          return res.send(obj.pop()).status(200);
        }
      } catch (err) {
        console.log("An error has Occured at /comment/post/:postId", err);
        return res.send({ message: "An error has Occured", ErrorMessage: err });
      }
    }
  );
};
