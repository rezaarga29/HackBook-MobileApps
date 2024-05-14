// ?Define your GraphQL schema

const typeDefs = `#graphql
  
      #penulisan Pascalcase dan Singular
      type User {
        _id: ID
        name: String
        username: String
        email: String
        password: String
      }
  
      #Query? adalah daftar yang bisa dieksekusi dari sisi client
      #Ini hanya untuk method GET (jika di dalam Rest API)
      type Query {
        findUsers: [User]
        findUserById: User
        findUserByName(name: String): [User]
      }
      
      type UserCredential {
        access_token: String
        email: String
      }

      input NewUser {
        name: String!
        username: String!
        email: String!
        password: String!
      }
  
      #Selain Method GET menggunakan Mutation
      #Tambahkan tanda seru dibelakang type jika Required
      type Mutation {
        registerUser(newUser: NewUser) : User
        loginUser(email: String, password: String) : UserCredential
      }
  `;

module.exports = typeDefs;
