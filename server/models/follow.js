const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");
const Joi = require("joi");

class Follow {
  static collection() {
    return database.collection("follows");
  }

  static async addFollowing({ followingId, followerId }) {
    if (followingId === followerId) {
      throw new Error("Cannot follow yourself");
    }
    const existingFollow = await this.collection().findOne({
      followingId: new ObjectId(followingId),
      followerId: new ObjectId(followerId),
    });
    if (existingFollow) {
      throw new Error("Already followed");
    }
    return await this.collection().insertOne({
      followingId: new ObjectId(followingId),
      followerId: new ObjectId(followerId),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static async findFollowing(_id) {
    return await this.collection()
      .aggregate([
        {
          $match: {
            followerId: new ObjectId(_id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "followerId",
            foreignField: "_id",
            as: "follower",
          },
        },
        {
          $unwind: {
            path: "$follower",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            "follower.password": 0,
            "follower.username": 0,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "followingId",
            foreignField: "_id",
            as: "following",
          },
        },
        {
          $unwind: {
            path: "$following",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            "following.password": 0,
            "following.username": 0,
          },
        },
      ])
      .toArray();
  }

  static async findFollower(_id) {
    return await this.collection()
      .aggregate([
        {
          $match: {
            followingId: new ObjectId(_id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "followingId",
            foreignField: "_id",
            as: "following",
          },
        },
        {
          $unwind: {
            path: "$following",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            "following.password": 0,
            "following.username": 0,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "followerId",
            foreignField: "_id",
            as: "follower",
          },
        },
        {
          $unwind: {
            path: "$follower",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            "follower.password": 0,
            "follower.username": 0,
          },
        },
      ])
      .toArray();
  }
}

module.exports = Follow;
