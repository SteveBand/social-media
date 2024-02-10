const mongoose = require("mongoose");
function fetchCommunity(id, userId) {
  return [
    { $match: { _id: id } },
    // fetching community and if loggedUser is member with $lookup
    {
      $lookup: {
        from: "communitymembers",
        let: { parentId: userId, communityId: id },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$communityId", "$$communityId"] },
                  { $eq: ["$parentId", "$$parentId"] },
                ],
              },
            },
          },
        ],
        as: "members",
      },
    },
    {
      $addFields: {
        isMember: { $gt: [{ $size: "$members" }, 0] }, // adding boolean field if user is member
        isAdmin: { $eq: ["$admin", userId] }, /// checks if loggedUser is admin and creating new field
      },
    },
    {
      $project: {
        members: 0,
      },
    },
  ];
}

function fetchCommunityPosts(id, userId) {
  return [
    { $match: { communityId: id } },
    //fetching each post its creator user info
    {
      $lookup: {
        from: "users",
        localField: "parentId",
        foreignField: "_id",
        as: "user_info",
      },
    },
    { $unwind: "$user_info" },

    // checking if loggedUser liked the post by searching for specific document
    {
      $lookup: {
        from: "likes",
        let: { parentId: userId, postId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$parentId", "$$postId"],
                  },
                  {
                    $eq: ["$$parentId", "$userId"],
                  },
                ],
              },
            },
          },
        ],
        as: "likes",
      },
    },
    {
      $addFields: {
        liked: { $gt: [{ $size: "$likes" }, 0] }, /// adding liked boolean field to each post
        isAuthor: {
          ///adding isAuthor if the loggedUser is the creator of post
          $cond: {
            if: { $eq: [userId, "$parentId"] },
            then: true,
            else: "$$REMOVE",
          },
        },
      },
    },
    {
      $project: {
        likes: 0,
        moderator: 0,
        "user_info.password": 0, /// removing user password from object
      },
    },
  ];
}

function fetchCommunityMembers(id, userId) {
  return [
    { $match: { communityId: id } },
    /// Gets all community members user info
    {
      $lookup: {
        from: "users",
        localField: "parentId",
        foreignField: "_id",
        as: "users",
      },
    },
    { $unwind: "$users" },
    /// checks if logged user is following them by checking for existing document of logged User and fetched member
    {
      $lookup: {
        from: "followers",
        let: { loggedUserId: userId, userId: "$users._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$parentId", "$$loggedUserId"] },
                  { $eq: ["$follows", "$$userId"] },
                ],
              },
            },
          },
        ],
        as: "followers",
      },
    },
    {
      $addFields: {
        "users.isFollowing": { $gt: [{ $size: "$followers" }, 0] }, // adding isFollowing boolean field
      },
    },
    {
      $replaceRoot: {
        newRoot: "$users",
      },
    },
    {
      $project: {
        password: 0, // removing user password from sent data
      },
    },
  ];
}

exports.fetchCommunity = fetchCommunity;
exports.fetchCommunityPosts = fetchCommunityPosts;
exports.fetchCommunityMembers = fetchCommunityMembers;
