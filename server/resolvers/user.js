const User = require("../models/user");
const { GraphQLError } = require("graphql");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const resolvers = {
  Query: {
    findUsers: async (_, args, contextValue) => {
      const data = await User.findUsers();
      return data;
    },

    findUserById: async (_, args, contextValue) => {
      const authentication = contextValue.authentication();
      const { _id } = authentication;
      const data = await User.findUserById(_id);
      return data;
    },

    findUserByName: async (_, args, contextValue) => {
      const authentication = contextValue.authentication();
      const { name } = args;
      const data = await User.findUserByName(name);
      return data;
    },
  },

  Mutation: {
    registerUser: async (_, args) => {
      // proses menambah Usernya
      const { name, username, email, password } = args.newUser;
      const data = await User.registerUser({
        name,
        username,
        email,
        password,
      });
      const result = await User.findUserById(data.insertedId);
      return result;
    },
    loginUser: async (_, args) => {
      // proses menambah Usernya
      const { email, password } = args;
      const user = await User.findUserByEmail(email);
      if (!user) {
        throw new GraphQLError("Invalid email/password ", {
          extensions: { code: "UNAUTHORIZED" },
        });
      }

      const isPasswordValid = bcryptjs.compareSync(password, user.password);
      if (!isPasswordValid) {
        throw new GraphQLError("Invalid email/password ", {
          extensions: { code: "UNAUTHORIZED" },
        });
      }

      const access_token = jwt.sign(
        {
          _id: user._id,
          email: user.email,
          username: user.username,
        },
        "rahasia"
      );
      return {
        access_token,
        email,
      };
    },
  },
};

module.exports = resolvers;
