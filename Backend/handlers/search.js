const {
  fetchPostsLogged,
  fetchUsersLogged,
  fetchCommentsLogged,
} = require("../lib/aggregations/search/logged");
const {
  fetchPostsUnLogged,
  fetchCommentsUnLogged,
} = require("../lib/aggregations/search/unLogged");
const {
  Post,
  UserModel,
  CommentModel,
  Community,
} = require("../models/models");
const mongoose = require("mongoose");

module.exports = (app) => {
  app.get("/search/users", async (req, res) => {
    const userId = req.user ? new mongoose.Types.ObjectId(req.user._id) : null;
    const query = req.query.q;
    const regex = new RegExp(query, "i");
    try {
      if (query.length <= 2) {
        return res.status(400).send({ message: "Bad Request" });
      }
      if (userId) {
        const usersArr = await UserModel.aggregate(
          fetchUsersLogged(regex, userId)
        );
        return res.status(200).send(usersArr);
      } else {
        const usersArr = await UserModel.find({ name: regex }, { password: 0 });
        return res.status(200).send(usersArr);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Server error occured" });
    }
  });

  app.get("/search/posts", async (req, res) => {
    const userId = req.user ? new mongoose.Types.ObjectId(req.user._id) : null;
    const query = req.query.q;
    const regex = new RegExp(query, "i");

    try {
      if (userId) {
        const postsArr = await Post.aggregate(fetchPostsLogged(regex, userId));
        return res.status(200).send(postsArr);
      } else {
        const postsArr = await Post.aggregate(fetchPostsUnLogged(regex));
        return res.status(200).send(postsArr);
      }
    } catch (error) {
      console.log("/search/posts error path", error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  });

  app.get("/search/comments", async (req, res) => {
    const userId = req.user ? new mongoose.Types.ObjectId(req.user._id) : null;
    const query = req.query.q;
    const regex = new RegExp(query, "i");
    try {
      if (userId) {
        const commentsArr = await CommentModel.aggregate(
          fetchCommentsLogged(regex, userId)
        );
        return res.status(200).send(commentsArr);
      } else {
        const commentsArr = await CommentModel.aggregate(
          fetchCommentsUnLogged(regex)
        );
        return res.status(200).send(commentsArr);
      }
    } catch (error) {
      console.log("An error has occurred at /search/comments", error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  });

  app.get("/search/communities", async (req, res) => {
    const query = req.query.q;
    const regex = new RegExp(query, "i");
    try {
      const communitiesArr = await Community.find({ title: regex });
      return res.status(200).send(communitiesArr);
    } catch (error) {
      console.log("An error has Occurred at /search/communities", error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  });
};
