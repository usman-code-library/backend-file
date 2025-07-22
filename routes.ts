import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertComponentSchema, updateComponentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all components
  app.get("/api/components", async (req, res) => {
    try {
      const components = await storage.getComponents();
      res.json(components);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch components" });
    }
  });

  // Get single component
  app.get("/api/components/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const component = await storage.getComponent(id);
      
      if (!component) {
        return res.status(404).json({ message: "Component not found" });
      }
      
      res.json(component);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch component" });
    }
  });

  // Create new component
  app.post("/api/components", async (req, res) => {
    try {
      const validatedData = insertComponentSchema.parse(req.body);
      const component = await storage.createComponent(validatedData);
      res.status(201).json(component);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create component" });
      }
    }
  });

  // Update component
  app.put("/api/components/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateComponentSchema.parse(req.body);
      const component = await storage.updateComponent(id, validatedData);
      
      if (!component) {
        return res.status(404).json({ message: "Component not found" });
      }
      
      res.json(component);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update component" });
      }
    }
  });

  // Soft delete component
  app.patch("/api/components/:id/delete", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const component = await storage.softDeleteComponent(id);
      
      if (!component) {
        return res.status(404).json({ message: "Component not found" });
      }
      
      res.json(component);
    } catch (error) {
      res.status(500).json({ message: "Failed to delete component" });
    }
  });

  // Toggle favorite
  app.patch("/api/components/:id/favorite", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const component = await storage.toggleFavorite(id);
      
      if (!component) {
        return res.status(404).json({ message: "Component not found" });
      }
      
      res.json(component);
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle favorite" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
