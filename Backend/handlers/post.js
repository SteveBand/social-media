const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authGuard } = require("../middlewares/authGuard");
const { catchCookies } = require("../middlewares/catchCookies");
const { postSchema } = require("../schemas");
const { Post, LikesModel } = require("../models/models");
const { postsIfNoUser, postsIfUserLogged } = require("../lib/aggregations");
module.exports = (app) => {
  const db = mongoose.connection.getClient();

  app.post("/new/post", authGuard, async (req, res) => {
    const postBody = req.body;
    const validation = postSchema.validate(postBody, { abortEarly: true });

    if (validation.error !== undefined) {
      return res.status(400).send({ message: "malware" });
    }

    await Post(postBody).save();

    res.send({ message: "Post successfully created" }).status(200);
  });

  app.get("/posts", catchCookies, async (req, res) => {
    if (req.access_token) {
      const userData = req.userData;
      const posts = await Post.aggregate(postsIfUserLogged(userData.email));
      res.send(posts).status(200);
    } else {
      const posts = await Post.aggregate(postsIfNoUser);
      res.send(posts).status(200);
    }
  });
};
