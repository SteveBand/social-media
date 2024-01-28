const {
  getUserFollowingLogged,
  getUserFollowersLogged,
  userAllLikedLogged,
  userCommentsLogged,
  userPostsLogged,
} = require("../lib/aggregations/user/logged");
const {
  getUserFollowingUnlogged,
  getUserFollowersUnLogged,
  userAllLikedUnLogged,
} = require("../lib/aggregations/user/unLogged");
const { catchCookies } = require("../middlewares/catchCookies");
const {
  UserModel,
  FollowersModel,
  Post,
  LikesModel,
  CommentModel,
} = require("../models/models");
const bcrypt = require("bcrypt");

module.exports = (app) => {
  app.get("/profile/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
      const user = await UserModel.findOne({ email: userId });
      if (!user) {
        return res.status(404).send({ message: "User not Found" });
      } else {
        return res.status(200).send(user);
      }
    } catch (error) {
      console.log("an error has Occured at /profile/:userId", error);
      return res.status(500).send({ message: "An error has occured" });
    }
  });

  app.get("/:user/posts", catchCookies, async (req, res) => {
    const userId = req.params.user;
    const loggedUserId = req.userData?.email || null;

    if (!userId) {
      return res.send({ message: "User not Found!" }).status(404);
    }
    try {
      if (loggedUserId) {
        const postArr = await Post.aggregate(
          userPostsLogged(userId, loggedUserId)
        );
        return res.status(200).send(postArr);
      } else {
        const postArr = await Post.find({ parentId: userId });
        return res.status(200).send(postArr);
      }
    } catch (error) {
      console.log("An error has Occured at /:user/posts", error);
      return res.status(500).send({ message: "An error has occured" });
    }
  });

  app.get("/:user/likes", catchCookies, async (req, res) => {
    const userId = req.params.user;
    const loggedUserId = req?.userData?.email || "";
    if (!userId) {
      return res.send({ message: "User not Found!" }).status(404);
    }
    try {
      if (loggedUserId !== "") {
        const obj = await LikesModel.aggregate(
          userAllLikedLogged(userId, loggedUserId)
        );
        return res.status(200).send(obj);
      } else {
        const obj = await LikesModel.aggregate(userAllLikedUnLogged(userId));
        return res.status(200).send(obj);
      }
    } catch (err) {
      console.log("An error occured at /:user/likes ", err.name);
      return res.send({ message: "An error has occured try again later" });
    }
  });

  app.get("/:user/comments", catchCookies, async (req, res) => {
    const userId = req.params.user;
    const loggedUserId = req.userData?.email || "";
    if (!userId) {
      return res.send({ message: "User not found!" }).status(404);
    }
    try {
      if (loggedUserId !== "") {
        const obj = await CommentModel.aggregate(
          userCommentsLogged(userId, loggedUserId)
        );
        console.log(obj);
        return res.status(200).send(obj);
      } else {
        const obj = await CommentModel.find({ userId: userId });
        return res.status(200).send(obj);
      }
    } catch (err) {
      console.log("An error occured at /:user/comments", err);
      return res.send({ message: "An error has occured try again later" });
    }
  });

  app.get("/:user/followers", catchCookies, async (req, res) => {
    const userId = req.params.user;
    const loggedUserId = req.userData?.email || "";

    if (!userId) {
      return res.send({ message: "User not Found!" });
    }

    try {
      if (loggedUserId !== "") {
        const obj = await FollowersModel.aggregate(
          getUserFollowersLogged(userId, loggedUserId)
        );
        return res.status(200).send(obj);
      } else {
        const obj = await FollowersModel.aggregate(
          getUserFollowersUnLogged(userId)
        );
        return res.send(obj).status(200);
      }
    } catch (err) {
      console.log("An error occured at /:user/followers", err.name);
      return res.send({ message: "An error has Occured" }).status(400);
    }
  });

  app.get("/:user/following", catchCookies, async (req, res) => {
    const userId = req.params.user;
    const loggedUserId = req.userData?.email || "";
    if (!userId) {
      return res.send({ message: "User not found!" });
    }
    try {
      if (loggedUserId !== "") {
        const obj = await FollowersModel.aggregate(
          getUserFollowingLogged(userId, loggedUserId)
        );
        return res.status(200).send(obj);
      } else {
        const obj = await FollowersModel.aggregate(
          getUserFollowingUnlogged(userId)
        );
        return res.status(200).send(obj);
      }
    } catch (err) {
      console.log("An error has occured at /:user/following", err);
      return res.send({ message: "something went wrong" });
    }
  });

  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const lowerCaseEmail = email.toLowerCase();
    try {
      if (!password || !email) {
        return res.status(400).send({ message: "Bad Requst" });
      }

      const user = await UserModel.findOne({ email: lowerCaseEmail });
      if (!user) {
        return res.status(400).send({ message: "Bad Request user not found" });
      }

      const comparePasswords = await bcrypt.compare(password, user.password);
      if (!comparePasswords) {
        return res
          .status(401)
          .send({ message: "Email or Password is incorrect" });
      }

      req.session.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      };

      return res.status(200).send({ message: "User logged In" });
    } catch (error) {
      console.log("An error has occured at /login", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  });
};
