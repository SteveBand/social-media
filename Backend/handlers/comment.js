const { fetchComments, fetchCommentsLogged } = require("../lib/aggregations");
const { authGuard } = require("../middlewares/authGuard");
const { catchCookies } = require("../middlewares/catchCookies");
const { CommentModel, Post, UserModel } = require("../models/models");

module.exports = (app) => {
  app.post("/new/comment/:parentId", authGuard, async (req, res) => {
    if (!req.body.params && !req.params.parentId && !req.userData) {
      return res.send({ message: "Bad Request" }).status(400);
    }
    const comment = {
      content: req.body.params,
      parentId: req.params.parentId,
      userId: req.userData.email,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
    };
    try {
      if (req.body.target === "post") {
        const existingPost = await Post.findById(req.params.parentId);
        if (!existingPost) {
          return res.send({ message: "404 Post not Found" }).status(404);
        }

        await Post.findOneAndUpdate(
          { _id: req.params.parentId },
          { $inc: { __v: 1, commentsCount: 1 } }
        );
      } else if (req.body.target === "comment") {
        const existingComment = await CommentModel.findById(
          req.params.parentId
        );
        if (!existingComment) {
          return res.send({ message: "404 Comment not Found" }).status(404);
        }

        await CommentModel.findOneAndUpdate(
          { _id: req.params.parentId },
          { $inc: { __v: 1, commentsCount: 1 } }
        );
      }
      const newComment = await new CommentModel(comment).save();
      const user_info = (
        await UserModel.find({ email: newComment.userId })
      ).pop();
      res.send({ ...newComment._doc, user_info }).status(200);
    } catch (err) {
      console.log(`Error: ${err.message}`);
      res
        .send({ message: "An error has Occured, try again later" })
        .status(404);
    }
  });

  app.get("/comments/:postId", catchCookies, async (req, res) => {
    const postId = req.params.postId;
    if (!req.userData) {
      const comments = await CommentModel.aggregate(fetchComments(postId));
      return res.send(comments).status(200);
    } else if (req.userData) {
      const comments = await CommentModel.aggregate(
        fetchCommentsLogged(postId, req.userData.email)
      );
      return res.send(comments).status(200);
    }
  });
};
