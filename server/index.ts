
import "dotenv/config";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import fs from "fs";
import { AppDataSource } from "@/database/data-source";
import router from "@/routes";
import morgan from "morgan";
import { clerkMiddleware } from '@clerk/express';
import { syncUserMiddleware } from "@/middleware/syncUserMiddleware";

const app = express();
const PORT = process.env.PORT || 3211;

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        app.listen(PORT, () => {
            console.log("Server running on port", PORT);
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