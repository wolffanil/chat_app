const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const userRouter = require("./routes/userRouter");
const chatRouter = require("./routes/chatRouter");
const messageRouter = require("./routes/messageRouter");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use(morgan("dev"));

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

app.use(notFound);
// app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("DB successful");
  })
  .catch((err) => console.log(err));

const port = process.env.PORT || 5000;

const server = app.listen(port, console.log(`Server working on port ${port}`));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://127.0.0.1:5173",
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("online", ({ users, id }) => {
    users.forEach((user) => {
      if (user._id === id) return;
      socket.in(user._id).emit("online", id);
    });
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageRevieved) => {
    const chat = newMessageRevieved.chat;

    if (!chat.users) return;

    chat.users.forEach((user) => {
      if (user._id === newMessageRevieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRevieved);
    });
  });

  socket.off("setup", (userData) => {
    console.log(userData._id);
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });

  socket.on("leaveRoom", (user) => {
    console.log(user, "USER");
    socket.leave(user._id);
  });

  // socket.on("disconnect", (userData) => {
  //   // console.log(userData);
  //   console.log("USER DISCONNECTED");
  //   socket.leave(userData._id);
  // });
});
