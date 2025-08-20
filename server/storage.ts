import { type User, type InsertUser, type Idea, type InsertIdea, type Investment, type InsertInvestment, type Comment, type InsertComment } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Ideas
  getIdea(id: string): Promise<Idea | undefined>;
  getIdeasByUser(userId: string): Promise<Idea[]>;
  getPublicIdeas(filter?: string): Promise<Idea[]>;
  getFeaturedIdeas(): Promise<Idea[]>;
  createIdea(idea: InsertIdea): Promise<Idea>;
  updateIdea(id: string, updates: Partial<Idea>): Promise<Idea | undefined>;
  deleteIdea(id: string): Promise<boolean>;
  
  // Investments
  getInvestmentsByUser(userId: string): Promise<Investment[]>;
  getInvestmentsByIdea(ideaId: string): Promise<Investment[]>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  
  // Comments
  getCommentsByIdea(ideaId: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Likes
  likeIdea(userId: string, ideaId: string): Promise<void>;
  unlikeIdea(userId: string, ideaId: string): Promise<void>;
  isIdeaLiked(userId: string, ideaId: string): Promise<boolean>;
  
  // Stats
  getUserStats(userId: string): Promise<{ ideasCount: number; followersCount: number; investmentsCount: number; totalFunding: number }>;
  getIdeaStats(): Promise<{ totalIdeas: number; publicIdeas: number; totalFunding: number }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private ideas: Map<string, Idea>;
  private investments: Map<string, Investment>;
  private comments: Map<string, Comment>;
  private likes: Set<string>;
  private followers: Set<string>;

  constructor() {
    this.users = new Map();
    this.ideas = new Map();
    this.investments = new Map();
    this.comments = new Map();
    this.likes = new Set();
    this.followers = new Set();

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample user
    const sampleUser: User = {
      id: "user-1",
      username: "alexjohnson",
      email: "alex@example.com",
      name: "Alex Johnson",
      title: "Innovation Enthusiast",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      bio: "Passionate about creating innovative solutions for everyday problems",
      privateVault: false,
      twoFactorAuth: false,
      emailNotifications: true,
      createdAt: new Date(),
    };
    this.users.set(sampleUser.id, sampleUser);

    // Create sample ideas
    const sampleIdeas: Idea[] = [
      {
        id: "idea-1",
        userId: "user-1",
        title: "Smart Home Garden System",
        description: "Automated irrigation and monitoring system for urban gardening using IoT sensors.",
        category: "Technology",
        problemStatement: "Urban dwellers struggle to maintain gardens due to busy schedules and lack of gardening expertise.",
        solution: "An IoT-based system that monitors soil moisture, light levels, and plant health, automatically watering plants and providing care recommendations via a mobile app.",
        targetAudience: "Urban professionals, apartment dwellers, gardening enthusiasts",
        tags: ["IoT", "Agriculture", "Sustainability"],
        status: "public",
        likes: 23,
        comments: 8,
        funding: "2400.00",
        investorCount: 12,
        featured: true,
        createdAt: new Date("2024-03-15"),
        updatedAt: new Date("2024-03-15"),
      },
      {
        id: "idea-2",
        userId: "user-1",
        title: "AI-Powered Study Assistant",
        description: "Personalized learning platform that adapts to individual student's learning patterns and preferences.",
        category: "Education",
        problemStatement: "Students struggle with one-size-fits-all educational approaches and lack personalized study guidance.",
        solution: "An AI assistant that analyzes learning patterns, creates personalized study plans, and provides adaptive content recommendations.",
        targetAudience: "Students, educators, lifelong learners",
        tags: ["AI", "Education", "ML"],
        status: "draft",
        likes: 0,
        comments: 0,
        funding: "0.00",
        investorCount: 0,
        featured: false,
        createdAt: new Date("2024-03-14"),
        updatedAt: new Date("2024-03-14"),
      },
      {
        id: "idea-3",
        userId: "user-1",
        title: "Blockchain Carbon Credits",
        description: "Transparent carbon credit marketplace using blockchain technology for environmental impact tracking.",
        category: "Environment",
        problemStatement: "Current carbon credit systems lack transparency and are prone to fraud and double-counting.",
        solution: "A blockchain-based platform that provides transparent, immutable tracking of carbon credits with smart contract automation.",
        targetAudience: "Corporations, environmental organizations, government agencies",
        tags: ["Blockchain", "Environment", "FinTech"],
        status: "investment_open",
        likes: 45,
        comments: 12,
        funding: "8200.00",
        investorCount: 28,
        featured: true,
        createdAt: new Date("2024-03-12"),
        updatedAt: new Date("2024-03-12"),
      },
    ];

    sampleIdeas.forEach(idea => this.ideas.set(idea.id, idea));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      title: insertUser.title || "Innovator",
      profileImage: insertUser.profileImage ?? null,
      bio: insertUser.bio ?? null,
      privateVault: insertUser.privateVault ?? false,
      twoFactorAuth: insertUser.twoFactorAuth ?? false,
      emailNotifications: insertUser.emailNotifications ?? true,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getIdea(id: string): Promise<Idea | undefined> {
    return this.ideas.get(id);
  }

  async getIdeasByUser(userId: string): Promise<Idea[]> {
    return Array.from(this.ideas.values()).filter(idea => idea.userId === userId);
  }

  async getPublicIdeas(filter?: string): Promise<Idea[]> {
    let ideas = Array.from(this.ideas.values()).filter(idea => idea.status === "public" || idea.status === "investment_open");
    
    if (filter === "trending") {
      ideas.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
    } else if (filter === "most_funded") {
      ideas.sort((a, b) => parseFloat(b.funding) - parseFloat(a.funding));
    } else {
      ideas.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    return ideas;
  }

  async getFeaturedIdeas(): Promise<Idea[]> {
    return Array.from(this.ideas.values()).filter(idea => idea.featured);
  }

  async createIdea(insertIdea: InsertIdea): Promise<Idea> {
    const id = randomUUID();
    const idea: Idea = {
      ...insertIdea,
      id,
      userId: "user-1",
      status: insertIdea.status || "draft",
      problemStatement: insertIdea.problemStatement ?? null,
      solution: insertIdea.solution ?? null,
      targetAudience: insertIdea.targetAudience ?? null,
      tags: insertIdea.tags ?? [],
      likes: 0,
      comments: 0,
      funding: "0.00",
      investorCount: 0,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.ideas.set(id, idea);
    return idea;
  }

  async updateIdea(id: string, updates: Partial<Idea>): Promise<Idea | undefined> {
    const idea = this.ideas.get(id);
    if (!idea) return undefined;
    
    const updatedIdea = { ...idea, ...updates, updatedAt: new Date() };
    this.ideas.set(id, updatedIdea);
    return updatedIdea;
  }

  async deleteIdea(id: string): Promise<boolean> {
    return this.ideas.delete(id);
  }

  async getInvestmentsByUser(userId: string): Promise<Investment[]> {
    return Array.from(this.investments.values()).filter(investment => investment.userId === userId);
  }

  async getInvestmentsByIdea(ideaId: string): Promise<Investment[]> {
    return Array.from(this.investments.values()).filter(investment => investment.ideaId === ideaId);
  }

  async createInvestment(insertInvestment: InsertInvestment): Promise<Investment> {
    const id = randomUUID();
    const investment: Investment = {
      ...insertInvestment,
      id,
      roi: "0.00",
      createdAt: new Date(),
    };
    this.investments.set(id, investment);
    
    // Update idea funding
    const idea = this.ideas.get(insertInvestment.ideaId);
    if (idea) {
      const newFunding = parseFloat(idea.funding || "0") + parseFloat(insertInvestment.amount);
      const updatedIdea = { 
        ...idea, 
        funding: newFunding.toFixed(2),
        investorCount: (idea.investorCount || 0) + 1 
      };
      this.ideas.set(insertInvestment.ideaId, updatedIdea);
    }
    
    return investment;
  }

  async getCommentsByIdea(ideaId: string): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(comment => comment.ideaId === ideaId);
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = {
      ...insertComment,
      id,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);
    
    // Update idea comment count
    const idea = this.ideas.get(insertComment.ideaId);
    if (idea) {
      const updatedIdea = { ...idea, comments: idea.comments + 1 };
      this.ideas.set(insertComment.ideaId, updatedIdea);
    }
    
    return comment;
  }

  async likeIdea(userId: string, ideaId: string): Promise<void> {
    const key = `${userId}-${ideaId}`;
    if (!this.likes.has(key)) {
      this.likes.add(key);
      
      // Update idea like count
      const idea = this.ideas.get(ideaId);
      if (idea) {
        const updatedIdea = { ...idea, likes: idea.likes + 1 };
        this.ideas.set(ideaId, updatedIdea);
      }
    }
  }

  async unlikeIdea(userId: string, ideaId: string): Promise<void> {
    const key = `${userId}-${ideaId}`;
    if (this.likes.has(key)) {
      this.likes.delete(key);
      
      // Update idea like count
      const idea = this.ideas.get(ideaId);
      if (idea) {
        const updatedIdea = { ...idea, likes: Math.max(0, idea.likes - 1) };
        this.ideas.set(ideaId, updatedIdea);
      }
    }
  }

  async isIdeaLiked(userId: string, ideaId: string): Promise<boolean> {
    return this.likes.has(`${userId}-${ideaId}`);
  }

  async getUserStats(userId: string): Promise<{ ideasCount: number; followersCount: number; investmentsCount: number; totalFunding: number }> {
    const userIdeas = await this.getIdeasByUser(userId);
    const userInvestments = await this.getInvestmentsByUser(userId);
    
    const totalFunding = userIdeas.reduce((sum, idea) => sum + parseFloat(idea.funding), 0);
    
    return {
      ideasCount: userIdeas.length,
      followersCount: 0, // TODO: Implement followers logic
      investmentsCount: userInvestments.length,
      totalFunding,
    };
  }

  async getIdeaStats(): Promise<{ totalIdeas: number; publicIdeas: number; totalFunding: number }> {
    const allIdeas = Array.from(this.ideas.values());
    const publicIdeas = allIdeas.filter(idea => idea.status === "public" || idea.status === "investment_open");
    const totalFunding = allIdeas.reduce((sum, idea) => sum + parseFloat(idea.funding), 0);
    
    return {
      totalIdeas: allIdeas.length,
      publicIdeas: publicIdeas.length,
      totalFunding,
    };
  }
}

export const storage = new MemStorage();
