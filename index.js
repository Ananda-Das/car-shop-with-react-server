const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
    const carDeatilsCollection = client.db("brandShopDB").collection("cars");

    //Get Brand Info
    app.get("/brands", async (req, res) => {
      const cursor = brandNameCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //Add Brand Info
    app.post("/brands", async (req, res) => {
      const brandInfo = req.body;
      console.log(brandInfo);
      const result = await brandNameCollection.insertOne(brandInfo);
      res.send(result);
    });

    //get specifice brands car
    app.get("/brands/:brandName", async (req, res) => {
      const brandName = req.params.brandName;
      console.log(brandName);
      const query = { brand: brandName };
      const result = await carDeatilsCollection.find(query).toArray();
      res.send(result);
    });

    //Get all Car Info
    app.get("/cars", async (req, res) => {
      const cursor = carDeatilsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //get specifice one car
    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carDeatilsCollection.findOne(query);
      res.send(result);
    });

    //update a car
    app.put("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCar = req.body;
      console.log(updatedCar);
      const car = {
        $set: {
          name: updatedCar.name,
          image: updatedCar.image,
          brand: updatedCar.brand,
          type: updatedCar.type,
          price: updatedCar.price,
          description: updatedCar.description,
          ratting: updatedCar.ratting,
        },
      };

      const result = await carDeatilsCollection.updateOne(filter, car, options);
      res.send(result);
    });

    //Add Car Info
    app.post("/cars", async (req, res) => {
      const carInfo = req.body;
      console.log(carInfo);
      const result = await carDeatilsCollection.insertOne(carInfo);
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
