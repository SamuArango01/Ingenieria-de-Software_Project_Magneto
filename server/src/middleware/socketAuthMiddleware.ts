import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { verifyToken } from "@clerk/express";

/**
 * Socket.IO middleware to authenticate users via Clerk JWT token
 * Token should be passed in socket.handshake.auth.token
 */
export const socketAuthMiddleware = async (
    socket: Socket,
    next: (err?: ExtendedError) => void
) => {
    try {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error("Authentication token missing"));
        }

        // Verify Clerk token
        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
        });

        if (!payload || !payload.sub) {
            return next(new Error("Invalid authentication token"));
        }

        // Attach userId to socket for later use
        socket.data.userId = payload.sub;

        next();
    } catch (error) {
        console.error("Socket auth error:", error);
        next(new Error("Authentication failed"));
    }
};
