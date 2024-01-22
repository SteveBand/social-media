const mongoose = require("mongoose");
function fetchCommunity(id, userId) {
  return [
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
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
      $lookup: {
        from: "communitymoderators",
        let: { communityId: id },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$$communityId", "$communityId"],
                  },
                ],
              },
            },
          },
        ],
        as: "moderatorsInfo",
      },
    },
    {
      $addFields: {
        isMember: { $gt: [{ $size: "$members" }, 0] },
        isAdmin: { $eq: ["$admin", userId] },
      },
    },
  ];
}

function fetchCommunityPosts(userData, id) {
  return [
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
    {
      $lookup: {
        from: "likes",
        let: { parentId: userData.email, postId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      { $toString: "$parentId" },
                      { $toString: "$$postId" },
                    ],
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
        liked: { $gt: [{ $size: "$likes" }, 0] },
        isAuthor: {
          $cond: {
            if: { $eq: [userData.email, "$parentId"] },
            then: true,
            else: "$$REMOVE",
          },
        },
      },
    },
    {
      $project: {
        likes: 0,
      },
    },
  ];
}

function fetchModerators(loggedUserId, id) {
  return [
    { $match: { communityId: id } },
    {
      $lookup: {
        from: "users",
        let: { parentId: "$parentId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$parentId"],
              },
            },
          },
        ],
        as: "moderators",
      },
    },
    { $unwind: "$moderators" },
    {
      $lookup: {
        from: "followers",
        let: { loggedUserId: loggedUserId, userId: "$moderators.email" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      { $toString: "$parentId" },
                      { $toString: "$$loggedUserId" },
                    ],
                  },
                  {
                    $eq: [{ $toString: "$follows" }, { $toString: "$$userId" }],
                  },
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
        "moderators.isFollowing": { $gt: [{ $size: "$followers" }, 0] },
      },
    },
    {
      $project: {
        followers: 0,
        members: 0,
        moderatorsInfo: 0,
        _id: 0,
        communityId: 0,
        __v: 0,
        parentId: 0,
      },
    },

    {
      $replaceRoot: {
        newRoot: "$moderators",
      },
    },
  ];
}

function fetchCommunityMembers(id, loggedUserId) {
  return [
    { $match: { communityId: id } },
    {
      $lookup: {
        from: "users",
        localField: "parentId",
        foreignField: "_id",
        as: "users",
      },
    },
    { $unwind: "$users" },
    {
      $lookup: {
        from: "communitymoderators",
        let: { parentId: "$users._id", communityId: "$communityId" },
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
        as: "moderator",
      },
    },
    {
      $lookup: {
        from: "followers",
        let: { loggedUserId: loggedUserId, userId: "$users.email" },
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
        "users.isFollowing": { $gt: [{ $size: "$followers" }, 0] },
        "users.IsModerator": { $gt: [{ $size: "$moderator" }, 0] },
      },
    },
    {
      $replaceRoot: {
        newRoot: "$users",
      },
    },
  ];
}

exports.fetchCommunity = fetchCommunity;
exports.fetchCommunityPosts = fetchCommunityPosts;
exports.fetchModerators = fetchModerators;
exports.fetchCommunityMembers = fetchCommunityMembers;
