import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";
import { Assignment } from "../shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the parking system
  app.get("/api/parking/state", async (req, res) => {
    try {
      const state = await storage.getState();
      res.json({ state });
    } catch (error) {
      res.status(500).json({ message: "Failed to get state" });
    }
  });

  app.post("/api/parking/start", async (req, res) => {
    try {
      const state = await storage.startSelection();
      res.json({ state });
    } catch (error) {
      res.status(500).json({ message: "Failed to start selection" });
    }
  });

  app.post("/api/parking/draw", async (req, res) => {
    try {
      const { assignment, state } = await storage.drawNext();
      res.json({ assignment, state });
    } catch (error) {
      console.error("Failed to draw next parking spot:", error);
      res.status(500).json({ message: "Failed to draw next parking spot" });
    }
  });

  app.post("/api/parking/reset", async (req, res) => {
    try {
      await storage.resetSelection();
      res.json({ success: true });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to reset selection", success: false });
    }
  });

  // CSV 匯出端點
  app.get("/api/parking/export-csv", async (req, res) => {
    try {
      const state = await storage.getState();
      const assignments = state.assignments;
      const secondRoundAssignments = state.secondRoundAssignments || [];

      if (assignments.length === 0) {
        return res.status(400).json({ message: "目前沒有分配的停車位" });
      }

      // 創建 CSV 內容
      let csvContent = "Unit,Building,ParkingSpot\n";

      assignments.forEach((assignment: Assignment) => {
        csvContent += `${assignment.unit},${assignment.building},${assignment.spot}\n`;
      });

      // 如果有第二輪抽籤的分配，添加到 CSV內容
      if (secondRoundAssignments.length > 0) {
        secondRoundAssignments.forEach((assignment: Assignment) => {
          csvContent += `${assignment.unit},${assignment.building},${assignment.spot}\n`;
        });
      }

      // 設置檔案名稱包含當前日期
      const date = new Date();
      const dateStr = `${date.getFullYear()}${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
      const fileName = `parking_assignment_${dateStr}.csv`;

      // 設置 HTTP header
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );

      // 回傳 CSV 內容
      res.status(200).send(csvContent);
    } catch (error) {
      console.error("Failed to export CSV:", error);
      res.status(500).json({ message: "Failed to export CSV" });
    }
  });

  // POST /api/parking/start-second - Start second round selection
  app.post("/api/parking/start-second", async (req, res) => {
    try {
      const state = await storage.startSecondRound();
      res.json({ state });
    } catch (error) {
      console.error("Error starting second round:", error);
      res.status(500).json({ error: "Failed to start second round" });
    }
  });

  // POST /api/parking/draw-second - Draw next spot for second round
  app.post("/api/parking/draw-second", async (req, res) => {
    try {
      const result = await storage.drawNextSecond();
      res.json(result);
    } catch (error) {
      console.error("Error drawing second spot:", error);
      res.status(500).json({ error: "Failed to draw second spot" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
