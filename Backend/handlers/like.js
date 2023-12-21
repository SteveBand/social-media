const { authGuard } = require("../middlewares/authGuard");
const { LikesModel, Post } = require("../models/models");

module.exports = (app) => {
  app.post("/new/like", authGuard, async (req, res) => {
    try {
      const { _id } = req.body;
      const userData = req.userData;
      const likeBody = { parentId: _id, userId: userData.email };
      const existingLike = await LikesModel.findOne(likeBody);
      if (existingLike) {
        return res.send({ message: "Already Liked" }).status(400);
      }
      const existingPost = await Post.findOne({ _id });
      if (!existingPost) {
        return res.send({ message: "404 Posts doesnt exist" }).status(404);
      }
      await Post.updateOne({ _id }, { $inc: { __v: 1, likesCount: 1 } });
      await new LikesModel(likeBody).save();

      res.send({ message: "Success" }).status(200);
    } catch (err) {
      console.log("Falls within /new/like Route!");
    }
  });

  app.post("/delete/like", authGuard, async (req, res) => {
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
};
