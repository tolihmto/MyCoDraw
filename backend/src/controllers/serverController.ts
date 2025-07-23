import { Request, Response } from 'express';
import Server from '../models/Server';

class ServerController {
    async createServer(req: Request, res: Response) {
        try {
            const { name, maxPlayers, creator } = req.body;
            // Crée le serveur (ou récupère s'il existe)
            const updatedServer = await Server.findOneAndUpdate(
                { name },
                { $set: { maxPlayers }, $setOnInsert: { players: [] } },
                { upsert: true, new: true }
            );
            // Crée un Drawing vide et l'attache au server
            const Drawing = require('../models/Drawing').default;
            // Image PNG blanche 800x600 (canvas par défaut)
            const blankPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAYAAAAVVb0fAAAAFUlEQVQImWNgYGD4z0ABYBwAAAwAAf8BzQAAAABJRU5ErkJggg==';
            const drawingPayload: any = {
                title: `Session ${name}`,
                canvasData: blankPng,
            };
            if (creator) drawingPayload.creator = creator;
            const drawing = await Drawing.create(drawingPayload);
            console.log('[DEBUG] Drawing created:', drawing);
            updatedServer.drawings.push(drawing._id);
            await updatedServer.save();
            console.log('[DEBUG] Server drawings after save:', updatedServer.drawings);
            res.status(201).json({ server: updatedServer, drawingId: drawing._id });
        } catch (error) {
            res.status(500).json({ message: 'Error creating server', error });
        }
    }

    async listServers(req: Request, res: Response) {
        try {
            const servers = await Server.find();
            res.status(200).json(servers);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching servers', error });
        }
    }

    async joinServer(req: Request, res: Response) {
        try {
            const { serverId, playerId } = req.body;
            const server = await Server.findById(serverId);
            if (!server) {
                return res.status(404).json({ message: 'Server not found' });
            }
            if (server.players.length >= server.maxPlayers) {
                return res.status(400).json({ message: 'Server is full' });
            }
            server.players.push(playerId);
            await server.save();
            res.status(200).json(server);
        } catch (error) {
            res.status(500).json({ message: 'Error joining server', error });
        }
    }

    async leaveServer(req: Request, res: Response) {
        try {
            const { serverId, playerId } = req.body;
            const server = await Server.findById(serverId);
            if (!server) {
                return res.status(404).json({ message: 'Server not found' });
            }
            server.players = server.players.filter(player => player !== playerId);
            await server.save();
            res.status(200).json(server);
        } catch (error) {
            res.status(500).json({ message: 'Error leaving server', error });
        }
    }

    public async getServers(req: import('express').Request, res: import('express').Response): Promise<void> {
        try {
            const servers = await Server.find();
            res.json(servers.map(s => ({
                id: s._id,
                name: s.name,
                description: "",
                playerCount: s.players ? s.players.length : 0,
                status: s.isActive ? 'active' : 'museum'
            })));
        } catch (error) {
            res.status(500).json({ message: 'Error fetching servers', error });
        }
    }

    async getServerDetails(req: import('express').Request, res: import('express').Response) {
        try {
            const serverId = req.params.serverId;
            const server = await Server.findById(serverId).lean();
            if (!server) {
                return res.status(404).json({ message: 'Server not found' });
            }
            res.status(200).json(server);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching server details', error });
        }
    }

    async updateServer(req: import('express').Request, res: import('express').Response) {
        try {
            const { serverId } = req.params;
            const update = req.body;
            const updatedServer = await Server.findByIdAndUpdate(serverId, update, { new: true });
            if (!updatedServer) {
                return res.status(404).json({ message: 'Server not found' });
            }
            res.json(updatedServer);
        } catch (error) {
            res.status(500).json({ message: 'Error updating server', error });
        }
    }

    async deleteServerByName(req: import('express').Request, res: import('express').Response) {
        try {
            const { name } = req.params;
            const deleted = await Server.findOneAndDelete({ name });
            if (!deleted) {
                return res.status(404).json({ message: 'Server not found' });
            }
            res.status(200).json({ message: 'Server deleted successfully.' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting server by name', error });
        }
    }

    async deleteServer(req: import('express').Request, res: import('express').Response) {
        try {
            const { serverId } = req.params;
            const deleted = await Server.findByIdAndDelete(serverId);
            if (!deleted) {
                return res.status(404).json({ message: 'Server not found' });
            }
            res.status(200).json({ message: 'Server deleted successfully.' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting server', error });
        }
    }
}


export default ServerController;