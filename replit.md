# Parking Spot Assignment System

## Overview

This is a full-stack web application for automatically assigning parking spots to residential units in a Taiwanese community complex. The system provides a fair lottery-based selection process with a modern, responsive interface built with React and TypeScript.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Library**: Radix UI components with custom Tailwind CSS styling (shadcn/ui)
- **State Management**: React Context API with useReducer for parking state
- **Data Fetching**: TanStack Query for server state management
- **Build Tool**: Vite with hot module replacement
- **Styling**: Tailwind CSS with custom design system

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints
- **Development**: tsx for TypeScript execution in development
- **Production**: esbuild for server bundling

### Database & ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migrations**: Drizzle Kit for schema management
- **Connection**: @neondatabase/serverless for serverless PostgreSQL

## Key Components

### Core Features
1. **Parking Spot Selection System**
   - Fair lottery-based assignment
   - Two-round selection process (first round for eligible spots, second round for remaining spots)
   - Real-time selection with automatic progression
   - Pause/resume functionality

2. **Unit Management**
   - Building-based organization (A, B, C, D, E, F, G, H, I, J)
   - Floor and unit number tracking
   - Parking area eligibility rules

3. **Parking Area Management**
   - Four parking areas: AB, B3, B2, B1
   - Reserved spots and bad spots filtering
   - Friendly spots for accessibility needs

4. **Selection Interface**
   - Start screen with system overview
   - Live selection display with current unit and spot
   - Results overview with building filters
   - Remaining spots visualization
   - CSV export functionality

### Data Models
- **Units**: Building, number, floor information
- **Parking Spots**: Area-based spot allocation with special categories
- **Assignments**: Unit-to-spot mappings with selection order
- **State Management**: Complete system state tracking

## Data Flow

1. **Initialization**: System loads unit data from JSON files and generates available parking spots
2. **Selection Start**: Units are shuffled and queued for selection
3. **Assignment Process**: 
   - Units are selected in random order
   - Eligible parking spots are filtered based on building rules
   - Spots are assigned automatically with visual feedback
4. **Second Round**: Remaining units can select from any available spots
5. **Export**: Final assignments can be exported as CSV

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM)
- Radix UI components for accessible UI primitives
- TanStack Query for server state management
- Wouter for lightweight routing

### Database & Backend
- Drizzle ORM for type-safe database operations
- Neon serverless PostgreSQL
- Express.js for API server

### Development Tools
- Vite for fast development and building
- TypeScript for type safety
- Tailwind CSS for styling
- esbuild for production builds

### Replit Integration
- Replit-specific Vite plugins for development experience
- Runtime error modal for debugging

## Deployment Strategy

### Development Environment
- **Server**: tsx runs TypeScript directly with hot reload
- **Client**: Vite dev server with HMR
- **Database**: Drizzle push for schema updates

### Production Build
- **Client**: Vite builds optimized static assets to `dist/public`
- **Server**: esbuild bundles server code to `dist/index.js`
- **Deployment**: Single Node.js process serving both API and static files

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Development vs production mode detection
- Replit-specific features conditionally enabled

## Changelog

```
Changelog:
- July 02, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```