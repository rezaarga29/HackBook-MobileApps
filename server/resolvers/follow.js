const Follow = require("../models/follow");

const resolvers = {
  Query: {
    findFollowing: async (_, args, contextValue) => {
      const authentication = contextValue.authentication();
      const { _id } = authentication;
      const data = await Follow.findFollowing(_id);
      return data;
    },

    findFollower: async (_, args, contextValue) => {
      const authentication = contextValue.authentication();
      const { _id } = authentication;
      const data = await Follow.findFollower(_id);
      return data;
    },
  },

  Mutation: {
    addFollowing: async (_, args, contextValue) => {
      const { followingId } = args;
      const authentication = contextValue.authentication();

      const data = await Follow.addFollowing({
        followingId,
        followerId: authentication._id,
      });
      return data;
    },
  },
};

module.exports = resolvers;
