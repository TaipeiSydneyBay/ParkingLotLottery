import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the parking system
  app.get('/api/parking/state', async (req, res) => {
    try {
      const state = await storage.getState();
      res.json({ state });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get state' });
    }
  });

  app.post('/api/parking/start', async (req, res) => {
    try {
      const state = await storage.startSelection();
      res.json({ state });
    } catch (error) {
      res.status(500).json({ message: 'Failed to start selection' });
    }
  });

  app.post('/api/parking/draw', async (req, res) => {
    try {
      const { assignment, state } = await storage.drawNext();
      res.json({ assignment, state });
    } catch (error) {
      res.status(500).json({ message: 'Failed to draw next parking spot' });
    }
  });

  app.post('/api/parking/reset', async (req, res) => {
    try {
      await storage.resetSelection();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Failed to reset selection', success: false });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
