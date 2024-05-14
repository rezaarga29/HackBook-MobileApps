// ?Define your GraphQL schema

const typeDefs = `#graphql
  
      #penulisan Pascalcase dan Singular
      type Post {
        _id: ID
        content: String
        tags: [String]
        imgUrl: String
        authorId: String
        comments: [Comment]
        likes: [Like]
        createdAt: String
        updatedAt: String
        author: Author
      }

      input NewPost {
        content: String
        tags: [String]
        imgUrl: String
      }

      type Author {
        _id: ID
        name: String
        email: String
      }

      type Comment {
        content: String
        username: String
        createdAt: String
        updatedAt: String
      }

      type Like {
        username: String
        createdAt: String
        updatedAt: String
      }

    #Query? adalah daftar yang bisa dieksekusi dari sisi client
      #Ini hanya untuk method GET (jika di dalam Rest API)
      type Query {
        findPosts: [Post]
        findPostById(_id: ID): Post
        findPostsNewest: [Post]
      }
  
      #Selain Method GET menggunakan Mutation
      #Tambahkan tanda seru dibelakang type jika Required
      type Mutation {
        createPost(newPost: NewPost) : Post
        addComment(_id: ID, content: String) : Post
        addLike(_id: ID) : Post
      }
  `;

module.exports = typeDefs;
