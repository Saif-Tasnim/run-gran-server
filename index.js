require("dotenv").config();
const express = require("express");
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

// middlewere

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3kcnoe6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const productCollection = client.db("run_gran_collection").collection("products");
const usersCollection = client.db("run_gran_collection").collection("users");
const quoteCollection = client.db("run_gran_collection").collection("quote");
const teamStoreCollection = client.db("run_gran_collection").collection("team_Store");
const artOrderCollection = client.db("run_gran_collection").collection("custom-art-order");
const teamOrderCollection = client.db("run_gran_collection").collection("team-order");
const contactCollection = client.db("run_gran_collection").collection("contact");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    app.get("/products", async (req, res) => {
      const products = await productCollection.find().toArray()
      res.send(products)
    })

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { id: parseInt(id) };
      const products = await productCollection.findOne(query);
      res.send(products)
    })

    app.post("/users", async (req, res) => {
      const newData = req.body;
      // console.log(newUser);
      const email = { email: newData.email };
      const existUser = await usersCollection.findOne(email);
      if (existUser) {
        return res.json("User Exist!")
      } else {
        const result = await usersCollection.insertOne(newUser);
        return res.send(result);
      }
    })

    app.get("/users", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      if (query) {
        const result = await usersCollection.findOne(query);

        res.send(result)
      }
    })


    app.get("/users", async (req, res) => {

      const result = await usersCollection.find().toArray();

      res.send(result);
    })

    app.post("/quote", async (req, res) => {
      const quoteData = req.body

      const result = await quoteCollection.insertOne(quoteData)
      res.send(result)
    })

    app.get("/quote", async (req, res) => {
      const result = await quoteCollection.find().toArray();
      res.send(result)
    })
    
    app.get("/quote", async (req, res) => {
      const userEmail = req.query.email;
      const query = { email: userEmail }
      const result = await quoteCollection.find(query).toArray();
      res.send(result)
    })


    app.post("/team-store", async (req, res) => {
      const quoteData = req.body
      const result = await teamStoreCollection.insertOne(quoteData)
      res.send(result)
    })

    app.get("/team-store", async (req, res) => {
      const result = await teamStoreCollection.find().toArray();
      res.send(result)
    })

    app.get("/team-store", async (req, res) => {
      const userEmail = req.query.email;
      const query = { email: userEmail }
      const result = await teamStoreCollection.find(query).toArray();
      res.send(result)
    })


    app.post("/art-order", async (req, res) => {
      const quoteData = req.body

      const result = await artOrderCollection.insertOne(quoteData)
      res.send(result)
    })


    app.get('/team-order', async (req, res) => {
      const result = await teamOrderCollection.find().toArray();
      res.send(result);
    })
    
    app.get('/team-order', async (req, res) => {
      const userEmail = req.query.email;
      const query = {email : userEmail}
      const result = await teamOrderCollection.find(query).toArray();
      res.send(result);
    })

    app.post("/team-order", async (req, res) => {
      const teamData = req.body
      const result = await teamOrderCollection.insertOne(teamData)
      res.send(result)
    })

    app.get('/contact' , async(req,res) => {
      const result = await contactCollection.find().toArray()
      res.send(result)
    })

    app.post('/contact', async (req, res) => {
      const data = req.body;
      const result = await contactCollection.insertOne(data);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Run Gran is running')
})

app.listen(port, () => {
  console.log(`Run Gran is running on port ${port}`)
})