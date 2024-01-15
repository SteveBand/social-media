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
                    $eq: [
                      { $toString: "$$communityId" },
                      { $toString: "$communityId" },
                    ],
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
      },
    },

    {
      $project: {
        members: 0,
        moderatorsInfo: 0,
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

exports.fetchCommunity = fetchCommunity;
exports.fetchCommunityPosts = fetchCommunityPosts;
