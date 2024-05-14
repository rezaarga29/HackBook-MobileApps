const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.URI_MONGODB;

// Create a new client and connect to MongoDB
const client = new MongoClient(uri);

const database = client.db("challenge1");

module.exports = {
  database,
  client,
};
