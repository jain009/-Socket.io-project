import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import { Typography } from '@mui/material';

const App = () => {
    const [socket, setSocket] = useState(null); // Store the socket instance
    const [message, setMessage] = useState("");
    const [receivedMessages, setReceivedMessages] = useState([]); // Store received messages

    useEffect(() => {
        const newSocket = io("http://localhost:3000"); // Connect in useEffect
        setSocket(newSocket);

        return () => {
            newSocket.disconnect(); // Cleanup on component unmount
        };
    }, []); // Empty dependency array, only run once on mount

    useEffect(() => {
        if (!socket) return; // Don't proceed if socket is not yet connected

        const handleConnect = () => {
            console.log("Connected to server with id:", socket.id);
        };

        const handleMessage = (data) => {
            console.log("Received message:", data);
            setReceivedMessages(prev => [...prev, data]); // Update state with new message
        };

        socket.on("connect", handleConnect);
        socket.on("message", handleMessage);

        // Send a message on initial connection (optional)
        socket.emit("message", "Hello from client");

        return () => {
            socket.off("connect", handleConnect); // Clean up listeners
            socket.off("message", handleMessage);
        };
    }, [socket]); // Dependency on socket, re-run when socket changes (on initial connection)


    const handleSubmit = (e) => {
        e.preventDefault();
        if (socket) {
            socket.emit("message", message);
            setMessage(""); // Clear input after sending
        }
    };

    return (
        <>

            <Typography variant='h1' gutterBottom component="div">
                Welcome to the chat application built by aj
            </Typography>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button type='submit'>Send</button>
            </form>
            <div>
                <h2>Received Messages:</h2>
                {receivedMessages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>

        </>
    );
};

export default App;
