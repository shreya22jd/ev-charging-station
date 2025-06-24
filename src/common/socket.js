// src/common/socket.js
import { io } from "socket.io-client";

// Replace with your actual backend IP or URL
const socket = io("http://192.168.29.243:5000", {
  transports: ['websocket'],
  autoConnect: true,
});

export default socket;
