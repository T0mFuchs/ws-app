import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const { MONGO_URL, CLIENT_URL, NODE_ENV } = process.env;

const app = express();
const server = new http.Server(app);
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
const jsonParser = bodyParser.json();

//* socket client connection
const mongoClient = new MongoClient(MONGO_URL as string);

io.on("connection", async (socket) => {
  socket.on("get-data", async () => {
    try {
      const collection = mongoClient.db("test2").collection("objects");
      const data = await collection.find().toArray();
      socket.emit("data", data);
    } catch (e) {
      console.log(e);
    }
  });
});

app.post("/create", jsonParser, async (req, res) => {
  if (req.method === "POST") {
    try {
      const collection = mongoClient.db("test2").collection("objects");
      const result = await collection.insertOne({ ...req.body });
      const { insertedId } = result;
      res.type("application/json");
      res.header("Access-Control-Allow-Origin", CLIENT_URL as string);
      res.status(200).send({ ack: true });
      //* emit new object to all clients
      io.emit("new-object", { _id: insertedId, ...req.body });
    } catch (e) {
      console.log(e);
    }
  } else {
    res.status(400).end();
  }
});

app.put("/update", jsonParser, async (req, res) => {
  if (req.method === "PUT") {
    try {
      const collection = mongoClient.db("test2").collection("objects");
      const response = await collection.updateOne(
        { _id: new ObjectId(req.body._id) },
        { $set: { ...req.body.update } }
      );
      //* emit updated object to all clients
      if (response.modifiedCount === 1) {
        res.type("application/json");
        res.header("Access-Control-Allow-Origin", CLIENT_URL as string);
        res.status(200).send({ ack: true });
        io.emit("updated-object", { _id: req.body._id, ...req.body.update });
      } else {
        res.status(400).end();
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    res.status(400).end();
  }
});

app.delete("/delete", jsonParser, async (req, res) => {
  if (req.method === "DELETE") {
    try {
      const collection = mongoClient.db("test2").collection("objects");
      const response = await collection.deleteOne({
        _id: new ObjectId(req.body._id),
      });

      if (response.deletedCount === 1) {
        res.type("application/json");
        res.header("Access-Control-Allow-Origin", CLIENT_URL as string);
        res.status(200).send({ ack: true });
        io.emit("deleted-object", { ...req.body });
      } else {
        res.status(400).end();
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    res.status(400).end();
  }
});

(async () => {
  app.use(
    cors({
      origin: CLIENT_URL,
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );
  try {
    server.listen(3000, () => {
      console.log("http://localhost:3000");
    });
  } catch (e) {
    console.log(e);
  }
})();
