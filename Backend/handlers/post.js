const mongoose = require("mongoose");
const { authGuard } = require("../middlewares/authGuard");
const { postSchema } = require("../schemas");
const {
  fetchDashboardPostsLogged,
  fetchPostLogged,
} = require("../lib/aggregations/posts/logged");
const {
  fetchDashboardPostsUnLogged,
  fetchPostUnLogged,
} = require("../lib/aggregations/posts/unlogged");
const { Post } = require("../models/models");

module.exports = (app) => {
  app.post("/new/post", authGuard, async (req, res) => {
    const postBody = req.body;
    const user = req.user;

    const obj = {
      ...postBody,
      parentId: new mongoose.Types.ObjectId(user._id),
    };

    const validation = postSchema.validate(postBody, { abortEarly: true });

    if (validation.error !== undefined) {
      return res.status(400).send({ message: "malware" });
    }

    await Post(obj).save();

    return res.status(200).send({ message: "Post successfully created" });
  });

  app.get("/posts", async (req, res) => {
    const userId = req.user?._id
      ? new mongoose.Types.ObjectId(req.user._id)
      : null;
    try {
      if (userId) {
        const posts = await Post.aggregate(fetchDashboardPostsLogged(userId));
        return res.send(posts).status(200);
      } else {
        const posts = await Post.aggregate(fetchDashboardPostsUnLogged());
        console.log("not Logged");
        return res.status(200).send(posts);
      }
    } catch (error) {
      console.log("An error has occured at /posts", error);
      return res.send({ message: "An error has occured", error }).status(500);
    }
  });

  app.get("/post/:postId", async (req, res) => {
    const postId = new mongoose.Types.ObjectId(req.params.postId);
    const userId = req.user?._id
      ? new mongoose.Types.ObjectId(req.user._id)
      : null;

    try {
      if (userId) {
        const obj = await Post.aggregate(fetchPostLogged(postId, userId));
        return res.status(200).send(obj.pop());
      } else {
        const obj = await Post.aggregate(fetchPostUnLogged(postId));
        return res.status(200).send(obj.pop());
      }
    } catch (err) {
      console.log("Post not Found: ", err);
      return res.send({ message: "Error 404, Page not found!" }).status(404);
    }
  });

  app.post("/post/:postId/delete", authGuard, async (req, res) => {
    const user = req.user;
    const postId = new mongoose.Types.ObjectId(req.params.postId);

    try {
      const post = await Post.findById(postId);

      if (
        !post.parentId.equals(
          new mongoose.Types.ObjectId(user._id) || !user.admin
        )
      ) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      await Post.findOneAndDelete({ _id: postId });
      return res.status(200).send({ message: "Delete Success" });
    } catch (error) {
      console.log("An error has occurred at /post/:postId/delete", error);
      return res.status(500).send({ message: "An error has occurred" });
    }
  });
};
