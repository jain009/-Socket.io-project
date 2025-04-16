import express from "express";
import { createServer } from "http";
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const port = 3000;
const server = createServer(app);
// http network provides foundation for our Socket.io server

app.use(cors());
// we create a server on top of the http server handsake
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Remove trailing slash
        methods: ["GET", "POST"],
    }
});


app.get("/", (req, res) => {
    res.send("Welcome to the chat application built by - acciojob");
})

// this is socket function that establishes a live connection
io.on("connection", (socket) => {
    console.log("a user has been connected");
    console.log("with id", socket.id);

    socket.on("message", (data) => {
        console.log("Server received:", data);
        io.emit("message", data); // Broadcast to all clients including sender.
    });

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
    });
});

server.listen(port, () => {
    console.log(`server is live on port ${port}`);
});