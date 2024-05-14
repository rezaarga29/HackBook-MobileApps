const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");
const Joi = require("joi");

class Post {
  static collection() {
    return database.collection("posts");
  }

  static async findPosts() {
    return await this.collection()
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: {
            path: "$author",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            "author.password": 0,
          },
        },
      ])
      .toArray();
  }

  static async findPostById(_id) {
    const data = await this.collection()
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: {
            path: "$author",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $match: {
            _id: new ObjectId(_id),
          },
        },
        {
          $project: {
            "author.password": 0,
          },
        },
      ])
      .toArray();
    return data[0];
  }

  static async findPostsNewest() {
    return await this.collection()
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: {
            path: "$author",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            "author.password": 0,
          },
        },
      ])
      .sort({ createdAt: -1 })
      .toArray();
  }

  static async createPost({ content, tags, imgUrl, authorId }) {
    // Validasi input menggunakan Joi
    const schema = Joi.object({
      content: Joi.string().required(),
      tags: Joi.array().required(),
      imgUrl: Joi.string().required(),
    });

    const validation = schema.validate({ content, tags, imgUrl });
    if (validation.error) {
      throw new Error(validation.error.details[0].message);
    }

    return await this.collection().insertOne({
      content,
      tags,
      imgUrl,
      authorId: new ObjectId(authorId),
      comments: [],
      likes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static async addComment({ _id, content, username }) {
    return await this.collection().updateOne(
      { _id: new ObjectId(_id) },
      {
        $push: {
          comments: {
            content,
            username,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      }
    );
  }

  static async addLike({ _id, username }) {
    const post = await this.collection().findOne({ _id: new ObjectId(_id) });
    if (post.likes.some((like) => like.username === username)) {
      throw new Error("User has already liked this post.");
    }
    return await this.collection().updateOne(
      { _id: new ObjectId(_id) },
      {
        $push: {
          likes: {
            username,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      }
    );
  }
}

module.exports = Post;
