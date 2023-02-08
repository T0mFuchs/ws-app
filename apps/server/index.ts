import express from "express";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const { MONGO_URL, CLIENT_URL, API_URL, NODE_ENV } = process.env;

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
  socket.on("get-data", async ({ db, collection }) => {
    try {
      const source = mongoClient.db(db).collection(collection);
      const data = await source.find().toArray();
      //* emit data to all clients
      io.emit("data", data);
    } catch (e) {
      console.log(e);
    }
  });
});

app.post("/:db/:collection/create", jsonParser, async (req, res) => {
  if (req.method === "POST") {
    try {
      const { db, collection } = req.params;
      const source = mongoClient.db(db).collection(collection);
      const timestamp = Date.now();
      const response = await source.insertOne({ ...req.body, iat: timestamp, eat: timestamp });
      const { insertedId } = response;

      if (response.acknowledged) {
        res.type("application/json");
        res.header("Access-Control-Allow-Origin", CLIENT_URL as string);
        res.status(200).send("ok");

        //* emit new object to all clients
        io.emit("new-object", { _id: insertedId, ...req.body, iat: timestamp, eat: timestamp });
      } else {
        res.status(500).end();
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    res.status(400).end();
  }
});

app.put("/:db/:collection/update", jsonParser, async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { db, collection } = req.params;
      const source = mongoClient.db(db).collection(collection);
      const response = await source.updateOne(
        { _id: new ObjectId(req.body._id) },
        { $set: { ...req.body.update, eat: Date.now() } }
      );
      if (response.modifiedCount === 1) {
        res.type("application/json");
        res.header("Access-Control-Allow-Origin", CLIENT_URL as string);
        res.status(200).send("ok");

        //* emit updated object to all clients
        io.emit("updated-object", { _id: req.body._id, ...req.body.update, eat: Date.now() });
      } else {
        res.status(500).end();
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    res.status(400).end();
  }
});

app.delete("/:db/:collection/delete", jsonParser, async (req, res) => {
  if (req.method === "DELETE") {
    try {
      const { db, collection } = req.params;
      const source = mongoClient.db(db).collection(collection);
      const response = await source.deleteOne({
        _id: new ObjectId(req.body._id),
      });
      if (response.deletedCount === 1) {
        res.type("application/json");
        res.header("Access-Control-Allow-Origin", CLIENT_URL as string);
        res.status(200).send("ok");
        io.emit("deleted-object", { ...req.body });
      } else {
        res.status(500).end();
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    res.status(400).end();
  }
});

function shouldCompress(req: express.Request, res: express.Response) {
  if (req.headers["x-no-compression"]) {
    // don't compress responses with this request header
    return false;
  }
  // fallback to standard filter function
  return compression.filter(req, res);
}

(async () => {
  app.use(compression({ filter: shouldCompress }));
  app.use(
    cors({
      origin: CLIENT_URL,
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );
  try {
    server.listen(3000, () => {
      console.log(
        `express-web-socket:${
          NODE_ENV === "development" ? "dev" : "prod"
        }: ${API_URL}`
      );
    });
  } catch (e) {
    console.log(e);
  }
})();
