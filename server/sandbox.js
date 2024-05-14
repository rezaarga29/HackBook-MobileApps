const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://rezaarga29:R324Zeken!@mycluster.59cdcn1.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster";

// Create a new client and connect to MongoDB
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect to the "insertDB" database and access its "haiku" collection
    const database = client.db("challenge1");
    const userCollection = database.collection("users");

    // Create a document to insert
    const doc = {
      name: "Ara ara",
      username: "ara1",
      email: "ara@mail.com",
      password: "123123",
    };
    // Insert the defined document into the "haiku" collection
    // const result = await userCollection.insertOne(doc);
    // const result = await userCollection.deleteOne({
    //   _id: new ObjectId("662fabc13483c6c1f4dfd727"),
    // });
    // const result = await userCollection.find().toArray();
    // const result = await userCollection.updateOne(
    //   {
    //     _id: new ObjectId("662fabc13483c6c1f4dfd727"),
    //   },
    //   {
    //     $set: {
    //       name: "Ara ara Kimochi",
    //     },
    //   }
    // );
    // const result = await userCollection.findOne({
    //   _id: new ObjectId("662f986737f57874624c3beb"),
    // });
    console.log(result);
    // Print the ID of the inserted document
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    // Close the MongoDB client connection
    await client.close();
  }
}
// Run the function and handle any errors
run().catch(console.dir);
