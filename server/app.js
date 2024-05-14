// import { ApolloServer } from '@apollo/server'; //! jika menggunakan npm pkg set type="module"
// import { startStandaloneServer } from '@apollo/server/standalone';
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const userTypeDefs = require("./schema/user");
const postTypeDefs = require("./schema/post");
const followTypeDefs = require("./schema/follow");

const userResolver = require("./resolvers/user");
const postResolver = require("./resolvers/post");
const followResolver = require("./resolvers/follow");

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolver, postResolver, followResolver],
  // agar bisa diakses via sandbox jika sudah Production
  introspection: true,
});

startStandaloneServer(server, {
  listen: { port: process.env.PORT || 3000 },
  context: async ({ req, res }) => {
    return {
      authentication: () => {
        const authorizationHeader = req.headers.authorization || "";
        const token = authorizationHeader.split(" ")[1];

        if (!token) {
          throw new GraphQLError("Acces token must be provided", {
            extensions: { code: "NOT_AUTHORIZED" },
          });
        }

        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

        return decodeToken;
      },
    };
  },
})
  .then(({ url }) => {
    console.log(`🚀  Server ready at: ${url}`);
  })
  .catch((err) => console.log(err));
