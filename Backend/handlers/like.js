const { authGuard } = require("../middlewares/authGuard");
const { LikesModel, Post, CommentModel } = require("../models/models");

module.exports = (app) => {
  app.post("/new/post/like", authGuard, async (req, res) => {
    try {
      const { _id } = req.body;
      const userData = req.userData;
      const likeBody = { parentId: _id, userId: userData.email };
      const existingLike = await LikesModel.findOne(likeBody);
      if (existingLike) {
        return res.status(400).send({ message: "Already Liked" });
      }
      const existingPost = await Post.findOne({ _id });
      if (!existingPost) {
        return res.status(404).send({ message: "404 Posts doesnt exist" });
      }
      await Post.updateOne({ _id }, { $inc: { __v: 1, likesCount: 1 } });
      const newLike = await new LikesModel(likeBody).save();
      // console.log(newLike);
      return res.status(200).send({ message: "Success" });
    } catch (err) {
      console.log("Falls within /new/like Route!");
      return res.status(500).send({ message: "Internal Server Error" });
    }
  });

  app.post("/new/comment/like", authGuard, async (req, res) => {
    try {
      const { _id } = req.body;
      const userData = req.userData;
      const likeBody = { parentId: _id, userId: userData.email };
      const existingLike = await LikesModel.findOne(likeBody);
      if (existingLike) {
        return res.status(400).send({ message: "Already Liked" });
      }
      const existingPost = await CommentModel.findOne({ _id });
      if (!existingPost) {
        return res.status(404).send({ message: "404 Posts doesnt exist" });
      }
      await CommentModel.updateOne(
        { _id },
        { $inc: { __v: 1, likesCount: 1 } }
      );
      const newLike = await new LikesModel(likeBody).save();
      console.log(newLike);
      return res.status(200).send({ message: "Success" });
    } catch (err) {
      console.log("Falls within /new/like Route!");
      return res.status(500).send({ message: "Internal Server Error" });
    }
  });

  app.post("/delete/post/like", authGuard, async (req, res) => {
    try {
      const userData = req.userData;
      await Post.updateOne(
        { _id: req.body._id },
        { $inc: { __v: 1, likesCount: -1 } }
      );
      await LikesModel.deleteOne({
        parentId: req.body._id,
        userId: userData.email,
      });
      res.send({ message: "Success" }).status(200);
    } catch (err) {
      console.log("Error Occured at Delete/like ROUTE!");
      res.send({ message: "Error Occured!!!" }).status(500);
    }
  });

  app.post("/delete/comment/like", authGuard, async (req, res) => {
    try {
      const userData = req.userData;
      await CommentModel.updateOne(
        { _id: req.body._id },
        { $inc: { __v: 1, likesCount: -1 } }
      );
      await LikesModel.deleteOne({
        parentId: req.body._id,
        userId: userData.email,
      });
      res.send({ message: "Success" }).status(200);
    } catch (err) {
      console.log("Error Occured at Delete/like ROUTE!");
      res.send({ message: "Error Occured!!!" }).status(500);
    }
  });
};
