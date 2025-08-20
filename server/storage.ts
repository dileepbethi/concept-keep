import { type User, type InsertUser, type Idea, type InsertIdea, type Investment, type InsertInvestment, type Comment, type InsertComment } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
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
  
  // Connections
  connectToUser(userId: string, targetUserId: string): Promise<void>;
  disconnectFromUser(userId: string, targetUserId: string): Promise<void>;
  isConnected(userId: string, targetUserId: string): Promise<boolean>;
  getConnections(userId: string): Promise<User[]>;
  
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
  private connections: Set<string>;

  constructor() {
    this.users = new Map();
    this.ideas = new Map();
    this.investments = new Map();
    this.comments = new Map();
    this.likes = new Set();
    this.followers = new Set();
    this.connections = new Set();

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create multiple diverse users
    const sampleUsers: User[] = [
      {
        id: "user-1",
        username: "alexjohnson",
        email: "alex@example.com",
        name: "Alex Johnson",
        title: "Innovation Enthusiast",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        bio: "Passionate about creating innovative solutions for everyday problems. Always looking for the next breakthrough.",
        privateVault: false,
        twoFactorAuth: false,
        emailNotifications: true,
        createdAt: new Date("2024-02-15"),
      },
      {
        id: "user-2",
        username: "mariagarcia",
        email: "maria@example.com",
        name: "Maria Garcia",
        title: "Sustainability Expert",
        profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b5c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        bio: "Environmental engineer focused on clean tech solutions. Building a sustainable future one idea at a time.",
        privateVault: false,
        twoFactorAuth: true,
        emailNotifications: true,
        createdAt: new Date("2024-01-20"),
      },
      {
        id: "user-3",
        username: "davidchen",
        email: "david@example.com",
        name: "David Chen",
        title: "Tech Entrepreneur",
        profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        bio: "Serial entrepreneur and software architect. Love building products that solve real problems at scale.",
        privateVault: false,
        twoFactorAuth: false,
        emailNotifications: false,
        createdAt: new Date("2024-01-10"),
      },
      {
        id: "user-4",
        username: "emilywilson",
        email: "emily@example.com",
        name: "Emily Wilson",
        title: "Healthcare Innovator",
        profileImage: "https://images.unsplash.com/photo-1543132220-4bf3de6e10ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        bio: "Medical doctor turned healthtech entrepreneur. Making healthcare more accessible through technology.",
        privateVault: false,
        twoFactorAuth: true,
        emailNotifications: true,
        createdAt: new Date("2024-02-01"),
      },
      {
        id: "user-5",
        username: "jamessmith",
        email: "james@example.com",
        name: "James Smith",
        title: "FinTech Visionary",
        profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        bio: "Former Wall Street analyst building the future of finance. Democratizing investment through innovation.",
        privateVault: true,
        twoFactorAuth: true,
        emailNotifications: false,
        createdAt: new Date("2024-01-25"),
      },
      {
        id: "user-6",
        username: "sarahkim",
        email: "sarah@example.com",
        name: "Sarah Kim",
        title: "AI Research Scientist",
        profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        bio: "PhD in Machine Learning exploring AI's potential to transform society. Making AI accessible to everyone.",
        privateVault: false,
        twoFactorAuth: false,
        emailNotifications: true,
        createdAt: new Date("2024-02-10"),
      },
      {
        id: "user-7",
        username: "mikebrown",
        email: "mike@example.com",
        name: "Mike Brown",
        title: "Social Impact Founder",
        profileImage: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        bio: "Building technology solutions for social good. Every line of code should make the world a better place.",
        privateVault: false,
        twoFactorAuth: false,
        emailNotifications: true,
        createdAt: new Date("2024-01-30"),
      }
    ];

    sampleUsers.forEach(user => this.users.set(user.id, user));

    // Create diverse ideas for each user
    const sampleIdeas: Idea[] = [
      // Alex Johnson's ideas
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

      // Maria Garcia's ideas
      {
        id: "idea-4",
        userId: "user-2",
        title: "Ocean Plastic Recycling Platform",
        description: "Decentralized system connecting beach cleanup volunteers with plastic recycling facilities.",
        category: "Environment",
        problemStatement: "Ocean plastic waste continues to grow while recycling infrastructure remains disconnected from cleanup efforts.",
        solution: "A platform that rewards volunteers for collecting ocean plastic and connects them directly with recycling facilities for processing.",
        targetAudience: "Environmental organizations, coastal communities, recycling companies",
        tags: ["Sustainability", "Ocean", "Recycling"],
        status: "public",
        likes: 31,
        comments: 15,
        funding: "5200.00",
        investorCount: 18,
        featured: true,
        createdAt: new Date("2024-03-10"),
        updatedAt: new Date("2024-03-10"),
      },
      {
        id: "idea-5",
        userId: "user-2",
        title: "Solar Energy Sharing Network",
        description: "Peer-to-peer solar energy trading platform for residential communities.",
        category: "Energy",
        problemStatement: "Homeowners with solar panels often produce excess energy that goes to waste instead of benefiting neighbors.",
        solution: "A blockchain-based platform allowing residents to buy and sell excess solar energy directly within their community.",
        targetAudience: "Homeowners, residential communities, clean energy advocates",
        tags: ["Solar", "P2P", "Renewable"],
        status: "investment_open",
        likes: 28,
        comments: 9,
        funding: "3800.00",
        investorCount: 14,
        featured: false,
        createdAt: new Date("2024-03-08"),
        updatedAt: new Date("2024-03-08"),
      },

      // David Chen's ideas
      {
        id: "idea-6",
        userId: "user-3",
        title: "Remote Team Collaboration Hub",
        description: "All-in-one workspace platform designed specifically for distributed teams.",
        category: "Technology",
        problemStatement: "Remote teams struggle with fragmented tools and lack of real-time collaboration features.",
        solution: "An integrated platform combining video conferencing, project management, file sharing, and virtual office spaces.",
        targetAudience: "Remote teams, startup companies, distributed organizations",
        tags: ["SaaS", "Remote", "Productivity"],
        status: "public",
        likes: 42,
        comments: 22,
        funding: "12400.00",
        investorCount: 35,
        featured: true,
        createdAt: new Date("2024-03-05"),
        updatedAt: new Date("2024-03-05"),
      },
      {
        id: "idea-7",
        userId: "user-3",
        title: "AI Code Review Assistant",
        description: "Machine learning-powered tool that provides intelligent code reviews and security audits.",
        category: "Technology",
        problemStatement: "Code reviews are time-consuming and often miss subtle bugs or security vulnerabilities.",
        solution: "An AI system that analyzes code for bugs, security issues, and style improvements with contextual explanations.",
        targetAudience: "Software developers, development teams, tech companies",
        tags: ["AI", "DevTools", "Security"],
        status: "draft",
        likes: 0,
        comments: 0,
        funding: "0.00",
        investorCount: 0,
        featured: false,
        createdAt: new Date("2024-03-13"),
        updatedAt: new Date("2024-03-13"),
      },
      {
        id: "idea-8",
        userId: "user-3",
        title: "Micro-SaaS Discovery Platform",
        description: "Marketplace for discovering and comparing niche software solutions for specific business needs.",
        category: "Business",
        problemStatement: "Small businesses struggle to find specialized software tools among thousands of generic options.",
        solution: "A curated platform that matches businesses with micro-SaaS solutions based on specific industry and use case requirements.",
        targetAudience: "Small businesses, solopreneurs, niche industries",
        tags: ["Marketplace", "SaaS", "SMB"],
        status: "public",
        likes: 19,
        comments: 6,
        funding: "1800.00",
        investorCount: 8,
        featured: false,
        createdAt: new Date("2024-03-01"),
        updatedAt: new Date("2024-03-01"),
      },

      // Emily Wilson's ideas
      {
        id: "idea-9",
        userId: "user-4",
        title: "Mental Health Check-in App",
        description: "AI-powered daily wellness companion that provides personalized mental health support.",
        category: "Healthcare",
        problemStatement: "Mental health support is often reactive rather than preventive, and access to therapists is limited.",
        solution: "A mobile app that tracks mood patterns, provides daily check-ins, and connects users with appropriate resources.",
        targetAudience: "Young adults, working professionals, mental health advocates",
        tags: ["Mental Health", "Wellness", "AI"],
        status: "investment_open",
        likes: 67,
        comments: 28,
        funding: "15600.00",
        investorCount: 42,
        featured: true,
        createdAt: new Date("2024-03-07"),
        updatedAt: new Date("2024-03-07"),
      },
      {
        id: "idea-10",
        userId: "user-4",
        title: "Elderly Care Monitoring System",
        description: "Non-intrusive home monitoring solution for elderly individuals living independently.",
        category: "Healthcare",
        problemStatement: "Families worry about elderly relatives living alone but want to respect their independence.",
        solution: "IoT sensors that monitor daily activities and alert family members only when unusual patterns are detected.",
        targetAudience: "Elderly individuals, adult children, caregivers",
        tags: ["IoT", "Elderly Care", "Health Monitoring"],
        status: "public",
        likes: 35,
        comments: 14,
        funding: "7200.00",
        investorCount: 22,
        featured: false,
        createdAt: new Date("2024-02-28"),
        updatedAt: new Date("2024-02-28"),
      },

      // James Smith's ideas
      {
        id: "idea-11",
        userId: "user-5",
        title: "Fractional Real Estate Investment",
        description: "Platform enabling micro-investments in commercial real estate properties.",
        category: "FinTech",
        problemStatement: "Real estate investment requires large capital amounts, excluding many potential investors.",
        solution: "A platform that tokenizes real estate properties, allowing investors to buy fractions starting from $100.",
        targetAudience: "Retail investors, millennials, alternative investment seekers",
        tags: ["Real Estate", "Investment", "Tokenization"],
        status: "investment_open",
        likes: 52,
        comments: 19,
        funding: "24800.00",
        investorCount: 67,
        featured: true,
        createdAt: new Date("2024-03-03"),
        updatedAt: new Date("2024-03-03"),
      },
      {
        id: "idea-12",
        userId: "user-5",
        title: "Cross-Border Payment Solution",
        description: "Instant, low-cost international money transfers using blockchain technology.",
        category: "FinTech",
        problemStatement: "Traditional international transfers are slow, expensive, and lack transparency.",
        solution: "A blockchain-based payment system that enables instant transfers with minimal fees and full transaction visibility.",
        targetAudience: "Immigrants, freelancers, international businesses",
        tags: ["Blockchain", "Payments", "International"],
        status: "public",
        likes: 38,
        comments: 11,
        funding: "9400.00",
        investorCount: 29,
        featured: false,
        createdAt: new Date("2024-02-25"),
        updatedAt: new Date("2024-02-25"),
      },

      // Sarah Kim's ideas
      {
        id: "idea-13",
        userId: "user-6",
        title: "AI Ethics Monitoring Tool",
        description: "Automated system for detecting and preventing AI bias in machine learning models.",
        category: "Technology",
        problemStatement: "AI models often contain hidden biases that lead to unfair outcomes in critical applications.",
        solution: "A comprehensive auditing tool that continuously monitors AI systems for bias and suggests corrective measures.",
        targetAudience: "AI companies, data scientists, regulatory bodies",
        tags: ["AI Ethics", "Bias Detection", "ML"],
        status: "public",
        likes: 44,
        comments: 17,
        funding: "6800.00",
        investorCount: 21,
        featured: true,
        createdAt: new Date("2024-03-11"),
        updatedAt: new Date("2024-03-11"),
      },
      {
        id: "idea-14",
        userId: "user-6",
        title: "Natural Language Programming",
        description: "AI system that converts plain English descriptions into functional code.",
        category: "Technology",
        problemStatement: "Programming languages create barriers for non-technical people who have great ideas but can't implement them.",
        solution: "An AI-powered tool that understands natural language requirements and generates clean, documented code.",
        targetAudience: "Non-technical entrepreneurs, business analysts, citizen developers",
        tags: ["AI", "No-Code", "Programming"],
        status: "draft",
        likes: 0,
        comments: 0,
        funding: "0.00",
        investorCount: 0,
        featured: false,
        createdAt: new Date("2024-03-16"),
        updatedAt: new Date("2024-03-16"),
      },
      {
        id: "idea-15",
        userId: "user-6",
        title: "Personalized Learning AI",
        description: "Adaptive learning system that creates custom educational pathways for each student.",
        category: "Education",
        problemStatement: "Traditional education uses one-size-fits-all approaches that don't accommodate different learning styles.",
        solution: "An AI tutor that adapts teaching methods, pace, and content based on individual learning patterns and preferences.",
        targetAudience: "Students, educators, educational institutions",
        tags: ["AI", "Personalized Learning", "EdTech"],
        status: "public",
        likes: 29,
        comments: 13,
        funding: "4200.00",
        investorCount: 16,
        featured: false,
        createdAt: new Date("2024-02-20"),
        updatedAt: new Date("2024-02-20"),
      },

      // Mike Brown's ideas
      {
        id: "idea-16",
        userId: "user-7",
        title: "Food Waste Reduction Network",
        description: "Platform connecting restaurants and grocery stores with local food banks and shelters.",
        category: "Social Impact",
        problemStatement: "Tons of edible food are wasted daily while many people struggle with food insecurity.",
        solution: "A real-time platform that allows food businesses to donate surplus food to local organizations efficiently.",
        targetAudience: "Restaurants, grocery stores, food banks, communities",
        tags: ["Food Waste", "Social Impact", "Community"],
        status: "public",
        likes: 58,
        comments: 25,
        funding: "11200.00",
        investorCount: 38,
        featured: true,
        createdAt: new Date("2024-03-09"),
        updatedAt: new Date("2024-03-09"),
      },
      {
        id: "idea-17",
        userId: "user-7",
        title: "Digital Literacy for Seniors",
        description: "Gamified learning platform teaching seniors essential digital skills.",
        category: "Education",
        problemStatement: "Many seniors are excluded from digital society due to lack of accessible technology education.",
        solution: "A user-friendly app with step-by-step tutorials, practice exercises, and virtual assistance for learning digital skills.",
        targetAudience: "Senior citizens, adult children, community centers",
        tags: ["Digital Literacy", "Seniors", "Education"],
        status: "investment_open",
        likes: 41,
        comments: 18,
        funding: "8600.00",
        investorCount: 24,
        featured: false,
        createdAt: new Date("2024-02-22"),
        updatedAt: new Date("2024-02-22"),
      }
    ];

    sampleIdeas.forEach(idea => this.ideas.set(idea.id, idea));

    // Add some sample connections
    this.connections.add("user-1-user-2");
    this.connections.add("user-1-user-3");
    this.connections.add("user-2-user-4");
    this.connections.add("user-3-user-6");
    this.connections.add("user-4-user-7");
    this.connections.add("user-5-user-6");
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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

  async connectToUser(userId: string, targetUserId: string): Promise<void> {
    const key = `${userId}-${targetUserId}`;
    const reverseKey = `${targetUserId}-${userId}`;
    this.connections.add(key);
    this.connections.add(reverseKey);
  }

  async disconnectFromUser(userId: string, targetUserId: string): Promise<void> {
    const key = `${userId}-${targetUserId}`;
    const reverseKey = `${targetUserId}-${userId}`;
    this.connections.delete(key);
    this.connections.delete(reverseKey);
  }

  async isConnected(userId: string, targetUserId: string): Promise<boolean> {
    return this.connections.has(`${userId}-${targetUserId}`);
  }

  async getConnections(userId: string): Promise<User[]> {
    const connectedUserIds = Array.from(this.connections)
      .filter(connection => connection.startsWith(`${userId}-`))
      .map(connection => connection.split('-')[1]);
    
    return connectedUserIds
      .map(id => this.users.get(id))
      .filter((user): user is User => user !== undefined);
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
