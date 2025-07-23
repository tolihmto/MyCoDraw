import { Request, Response } from 'express';
import Drawing from '../models/Drawing';
import mongoose from 'mongoose';

class DrawingController {
    // Save a drawing to the database
    async saveDrawing(req: Request, res: Response) {
        try {
            const { userId, drawingData } = req.body;
            const newDrawing = new Drawing({ userId, drawingData });
            await newDrawing.save();
            res.status(201).json({ message: 'Drawing saved successfully', drawing: newDrawing });
        } catch (error) {
            res.status(500).json({ message: 'Error saving drawing', error });
        }
    }

    // Retrieve all drawings for a user
    async getUserDrawings(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const drawings = await Drawing.find({ userId });
            res.status(200).json(drawings);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving drawings', error });
        }
    }

    // Retrieve a specific drawing by ID
    async getDrawingById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const drawing = await Drawing.findById(id);
            if (!drawing) {
                return res.status(404).json({ message: 'Drawing not found' });
            }
            res.status(200).json(drawing);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving drawing', error });
        }
    }

    // Immortalize a drawing: set isImmortalized to true and update canvasData
    async immortalizeDrawing(req: import('express').Request, res: import('express').Response) {
        try {
            const { drawingId } = req.params;
            const { canvasData } = req.body;
            const drawing = await Drawing.findById(drawingId);
            if (!drawing) {
                return res.status(404).json({ message: 'Drawing not found' });
            }
            drawing.isImmortalized = true;
            if (canvasData) drawing.canvasData = canvasData;
            await drawing.save();
            res.status(200).json({ message: 'Drawing immortalized', drawing });
        } catch (error) {
            res.status(500).json({ message: 'Error immortalizing drawing', error });
        }
    }

    // Update canvasData for auto-save
    async updateCanvasData(req: import('express').Request, res: import('express').Response) {
        try {
            const { drawingId } = req.params;
            const { canvasData } = req.body;
            if (!mongoose.Types.ObjectId.isValid(drawingId)) {
                return res.status(400).json({ message: 'Invalid drawingId' });
            }
            const drawing = await Drawing.findById(drawingId);
            if (!drawing) {
                return res.status(404).json({ message: 'Drawing not found' });
            }
            if (drawing.isImmortalized) {
                return res.status(403).json({ message: 'Drawing is immortalized and cannot be updated.' });
            }
            drawing.canvasData = canvasData;
            await drawing.save();
            res.status(200).json({ message: 'Canvas data updated', drawing });
        } catch (error) {
            res.status(500).json({ message: 'Error updating canvas data', error });
        }
    }

    async getDrawing(req: import('express').Request, res: import('express').Response) {
        try {
            const { drawingId } = req.params;
            if (!mongoose.Types.ObjectId.isValid(drawingId)) {
                return res.status(400).json({ message: 'Invalid drawingId' });
            }
            const drawing = await Drawing.findById(drawingId);
            if (!drawing) {
                return res.status(404).json({ message: 'Drawing not found' });
            }
            res.status(200).json({ drawing });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching drawing', error });
        }
    }
}

export default DrawingController;