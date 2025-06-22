import { pgTable, text, serial, integer, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keeping this as it might be needed for authentication in the future)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type BuildingConfig = {
  units: number;
  eligibleAreas: ParkingArea[];
  spotCount?: Record<ParkingArea, number>;
};

// Building configuration
export const buildingConfigs: Record<string, BuildingConfig> = {
  AB: {
    units: 44,
    eligibleAreas: ["AB", "B3"] as ParkingArea[],
    spotCount: {
      AB: 42,
      B3: 2,
      B2: 0,
      B1: 0,
    },
  },
  C: {
    units: 83,
    eligibleAreas: ["B3", "B2"] as ParkingArea[],
  },
  D: {
    units: 84,
    eligibleAreas: ["B3", "B2"] as ParkingArea[],
  },
  E: {
    units: 89,
    eligibleAreas: ["B3", "B2", "B1"] as ParkingArea[],
  },
  F: {
    units: 96,
    eligibleAreas: ["B3", "B2", "B1"] as ParkingArea[],
  },
  GH: {
    units: 40,
    eligibleAreas: ["B2"] as ParkingArea[],
  },
  IJ: {
    units: 40,
    eligibleAreas: ["B1"] as ParkingArea[],
    spotCount: {
      AB: 0,
      B3: 0,
      B2: 0,
      B1: 40,
    },
  },
};

// Types for the parking spot allocation system
export type BuildingGroup = keyof typeof buildingConfigs;
export type Building =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J";
export type ParkingArea = "AB" | "B3" | "B2" | "B1";

export interface Unit {
  id: string;
  building: Building;
}

export interface ParkingSpot {
  id: string;
  area: ParkingArea;
}

export interface Assignment {
  unit: string;
  building: Building;
  spot: string;
}

export interface ParkingState {
  availableSpots: Record<ParkingArea, string[]>;
  reservedSpots: Record<string, string[]>; // key: "AB_AB", "IJ_B1" etc, value: spot IDs
  unassignedUnits: Record<Building, string[]>;
  assignments: Assignment[];
  restrictedUnits: Record<string, ParkingArea>;
  currentUnit: string | null;
  currentSpot: string | null;
  isStarted: boolean;
  isPaused: boolean;
}

// API response types
export interface StateResponse {
  state: ParkingState;
}

export interface AssignmentResponse {
  assignment: Assignment | null;
  state: ParkingState;
}

export interface ResetResponse {
  success: boolean;
}
