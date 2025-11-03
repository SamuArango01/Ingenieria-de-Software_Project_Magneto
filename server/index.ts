
import "dotenv/config";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import fs from "fs";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { AppDataSource } from "@/database/data-source";
import router from "@/routes";
import morgan from "morgan";
import { clerkMiddleware } from '@clerk/express';
import { syncUserMiddleware } from "@/middleware/syncUserMiddleware";
import { socketAuthMiddleware } from "@/middleware/socketAuthMiddleware";
import { InterviewTTSSocketController } from "@/modules/interviews-tts/controllers/InterviewTTSSocketController";

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3211;

// Socket.IO server setup
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    },
    maxHttpBufferSize: 1e7 // 10MB for audio chunks
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");

        // Setup Socket.IO namespace for TTS interviews
        const interviewNamespace = io.of('/interviews-tts');
        interviewNamespace.use(socketAuthMiddleware);

        interviewNamespace.on('connection', (socket) => {
            console.log(`[Socket.IO] User connected: ${socket.data.userId}`);

            // Initialize controller for this socket
            new InterviewTTSSocketController(socket, interviewNamespace);
        });

        httpServer.listen(PORT, () => {
            console.log("Server running on port", PORT);
            console.log("Socket.IO namespace /interviews-tts ready");
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Middlewares
app.use(clerkMiddleware());
app.use(syncUserMiddleware);

// Crear carpeta uploads si no existe
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

// Ruta de salud
app.get("/", (_, res) => {
    res.json({ message: "API funcionando correctamente" });
});

// TODAS las rutas de la API
app.use("/api/v1", router);

export default app;