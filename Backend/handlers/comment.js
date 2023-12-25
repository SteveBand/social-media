const { fetchComments } = require("../lib/aggregations");
const { authGuard } = require("../middlewares/authGuard");
const { catchCookies } = require("../middlewares/catchCookies");
const { CommentModel, Post } = require("../models/models");

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
      const existingPost = await Post.findById(req.params.parentId);
      if (!existingPost) {
        return res.send({ message: "404 Post not Found" }).status(404);
      }

      await Post.findOneAndUpdate(
        { _id: req.params.parentId },
        { $inc: { __v: 1, commentsCount: 1 } }
      );

      await new CommentModel(comment).save();

      res.send({ message: "Comment added successfully" }).status(200);
    } catch (err) {
      console.log(`Error: ${err.message}`);
      res
        .send({ message: "An error has Occured, try again later" })
        .status(404);
    }
  });

  app.get("/comments/:postId", catchCookies, async (req, res) => {
    const postId = req.params.postId;
    // const comments = await CommentModel.find({ parentId: postId });
    const comments = await CommentModel.aggregate(fetchComments(postId));
    console.log(comments);
    res.send(comments).status(200);
  });
};
