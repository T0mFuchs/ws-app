import express from "express";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { mongooseConnect } from "mongooseConnect";
import page from "models/page";
import dotenv from "dotenv";
dotenv.config();

const { CLIENT_URL, API_URL, NODE_ENV } = process.env as {
  [key: string]: string;
};

const app = express();
const server = new http.Server(app);
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
const jsonParser = bodyParser.json();

io.on("connection", async (socket) => {
  socket.on("get-data", async () => {
    try {
      await mongooseConnect();
      // @ts-ignore
      const data = await page.find({}).populate("parent").populate("children");
      //* emit data to all clients
      if (data) io.emit("data", data);
    } catch (e) {
      console.log(e);
    }
  });
});

app.post("/create", jsonParser, async (req, res) => {
  if (req.method === "POST") {
    try {
      const timestamp = Date.now();
      await mongooseConnect();
      // @ts-ignore
      const data = await page.create({
        ...req.body,
        iat: timestamp,
        eat: timestamp,
      });
      if (data) {
        io.emit("new-page", data);
        res.header("Access-Control-Allow-Origin", CLIENT_URL);
        res.status(200).send("ok");
      }
    } catch (e) {
      res.status(500).end();
      console.log(e);
    }
  } else {
    res.status(400).end();
  }
});

app.put("/update", jsonParser, async (req, res) => {
  if (req.method === "PUT") {
    try {
      const timestamp = Date.now();
      console.log(req.body);
      await mongooseConnect();

      if (!req.body.update.content && !req.body.update.tags) {
        // @ts-ignore
        const data = await page.findByIdAndUpdate(
          req.body._id,
          {
            ...req.body.update,
            eat: timestamp,
          },
          { returnDocument: "after" }
        );
        if (data) {
          io.emit("update-page", {
            ...req.body.update,
            eat: timestamp,
          });
        }
      }
      if (req.body.update.content) {
        //* create new content
        if (!req.body.update.content._id) {
          // @ts-ignore
          const data = await page.findByIdAndUpdate(
            {
              _id: req.body._id,
            },
            {
              $push: {
                content: { ...req.body.update.content, eat: timestamp },
              },
            },
            { returnDocument: "after" }
          );
          if (data) {
            io.emit("new-content", {
              _id: req.body._id,
              content: {
                ...req.body.update.content,
                eat: timestamp,
              },
            });
          }
        } else {
          //* update existing content
          // @ts-ignore
          const data = await page.findByIdAndUpdate(
            {
              _id: req.body._id,
            },
            {
              $set: {
                "content.$[elem]": {
                  ...req.body.update.content,
                  eat: timestamp,
                },
              },
            },
            {
              arrayFilters: [{ "elem._id": req.body.update.content._id }],
              returnDocument: "after",
            }
          );
          if (data) {
            io.emit("update-content", {
              _id: req.body._id,
              content: {
                ...req.body.update,
                eat: timestamp,
              },
            });
          }
        }
      }
      // todo
      if (req.body.update.tags) {
      }
      res.header("Access-Control-Allow-Origin", CLIENT_URL);
      res.status(200).send("ok");
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
      await mongooseConnect();

      if (!req.body.content && !req.body.tags) {
        const response = await page.findByIdAndDelete(req.body._id);
        if (response) {
          io.emit("delete-page", { _id: response._id });
        }
      }
      if (req.body.content) {
        // @ts-ignore
        const response = await page.findByIdAndUpdate(
          {
            _id: req.body._id,
          },
          {
            $pull: {
              content: { _id: req.body.content._id },
            },
          },
          { returnDocument: "after" }
        );
        if (response) {
          io.emit("delete-content", {
            _id: req.body._id,
            content: { ...req.body.content },
          });
        }
      }
      // todo
      if (req.body.tags) {
      }
      res.header("Access-Control-Allow-Origin", CLIENT_URL);
      res.status(200).send("ok");
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
    server.listen(5005, () => {
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
