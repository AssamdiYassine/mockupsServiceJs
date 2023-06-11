const express = require("express");
const fileUpload = require("express-fileupload");
const http = require("http");
const fs = require("fs");
var path = require("path");
const { Server } = require("socket.io");
 

 
require("dotenv").config();

// Init expess
const app = express();
const server = http.createServer(app);

// Middlewares[Function: toAbsoluteUrl]
app.use(express.json());
app.use(fileUpload());

const cors = require("cors");
app.use(cors());

// authorise CROS[Function: toAbsoluteUrl]
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  ); // X-Token-Auth
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

// Routes Folder
const handler = require("./routes/handler");
// const auth = require("./routes/auth");

app.use("/api", handler);

// app.use(auth)

// End V1
app.get("/", function (req, res) {
  res.send("this is servies mockups helper");
});

app.get("*", function (req, res) {
  res.status(404).send({ error: "Not found" });
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  function buildPath() {
    return path.join(process.cwd(), "state", "state.json");
  }

  function extractData(filePath) {
    const jsonData = fs.readFileSync(filePath);
    const data = JSON.parse(jsonData);
    return data;
  }

  try {
    setInterval(async () => {
      const filePath = buildPath();
      const AllData = extractData(filePath);
      socket.emit("status", AllData[0]);
    }, 600);
  } catch (error) {
    throw error;
  }
});
// Start Server
const port = process.env.PORT;
server.listen(port);
console.log(`server listening on ${port}`);
