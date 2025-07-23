import { Server, Socket } from "socket.io";

interface DrawingData {
    roomId: string;
    // Ajoute d'autres propriétés liées au dessin si besoin
}

const drawingSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("[SOCKET][CONNECTION] id:", socket.id);

        socket.on("joinRoom", (roomId: string) => {
            socket.join(roomId);
            console.log(`[SOCKET][JOIN] User ${socket.id} joined room: ${roomId}`);
        });

        socket.on("drawing", (data: DrawingData) => {
            console.log(`[SOCKET][DRAWING] Reçu de ${socket.id} pour room ${data.roomId}`, data);
            socket.to(data.roomId).emit("drawing", data);
        });

        socket.on("requestCanvasState", (roomId: string) => {
            console.log(`[SOCKET][REQ_CANVAS] ${socket.id} demande l'état du canvas pour room ${roomId}`);
            socket.to(roomId).emit("requestCanvasState", roomId);
        });

        socket.on("canvasState", (data: { roomId: string, canvasData: string }) => {
            console.log(`[SOCKET][CANVAS_STATE] ${socket.id} envoie l'état du canvas pour room ${data.roomId}`);
            socket.to(data.roomId).emit("canvasState", { canvasData: data.canvasData });
        });

        socket.on("disconnect", () => {
            console.log(`[SOCKET][DISCONNECT] User disconnected: ${socket.id}`);
        });
    });
};

export default drawingSocket;