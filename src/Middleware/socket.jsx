import { io } from "socket.io-client";

const socket = io("https://multi-player-chess.onrender.com");

export default socket;