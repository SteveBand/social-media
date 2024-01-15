const mongoose = require("mongoose");
const { authGuard } = require("../middlewares/authGuard");
const { catchCookies } = require("../middlewares/catchCookies");
const { communityGuard } = require("../middlewares/communityGuard");
const {
  Community,
  // CommunityPost,
  CommunityMember,
  CommunityLike,
  CommunityComment,
} = require("../models/models");
const {
  fetchCommunity,
  fetchCommunityPosts,
} = require("../lib/aggregations/communityAgg");

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
      const postsArr = await CommunityPost.aggregate(
        fetchCommunityPosts(userData, id)
      );
      console.log(postsArr);
      return res.send(postsArr).status(200);
    } catch (err) {
      console.log("An error has occured at /community/:id/posts", err);
    }
  });

  app.get("/community/post/:id", catchCookies, async (req, res) => {
    const id = req.params.id;
    const userData = req.userData || null;
    if (!id) {
      return res.send({ message: "Bad Request" }).status(400);
    }
    try {
      const post = await CommunityPost.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: "communitycomments",
            localField: "_id",
            foreignField: "parentId",
            as: "comments",
          },
        },
        { $unwind: "$comments" },
      ]);
      if (!post) {
        return res.send({ message: "Post not found" }).status(404);
      }
      console.log(post);
      return res.send(post.pop()).status(200);
    } catch (error) {
      console.log("An error has occured at /community/post/:id", error);
      return res.send({ message: "An server error has occured" }).status(500);
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
      await CommunityPost.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(postId) },
        {
          $inc: { likesCount: 1 },
        }
      );
      return res.send({ message: "new Like Generated" }).status(200);
    } catch (error) {
      console.log("An error has occured at /community/post/:id/new/like", err);
      return res.send({ message: "Server error" }).status(500);
    }
  });

  app.post("/community/post/:id/remove/like", authGuard, async (req, res) => {
    const postId = req.params.id;
    const communityId = req.query.communityId;
    if (!postId) {
      return res.send({ message: "Bad Request" }).status(400);
    }
    try {
      await CommunityLike.findOneAndDelete({
        postId: postId,
      });
      await CommunityPost.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(postId),
        },
        { $inc: { likesCount: -1 } }
      );
      return res.send({ message: "Disliked successfully" }).status(200);
    } catch (error) {
      console.log(
        "An error has occured at /community/post/:id/remove/like",
        error
      );
      return res.send({ message: "A server error has occured" }).status(500);
    }
  });
};
