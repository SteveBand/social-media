const mongoose = require("mongoose");
const { authGuard } = require("../middlewares/authGuard");
const { catchCookies } = require("../middlewares/catchCookies");
const { communityGuard } = require("../middlewares/communityGuard");
const {
  Community,
  CommunityPost,
  CommunityMember,
  CommunityLike,
} = require("../models/models");
const { fetchCommunity } = require("../lib/aggregations/communityAgg");

module.exports = (app) => {
  app.get("/community/:id", catchCookies, async (req, res) => {
    const id = req.params.id;
    const userId = req.userData.email || null;
    if (!id) {
      return res.send({ message: "Bad Request" }).status(400);
    }
    try {
      const community = await Community.aggregate(fetchCommunity(id, userId));
      if (!community) {
        return res.send({ message: "Bad Request" }).status(400);
      }
      return res.send(community.pop()).status(200);
    } catch (error) {
      console.log(error, "An error has occured at /community/:id");
    }
  });

  app.get("/community/:id/posts", catchCookies, async (req, res) => {
    const id = req.params.id;
    const userData = req.userData || null;
    if (!id) {
      return res.send({ message: "Bad Request" }).status(400);
    }
    try {
      const postsArr = await CommunityPost.aggregate([
        { $match: { communityId: id } },
        {
          $lookup: {
            from: "users",
            localField: "parentId",
            foreignField: "email",
            as: "user_info",
          },
        },
        { $unwind: "$user_info" },
      ]);
      console.log(postsArr);
      return res.send(postsArr).status(200);
    } catch (err) {
      console.log("An error has occured at /community/:id/posts", err);
    }
  });

  app.post("/community/:id/new/member", authGuard, async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res.send({ message: "Bad Request" }).status(400);
    }
    try {
      const newMember = await new CommunityMember({
        parentId: req.userData.email,
        communityId: id,
      });
      await newMember.save();
      await Community.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        { $inc: { membersCount: 1 } }
      );
      return res.send({ newMember: true }).status(200);
    } catch (error) {
      console.log(
        "An error has Occured at /community/:id/new/member",
        error.name
      );
    }
  });

  app.post("/community/:id/delete/member", authGuard, async (req, res) => {
    const id = req.params.id;
    const userData = req.userData;
    if (!id) {
      return res.send({ message: "Bad Request" }).status(400);
    }
    if (!userData || userData === undefined) {
      return res.send({ message: "Unauthorized" }).status(401);
    }
    try {
      await CommunityMember.findOneAndDelete({
        parentId: userData.email,
        communityId: id,
      });

      await Community.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        { $inc: { membersCount: -1 } }
      );
      return res.send({ newMember: false }).status(200);
    } catch (error) {
      console.log(
        "An error has Occured at /community/:id/delete/member",
        error
      );
      return res.status(500);
    }
  });

  app.post("/community/:id/new/post", communityGuard, async (req, res) => {
    const id = req.params.id;
    const content = req.query.content;
    const parentId = req.query.parentId;
    if (!id || !content || !parentId) {
      return res.send({ message: "Bad Requst" }).status(404);
    }

    try {
      const newPost = await new CommunityPost({
        parentId,
        content,
        communityId: id,
      });
      await newPost.save();
      return res.send(newPost).status(200);
    } catch (error) {
      console.log(
        "An error has Occured at /community/:id/new/post path",
        err.name
      );
      return res.send({ message: "Server Error" }).status(500);
    }
  });

  app.post("/community/post/:id/new/like", authGuard, async (req, res) => {
    const postId = req.params.id;
    const userData = req.userData;
    const communityId = req.query.communityId;
    if (!postId || !communityId) {
      return res.send({ message: "Bad Request" }).status(400);
    }
    const existingLike = await CommunityLike.findOne({
      parentId: userData.email,
      postId: postId,
    });
    if (existingLike) {
      return res.send({ message: "User already liked this post" }).status(400);
    }
    try {
      const newLike = await new CommunityLike({
        parentId: userData.email,
        communityId,
        postId,
      });
      await newLike.save();
      return res.send({ message: "new Like Generated" }).status(200);
    } catch (error) {
      console.log("An error has occured at /community/post/:id/new/like", err);
    }
  });
};
