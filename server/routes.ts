import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertIdeaSchema, insertInvestmentSchema, insertCommentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Current user (mock authentication)
  app.get("/api/user/current", async (req, res) => {
    // For demo purposes, return the sample user
    const user = await storage.getUser("user-1");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });

  // Update user profile
  app.put("/api/user/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedUser = await storage.updateUser(id, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Get user stats
  app.get("/api/user/:id/stats", async (req, res) => {
    try {
      const { id } = req.params;
      const stats = await storage.getUserStats(id);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user stats" });
    }
  });

  // Get global stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getIdeaStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get stats" });
    }
  });

  // Get ideas by user
  app.get("/api/ideas/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const ideas = await storage.getIdeasByUser(userId);
      res.json(ideas);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user ideas" });
    }
  });

  // Get public ideas
  app.get("/api/ideas/public", async (req, res) => {
    try {
      const { filter } = req.query;
      const ideas = await storage.getPublicIdeas(filter as string);
      res.json(ideas);
    } catch (error) {
      res.status(500).json({ message: "Failed to get public ideas" });
    }
  });

  // Get featured ideas
  app.get("/api/ideas/featured", async (req, res) => {
    try {
      const ideas = await storage.getFeaturedIdeas();
      res.json(ideas);
    } catch (error) {
      res.status(500).json({ message: "Failed to get featured ideas" });
    }
  });

  // Create idea
  app.post("/api/ideas", async (req, res) => {
    try {
      const ideaData = insertIdeaSchema.parse(req.body);
      const idea = await storage.createIdea(ideaData);
      res.status(201).json(idea);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid idea data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create idea" });
    }
  });

  // Update idea
  app.put("/api/ideas/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedIdea = await storage.updateIdea(id, req.body);
      if (!updatedIdea) {
        return res.status(404).json({ message: "Idea not found" });
      }
      res.json(updatedIdea);
    } catch (error) {
      res.status(500).json({ message: "Failed to update idea" });
    }
  });

  // Delete idea
  app.delete("/api/ideas/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteIdea(id);
      if (!deleted) {
        return res.status(404).json({ message: "Idea not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete idea" });
    }
  });

  // Like/Unlike idea
  app.post("/api/ideas/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      const userId = "user-1"; // Mock current user
      
      const isLiked = await storage.isIdeaLiked(userId, id);
      if (isLiked) {
        await storage.unlikeIdea(userId, id);
      } else {
        await storage.likeIdea(userId, id);
      }
      
      res.json({ liked: !isLiked });
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  // Create investment
  app.post("/api/investments", async (req, res) => {
    try {
      const investmentData = insertInvestmentSchema.parse(req.body);
      const investment = await storage.createInvestment({ ...investmentData, userId: "user-1" });
      res.status(201).json(investment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid investment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create investment" });
    }
  });

  // Get user investments
  app.get("/api/investments/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const investments = await storage.getInvestmentsByUser(userId);
      res.json(investments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get investments" });
    }
  });

  // Create comment
  app.post("/api/comments", async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment({ ...commentData, userId: "user-1" });
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Get comments by idea
  app.get("/api/comments/idea/:ideaId", async (req, res) => {
    try {
      const { ideaId } = req.params;
      const comments = await storage.getCommentsByIdea(ideaId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get comments" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
