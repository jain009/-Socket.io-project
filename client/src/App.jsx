import React, { useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { TextField, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";

const App = () => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState("");
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [room, setRoom] = useState("");
    const [socketId, setSocketId] = useState("");

    useEffect(() => {
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleConnect = () => {
            console.log("Connected to server with id:", socket.id);
            setSocketId(socket.id);
        };

        const handleMessage = (data) => {
            console.log("Received message:", data);
            setReceivedMessages((prev) => [...prev, data]);
        };

        const handleReceiveMessage = (data) => {
            console.log("Received a message in the room", data);
            setReceivedMessages((prev) => [...prev, `Message in ${room}: ${data}`]);
        };

        socket.on("connect", handleConnect);
        socket.on("message", handleMessage);
        socket.on("receive-message", handleReceiveMessage);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("message", handleMessage);
            socket.off("receive-message", handleReceiveMessage);
        };
    }, [socket, room]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (socket) {
            console.log("Emitting message from", socketId, "to room", room, ":", message);
            socket.emit("message", { message: message, room: room });
            setMessage("");
        }
    };

    const joinRoom = () => {
        if (socket && room) {
            socket.emit("joinRoom", room);
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            bgcolor="#f0f0f0"
            padding={2}
        >
            <Typography variant="h1" gutterBottom component="div" color="primary">
                Welcome to the Chat Application
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "400px", marginBottom: 20 }}>
                <TextField
                    fullWidth
                    label="Message"
                    variant="outlined"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Room"
                    variant="outlined"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    margin="normal"
                />
                <Button fullWidth variant="contained" color="primary" type="submit" style={{ marginTop: 10 }}>
                    Send
                </Button>
            </form>

            <Button variant="contained" color="secondary" onClick={joinRoom} disabled={!room} style={{ marginBottom: 20 }}>
                Join Room
            </Button>

            <Box
                width="100%"
                maxWidth="400px"
                bgcolor="white"
                borderRadius={8}
                padding={2}
                boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
            >
                <Typography variant="h4" gutterBottom component="div">
                    Received Messages:
                </Typography>
                {receivedMessages.map((msg, index) => (
                    <Typography key={index} variant="body1" gutterBottom>
                        {msg}
                    </Typography>
                ))}
            </Box>
        </Box>
    );
};

export default App;
