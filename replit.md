# ConceptKeep

## Overview

ConceptKeep is a modern web application platform for storing, showcasing, and funding innovative ideas. The platform features a clean, futuristic design inspired by Arduino Cloud dashboard aesthetics, with comprehensive functionality for idea management, community interaction, and investment tracking.

The application is built as a full-stack TypeScript solution with a React frontend and Express backend, featuring a sidebar navigation system, dashboard views, and interactive components for idea creation, exploration, and investment management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and build tooling
- **UI Framework**: Shadcn/ui component library with Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom CSS variables for theme support (light/dark mode toggle)
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Data Storage**: In-memory storage implementation with interface abstraction for easy database integration
- **API Design**: RESTful APIs with structured error handling and logging middleware

### Database Schema Design
- **Users**: Profile management with authentication fields, settings, and vault privacy controls
- **Ideas**: Complete idea lifecycle management with categories, status tracking, and engagement metrics
- **Investments**: Financial tracking with ROI calculations and investor relationships
- **Comments**: Community interaction system linked to ideas
- **Engagement**: Like system and social features for idea discovery

### Authentication & Security
- Mock authentication system (ready for integration with real auth providers)
- User session management with privacy controls
- Two-factor authentication support in user schema
- Role-based access control for idea visibility (draft/public/investment_open)

### Component Architecture
- Modular component system with reusable UI elements
- Theme provider for consistent styling across light/dark modes
- Custom hooks for mobile responsiveness and toast notifications
- Card-based layouts with hover animations and smooth transitions

### Development Experience
- Hot module replacement with Vite development server
- TypeScript strict mode with comprehensive type checking
- Path aliases for clean import statements
- Integrated error overlay for development debugging
- ESBuild for production bundle optimization

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection (Neon serverless)
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect support
- **drizzle-kit**: Database migrations and schema management
- **@tanstack/react-query**: Server state management and caching

### UI & Styling
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework with custom theming
- **class-variance-authority**: Type-safe component variants
- **lucide-react**: Icon library for consistent iconography

### Form & Validation
- **react-hook-form**: Performant form library with minimal re-renders
- **@hookform/resolvers**: Integration layer for validation libraries
- **zod**: TypeScript-first schema validation
- **drizzle-zod**: Integration between Drizzle schemas and Zod validation

### Development Tools
- **vite**: Fast build tool and development server
- **tsx**: TypeScript execution for Node.js
- **@replit/vite-plugin-runtime-error-modal**: Enhanced error reporting for Replit environment
- **@replit/vite-plugin-cartographer**: Replit-specific development enhancements

### Utility Libraries
- **date-fns**: Modern JavaScript date utility library
- **clsx** & **tailwind-merge**: Conditional CSS class composition
- **embla-carousel-react**: Touch-friendly carousel component
- **cmdk**: Command palette component for enhanced UX