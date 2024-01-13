const mongoose = require("mongoose");
const { authGuard } = require("../middlewares/authGuard");
const { catchCookies } = require("../middlewares/catchCookies");
const { communityGuard } = require("../middlewares/communityGuard");
const {
  Community,
  CommunityPost,
  CommunityMember,
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
      console.log(community);
      if (!community) {
        return res.send({ message: "Bad Request" }).status(400);
      }
      return res.send(community.pop()).status(200);
    } catch (error) {
      console.log(error, "An error has occured at /community/:id");
    }
  });

  app.get("/community/:id/posts", async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res.send({ message: "Bad Request" }).status(400);
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
      const newPost = await new CommunityPost({ parentId, content });
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
};
