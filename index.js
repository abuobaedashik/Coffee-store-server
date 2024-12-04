const express =require('express')
const cors =require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app =express();
const port =process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g1qcw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
     
    const database =client.db("CoffeeDB")

    const Coffeecollection = database.collection("coffee");
    const Usercollection = database.collection("User");
    
    app.get('/coffee',async(req,res)=>{
      const cursor =Coffeecollection.find()
      const result =await cursor.toArray()
      res.send(result);
    })
    app.get('/coffee/:id',async(req,res)=>{
      const id =req.params.id
      if (id.length!==24) {
        res.status(400).send({message:"id should be 24 cherecter"})
        return;
      }
      const query ={_id : new ObjectId(id)}
      const result = await Coffeecollection.findOne(query)
      res.send(result)
      // console.log('coffee delete successful');
    })

    app.post('/coffee',async(req,res)=>{
      const newCoffee =req.body;
      console.log(newCoffee);
      const result =await Coffeecollection.insertOne(newCoffee)
      res.send(result)
    })


    // coffee api get post 

    app.get('/users',async(req,res)=>{
      const cursor =Usercollection.find()
      const result =await cursor.toArray()
      res.send(result)
    })

    app.post('/users',async(req,res)=>{
      const newUser =req.body;
      console.log(newUser);
      const result =await Usercollection.insertOne(newUser)
      res.send(result);
    })

    app.patch('/users',async(req,res)=>{
      const email =req.body.email
      const filter ={email}
      const updateDoc={
        $set:{
          lastSignInTime : req.body?.lastSignInTime
        }
      }
      const result = await Usercollection.updateOne(filter,updateDoc)
      res.send(result)
    })
    app.delete('/users/:id',async(req,res)=>{
      const id =req.params.id
      const query ={_id: new ObjectId(id)}
      const result =await Usercollection.deleteOne(query)
      res.send(result)
      console.log('user delete successful');
    })

    app.put('/coffee/:id',async(req,res)=>{
      const id =req.params.id
      const filter ={_id : new ObjectId(id)}
      const option ={upsurt:true}
      const updatedCoffee =req.body
      const coffee ={
        $set:{
          name:updatedCoffee.name,
          chef:updatedCoffee.chef,
          supplier:updatedCoffee.supplier, 
          taste:updatedCoffee.taste,
          category:updatedCoffee.category,
          details:updatedCoffee.details,
          photo:updatedCoffee.photo 
        }
      }
      const result = await Coffeecollection.updateOne(filter,coffee,option)
      res.send(result)
    })

    app.delete('/coffee/:id',async(req,res)=>{
      const id =req.params.id
      const query ={_id : new ObjectId(id)}
      const result = await Coffeecollection.deleteOne(query)
      res.send(result)
      console.log('coffee delete successful');
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



app.get('/',(req,res)=>{
    res.send("Coffee Creation Server is Running")
})
app.listen(port,()=>{
    console.log(`Coffee server is running port is:${port}`);
})