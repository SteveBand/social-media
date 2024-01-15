const mongoose = require("mongoose");
const { authGuard } = require("../middlewares/authGuard");
const { catchCookies } = require("../middlewares/catchCookies");
const { postSchema } = require("../schemas");
const { Post, UserModel, CommentModel } = require("../models/models");
const { fetchPost, fetchDashboardPosts } = require("../lib/aggregations");
module.exports = (app) => {
  const db = mongoose.connection.getClient();

  app.post("/new/post", authGuard, async (req, res) => {
    if (!req.userData) {
      return res
        .send({ message: "Unauthorized , please login to post" })
        .status(400);
    }
    const postBody = req.body;
    const userData = req.userData;
    const obj = {
      ...postBody,
      parentId: userData.email,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
    };
    const validation = postSchema.validate(postBody, { abortEarly: true });

    if (validation.error !== undefined) {
      return res.status(400).send({ message: "malware" });
    }

    await Post(obj).save();

    res.send({ message: "Post successfully created" }).status(200);
  });

  app.get("/posts", catchCookies, async (req, res) => {
    try {
      const userData = req.userData;
      const posts = await Post.aggregate(fetchDashboardPosts(userData.email));
      console.log(posts);
      return res.send(posts).status(200);
    } catch (error) {
      console.log("An error has occured at /posts", error);
      return res.send({ message: "An error has occured", error }).status(500);
    }
  });

  app.get("/post/:postId", async (req, res) => {
    const params = req.params.postId;
    if (!params) {
      return res.send("Bad Request").status(400);
    }
    try {
      const obj = await Post.aggregate(fetchPost(params));
      console.log(obj);
      return res.send(obj.pop()).status(200);
    } catch (err) {
      console.log("Post not Found: ");
      return res.send({ message: "Error 404, Page not found!" }).status(404);
    }
  });
};
