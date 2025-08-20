import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertIdeaSchema, 
  insertInvestmentSchema, 
  insertCommentSchema,
  insertMarketListingSchema,
  insertTransactionSchema,
  insertUserWalletSchema
} from "@shared/schema";
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

  // Get all users
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to get users" });
    }
  });

  // Get specific user
  app.get("/api/user/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Connect to user
  app.post("/api/user/:userId/connect/:targetUserId", async (req, res) => {
    try {
      const { userId, targetUserId } = req.params;
      await storage.connectToUser(userId, targetUserId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to connect to user" });
    }
  });

  // Disconnect from user
  app.delete("/api/user/:userId/connect/:targetUserId", async (req, res) => {
    try {
      const { userId, targetUserId } = req.params;
      await storage.disconnectFromUser(userId, targetUserId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to disconnect from user" });
    }
  });

  // Check connection status
  app.get("/api/user/:userId/connected/:targetUserId", async (req, res) => {
    try {
      const { userId, targetUserId } = req.params;
      const isConnected = await storage.isConnected(userId, targetUserId);
      res.json({ connected: isConnected });
    } catch (error) {
      res.status(500).json({ message: "Failed to check connection" });
    }
  });

  // Get user connections
  app.get("/api/user/:userId/connections", async (req, res) => {
    try {
      const { userId } = req.params;
      const connections = await storage.getConnections(userId);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ message: "Failed to get connections" });
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

  // Private Market Routes
  
  // User Wallet
  app.get("/api/user/:id/wallet", async (req, res) => {
    try {
      const { id } = req.params;
      const wallet = await storage.getUserWallet(id);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ message: "Failed to get wallet" });
    }
  });

  app.put("/api/user/:id/wallet", async (req, res) => {
    try {
      const { id } = req.params;
      const { credits } = req.body;
      const wallet = await storage.updateUserWallet(id, credits);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ message: "Failed to update wallet" });
    }
  });

  // Market Listings
  app.get("/api/market/listings", async (req, res) => {
    try {
      const { industry, status } = req.query;
      const filter: { industry?: string; status?: string } = {};
      if (industry) filter.industry = industry as string;
      if (status) filter.status = status as string;
      
      const listings = await storage.getAllMarketListings(filter);
      res.json(listings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get market listings" });
    }
  });

  app.get("/api/market/listings/featured", async (req, res) => {
    try {
      const listings = await storage.getFeaturedMarketListings();
      res.json(listings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get featured listings" });
    }
  });

  app.get("/api/market/listings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const listing = await storage.getMarketListing(id);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      res.json(listing);
    } catch (error) {
      res.status(500).json({ message: "Failed to get listing" });
    }
  });

  app.get("/api/market/listings/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const listings = await storage.getMarketListingsByUser(userId);
      res.json(listings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user listings" });
    }
  });

  app.post("/api/market/listings", async (req, res) => {
    try {
      const validatedData = insertMarketListingSchema.parse(req.body);
      const listing = await storage.createMarketListing(validatedData);
      res.status(201).json(listing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid listing data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create listing" });
    }
  });

  // Transactions
  app.get("/api/market/transactions/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const transactions = await storage.getTransactionsByUser(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user transactions" });
    }
  });

  app.get("/api/market/transactions/listing/:listingId", async (req, res) => {
    try {
      const { listingId } = req.params;
      const transactions = await storage.getTransactionsByListing(listingId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get listing transactions" });
    }
  });

  app.post("/api/market/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      
      // Check if user has enough credits
      const wallet = await storage.getUserWallet(validatedData.buyerId);
      if (!wallet) {
        return res.status(404).json({ message: "Buyer wallet not found" });
      }
      
      const totalCost = validatedData.shares * parseFloat(validatedData.pricePerShare);
      if (parseFloat(wallet.credits) < totalCost) {
        return res.status(400).json({ message: "Insufficient credits" });
      }
      
      // Check if enough shares are available
      const listing = await storage.getMarketListing(validatedData.listingId);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      if (listing.availableShares < validatedData.shares) {
        return res.status(400).json({ message: "Not enough shares available" });
      }
      
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  // Holdings
  app.get("/api/market/holdings/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const holdings = await storage.getUserHoldings(userId);
      res.json(holdings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user holdings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
