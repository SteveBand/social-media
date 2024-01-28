const mongoose = require("mongoose");
const { authGuard } = require("../middlewares/authGuard");
const { catchCookies } = require("../middlewares/catchCookies");
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
    };
    const validation = postSchema.validate(postBody, { abortEarly: true });

    if (validation.error !== undefined) {
      return res.status(400).send({ message: "malware" });
    }

    await Post(obj).save();

    res.send({ message: "Post successfully created" }).status(200);
  });

  app.get("/posts", catchCookies, async (req, res) => {
    const userData = req.userData || null;
    console.log(userData);
    try {
      if (userData) {
        const posts = await Post.aggregate(
          fetchDashboardPostsLogged(userData.email)
        );
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

  app.get("/post/:postId", catchCookies, async (req, res) => {
    const postId = req.params.postId;
    const userData = req.userData || null;
    if (!postId) {
      return res.send("Bad Request").status(400);
    }
    try {
      if (userData) {
        const obj = await Post.aggregate(
          fetchPostLogged(postId, userData.email)
        );
        console.log(obj);
        return res.send(obj.pop()).status(200);
      } else {
        const obj = await Post.aggregate(fetchPostUnLogged(postId));
        console.log(obj);
        res.status(200).send(obj.pop());
      }
    } catch (err) {
      console.log("Post not Found: ");
      return res.send({ message: "Error 404, Page not found!" }).status(404);
    }
  });
};
