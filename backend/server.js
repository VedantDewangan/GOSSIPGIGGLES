const express = require("express");
const { createServer } = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { ConnectDB } = require("./ConnectDB");
const { UserRouter } = require("./router/UserRouter");
const { ChatRouter } = require("./router/ChatRouter");
const { MessageRouter } = require("./router/MessageRouter");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "UPDATE", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use("/api/chat", UserRouter);
app.use("/api/chat", ChatRouter);
app.use("/api/chat", MessageRouter);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  socket.on("login", (id) => {
    console.log(id.name, "is online");
  })

  socket.on("join room", (chatid) => {
    socket.join(chatid);
    console.log("User join the room ", chatid);
    socket.on("send", (obj) => {
      io.to(chatid).emit("receive",obj)
    })
  })

});

ConnectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`API is working on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to connect to the database", err);
});
