const express = require("express");
const app = express();
const http = require("http");
require("dotenv").config();
const port = process.env.PORT || 8081;
const cors = require("cors");
const router = require("./routes");
const { Server } = require("socket.io");
app.use(cors());
app.use(express.json());
app.use(router);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", " POST"],
  },
});

io.on("connection", (socket) => {
  console.log("user connect dengan  socket id", socket.id);
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log("kode adalah : ", data);
  });
  socket.on("send_message", (data) => {
    console.log(data);
    socket.to(data.room).emit('received_message' , data)
  });
  socket.on("disconnect", () => {
    console.log("user disconde", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
