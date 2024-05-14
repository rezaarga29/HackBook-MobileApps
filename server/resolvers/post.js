const redis = require("../config/redis");
const Post = require("../models/post");

const resolvers = {
  Query: {
    findPosts: async (_, args, contextValue) => {
      const authentication = contextValue.authentication();
      const posts = await redis.get("posts");
      if (posts) {
        return JSON.parse(posts);
      }
      const data = await Post.findPosts();
      await redis.set("posts", JSON.stringify(data));
      return data;
    },

    findPostById: async (_, args, contextValue) => {
      const authentication = contextValue.authentication();
      const { _id } = args;
      const data = await Post.findPostById(_id);
      return data;
    },

    findPostsNewest: async (_, args, contextValue) => {
      const authentication = contextValue.authentication();
      const posts = await redis.get("posts");
      if (posts) {
        return JSON.parse(posts);
      }
      const data = await Post.findPostsNewest();
      await redis.set("posts", JSON.stringify(data));
      return data;
    },
  },

  Mutation: {
    createPost: async (_, args, contextValue) => {
      // proses menambah Usernya
      const { content, tags, imgUrl } = args.newPost;
      const authentication = contextValue.authentication();
      const data = await Post.createPost({
        content,
        tags,
        imgUrl,
        authorId: authentication._id,
      });
      const result = await Post.findPostById(data.insertedId);
      await redis.del("posts");
      return result;
    },

    addComment: async (_, args, contextValue) => {
      const { _id, content } = args;
      const authentication = contextValue.authentication();
      const post = await Post.addComment({
        _id,
        content,
        username: authentication.username,
      });
      await redis.del("posts");
      return await Post.findPostById(_id);
    },

    addLike: async (_, args, contextValue) => {
      const { _id } = args;
      const authentication = contextValue.authentication();
      const post = await Post.addLike({
        _id,
        username: authentication.username,
      });
      await redis.del("posts");
      return await Post.findPostById(_id);
    },
  },
};

module.exports = resolvers;
