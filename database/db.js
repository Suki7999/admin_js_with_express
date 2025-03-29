const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');

// MongoDB Atlas холболтын URI
const uriMongoose = "mongodb+srv://admin:Hello_world11@ttsss.y2xdiji.mongodb.net/TTsss?retryWrites=true&w=majority";

// MongoClient тохиргоо
const uriMongoClient = "mongodb+srv://admin:Hello_world11@ttsss.y2xdiji.mongodb.net/?retryWrites=true&w=majority&appName=TTsss";
const client = new MongoClient(uriMongoClient, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// MongoClient руу холбогдож эхлэх
async function connectToMongoClient() {
  try {
    // MongoClient-ээр холбогдож эхлэх
    await client.connect();
    console.log("MongoClient холболт амжилттай");

    // MongoDB серверээс ping хариу авах
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoClient холболтын алдаа: ", error);
  } finally {
    await client.close();
  }
}

// Mongoose-ээр MongoDB Atlas руу холбогдож эхлэх
mongoose.connect(uriMongoose, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Atlas холболт амжилттай!');
    // Холболт амжилттай бол MongoClient руу холбогдож эхлэх
    connectToMongoClient();
  })
  .catch(err => {
    console.error('MongoDB холболт хийх үед алдаа гарлаа: ', err);
  });

// Mongoose холболт амжилттай бол дэлгэцэнд амжилттай үсгэх
const conexion = mongoose.connection;
conexion.once('open', () => {
  console.log('Mongoose холболт амжилттай');
});

module.exports = conexion;