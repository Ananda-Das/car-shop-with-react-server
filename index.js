const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qfsxze0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //Brand Name Collection
    const brandNameCollection = client.db("brandShopDB").collection("brands");

    //Add Brand Info
    app.post("/brands", async (req, res) => {
      const brandInfo = req.body;
      console.log(brandInfo);
      const result = await brandNameCollection.insertOne(brandInfo);
      res.send(result);
    });



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Brand Shop server is running");
});

app.listen(port, () => {
  console.log(`Brand Shop is running ${port}`);
});
