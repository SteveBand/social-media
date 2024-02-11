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
const { Post, LikesModel, CommentModel } = require("../models/models");

module.exports = (app) => {
  app.post("/new/post", authGuard, async (req, res) => {
    const postBody = req.body;
    const user = req.user;
    // Creating new object with post info and user Id as parentId
    const obj = {
      ...postBody,
      parentId: new mongoose.Types.ObjectId(user._id),
    };

    // validating and checking if its valid if not return code 400

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
        return res.status(200).send(posts);
      }
    } catch (error) {
      console.log("An error has occured at /posts", error);
      return res.send({ message: "An error has occured", error }).status(500);
    }
  });

  app.get("/post/:postId", async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return res.status(404).send({ message: "Bad Request" });
    }

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

  app.delete("/post/:postId/delete", authGuard, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return res.status(404).send({ message: "Bad Request" });
    }

    const user = req.user;
    const postId = new mongoose.Types.ObjectId(req.params.postId);

    try {
      const post = await Post.findById(postId);

      ///if niether of conditions is true, user is creator of post or is admin then return 401 Unauthorized

      if (
        !user.admin &&
        !post.parentId.equals(new mongoose.Types.ObjectId(user._id))
      ) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      /// Deletes anything that connected to the deleted post

      await Post.findOneAndDelete({ _id: postId });
      await LikesModel.deleteMany({ origin: postId });
      await CommentModel.deleteMany({ origin: postId });
      return res.status(200).send({ message: "Delete Success" });
    } catch (error) {
      console.log("An error has occurred at /post/:postId/delete", error);
      return res.status(500).send({ message: "An error has occurred" });
    }
  });

  app.put("/post/:postId", authGuard, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return res.status(404).send({ message: "Bad Request" });
    }

    const userId = new mongoose.Types.ObjectId(req.user._id);
    const postId = new mongoose.Types.ObjectId(req.params.postId);
    const content = req.body.content;
    try {
      const post = await Post.findById(postId);

      //if post does not exist return 404

      if (!post) {
        return res.status(404).send({ message: "Post not found!" });
      }

      //if loggedUser is not the creator then return 401 Unauthorized, checks to see post.parentId and logged user id
      if (!post.parentId.equals(userId)) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      // updates the post

      await Post.findOneAndUpdate({ _id: postId }, { content: content });

      return res.status(200).send({ message: "success" });
    } catch (error) {
      console.log("An error has occurred at /post/:postId method put", error);
      return res.status(500).send({ message: "Something went wrong" });
    }
  });
};
