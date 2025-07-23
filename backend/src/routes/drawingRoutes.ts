import { Router } from 'express';
import DrawingController from '../controllers/drawingController';

const router = Router();
const drawingController = new DrawingController();

// Route to save a drawing
router.post('/', drawingController.saveDrawing);

// Route to get a specific drawing
router.get('/:drawingId', drawingController.getDrawing);

// Route to get all drawings for a user
router.get('/user/:userId', drawingController.getUserDrawings);

// Route to immortalize a drawing
router.post('/:drawingId/immortalize', drawingController.immortalizeDrawing);

// Route to update canvas data (auto-save)
router.patch('/:drawingId/canvas', drawingController.updateCanvasData);

// Route debug pour lister tous les drawings
router.get('/debug/list', async (req, res) => {
  const Drawing = require('../models/Drawing').default;
  const all = await Drawing.find({});
  res.json(all);
});

// Route de test pour debug
router.get('/ping', (req, res) => res.send('pong'));

export default router;