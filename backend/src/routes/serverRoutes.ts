import { Router } from 'express';
import ServerController from '../controllers/serverController';

const router = Router();
const serverController = new ServerController();

// Route to create a new server
router.post('/create', serverController.createServer);

// Route to get the list of available servers
router.get('/', serverController.getServers);

// Route to join a server
router.post('/join/:serverId', serverController.joinServer);

// Route to get server details
router.get('/:serverId', serverController.getServerDetails);

// Route to update a server
router.patch('/:serverId', serverController.updateServer);

// Route to delete a server by name
router.delete('/by-name/:name', serverController.deleteServerByName);

// Route to delete a server
router.delete('/:serverId', serverController.deleteServer);

export default router;