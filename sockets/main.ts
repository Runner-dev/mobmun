import { Server } from "socket.io";
const io = new Server();

io.on("connection", (socket) => {
  console.log("a user connected");
});

io.listen(4040);
console.log("Socket listening on port 4040");
