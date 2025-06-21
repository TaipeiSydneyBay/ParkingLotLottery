import {
  User,
  InsertUser,
  ParkingState,
  buildingConfigs,
  Building,
  ParkingArea,
  Assignment,
} from "@shared/schema";
import originalUnits from "./units.json";

const BAD_SPOTS = [
  "B3-82",
  "B3-143-1",
  "B2-159",
  "B2-160",
  "B2-161",
  "B2-338",
  "B2-339",
  "B2-340",
  "B2-408",
  "B2-486",
  "B2-487",
  "B1-572",
  "B1-573",
];

const RESTRICTED_UNITS: Record<string, ParkingArea> = {
  "E8-1F": "B2",
  "E7-1F": "B2",
  "E6-1F": "B2",
  "E5-1F": "B2",
  "E9-2F": "B1",
  "E8-2F": "B1",
  "E7-2F": "B1",
  "E6-2F": "B1",
  "E5-2F": "B1",
  "F5-1F": "B1",
  "F7-1F": "B1",
  "F8-1F": "B1",
  "F9-1F": "B1",
};

export interface IStorage {
  // User operations (keeping these from the original storage interface)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Parking operations
  getState(): Promise<ParkingState>;
  startSelection(): Promise<ParkingState>;
  drawNext(): Promise<{ assignment: Assignment | null; state: ParkingState }>;
  resetSelection(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private parkingState: ParkingState;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;

    // Initialize parking state
    this.parkingState = {
      availableSpots: {
        AB: [],
        B3: [],
        B2: [],
        B1: [],
      },
      unassignedUnits: {
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
        F: [],
        G: [],
        H: [],
        I: [],
        J: [],
      },
      badSpots: BAD_SPOTS,
      restrictedUnits: RESTRICTED_UNITS,
      assignments: [],
      currentUnit: null,
      currentSpot: null,
      isStarted: false,
      isPaused: false,
    };
  }

  // User methods (keeping these from the original storage interface)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Parking methods
  async getState(): Promise<ParkingState> {
    return this.parkingState;
  }

  async startSelection(): Promise<ParkingState> {
    // Initialize the state
    this.initializeAvailableSpots();
    this.initializeUnassignedUnits();

    this.parkingState.isStarted = true;
    this.parkingState.isPaused = false;
    this.parkingState.assignments = [];
    this.parkingState.currentUnit = null;
    this.parkingState.currentSpot = null;

    return this.parkingState;
  }

  async drawNext(): Promise<{
    assignment: Assignment | null;
    state: ParkingState;
  }> {
    if (!this.parkingState.isStarted || this.parkingState.isPaused) {
      return { assignment: null, state: this.parkingState };
    }

    // Get an unit from unassigned units
    const selectedUnitInfo = this.getNextUnit();

    if (!selectedUnitInfo) {
      return { assignment: null, state: this.parkingState };
    }

    const { building, unit } = selectedUnitInfo;

    // Assign a random spot to the unit
    const assignedSpot = this.assignRandomSpot(building);

    if (!assignedSpot) {
      return { assignment: null, state: this.parkingState };
    }

    // Create the assignment
    const assignment: Assignment = {
      unit,
      building,
      spot: assignedSpot,
    };

    // Update current selection and add assignment
    this.parkingState.currentUnit = unit;
    this.parkingState.currentSpot = assignedSpot;
    this.parkingState.assignments = [
      assignment,
      ...this.parkingState.assignments,
    ];

    return { assignment, state: this.parkingState };
  }

  async resetSelection(): Promise<void> {
    this.parkingState = {
      availableSpots: {
        AB: [],
        B3: [],
        B2: [],
        B1: [],
      },
      unassignedUnits: {
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
        F: [],
        G: [],
        H: [],
        I: [],
        J: [],
      },
      badSpots: BAD_SPOTS,
      restrictedUnits: RESTRICTED_UNITS,
      assignments: [],
      currentUnit: null,
      currentSpot: null,
      isStarted: false,
      isPaused: false,
    };
  }

  // 產生時如果有遇到數字尾是 4 的，則減1之後加上 -1 再繼續產生
  private initializeAvailableSpots(): void {
    // 生成 AB 區車位 (1-43，排除25號友善車位)
    const abSpots = [];
    for (let i = 1; i <= 43; i++) {
      if (i === 25) continue; // 排除 25 號友善車位
      if (i % 10 === 4) {
        abSpots.push(`AB-${i - 1}-1`); // 尾數是 4 的，減1後加上 -1
      } else {
        abSpots.push(`AB-${i}`);
      }
    }

    // 生成 B3 區車位 (43-1到144號，排除 67, 68, 70, 81 號友善車位)
    const b3Spots = [];
    for (let i = 43; i <= 144; i++) {
      // 排除特定的友善車位
      if (![67, 68, 70, 81].includes(i)) {
        if (i % 10 === 4) {
          b3Spots.push(`B3-${i - 1}-1`); // 尾數是 4 的，減1後加上 -1
        } else {
          b3Spots.push(`B3-${i}`);
        }
      }
    }

    // 生成 B2 區車位 (145-491號，排除 341, 372, 490, 491 號友善車位)
    const b2Spots = [];
    for (let i = 145; i <= 491; i++) {
      // 排除特定的友善車位
      if (![341, 372, 490, 491].includes(i)) {
        if (i % 10 === 4) {
          b2Spots.push(`B2-${i - 1}-1`); // 尾數是 4 的，減1後加上 -1
        } else {
          b2Spots.push(`B2-${i}`);
        }
      }
    }

    // 生成 B1 區車位 (492-619號，排除 568, 569, 573-1, 575 號友善車位)
    const b1Spots = [];
    for (let i = 492; i <= 619; i++) {
      // 排除特定的友善車位
      if (![568, 569, 574, 575].includes(i)) {
        if (i % 10 === 4) {
          b1Spots.push(`B1-${i - 1}-1`); // 尾數是 4 的，減1後加上 -1
        } else {
          b1Spots.push(`B1-${i}`);
        }
      }
    }

    this.parkingState.availableSpots = {
      AB: abSpots,
      B3: b3Spots,
      B2: b2Spots,
      B1: b1Spots,
    };
  }

  private initializeUnassignedUnits(): void {
    const unassignedUnits: Record<Building, string[]> = {
      A: [],
      B: [],
      C: [],
      D: [],
      E: [],
      F: [],
      G: [],
      H: [],
      I: [],
      J: [],
    };

    originalUnits.forEach((unit) => {
      unassignedUnits[unit.building as Building].push(
        `${unit.building}${unit.number}-${unit.floor}F`
      );
    });

    this.parkingState.unassignedUnits = unassignedUnits;
  }

  private getNextUnit(): { building: Building; unit: string } | null {
    // Create a flat array of all unassigned units
    const allUnits: { building: Building; unit: string }[] = [];

    Object.entries(this.parkingState.unassignedUnits).forEach(
      ([building, units]) => {
        units.forEach((unit) => {
          allUnits.push({ building: building as Building, unit });
        });
      }
    );

    if (allUnits.length === 0) {
      return null;
    }

    const selected = allUnits[0];

    // Remove the selected unit from unassignedUnits
    const unitIndex = this.parkingState.unassignedUnits[
      selected.building
    ].indexOf(selected.unit);

    if (unitIndex > -1) {
      this.parkingState.unassignedUnits[selected.building].splice(unitIndex, 1);
    }

    return selected;
  }

  private getEligibleParkingAreas(building: Building): ParkingArea[] {
    // Map individual buildings to their building group
    let buildingGroup: keyof typeof buildingConfigs;

    if (building === "A" || building === "B") {
      buildingGroup = "AB";
    } else if (building === "G" || building === "H") {
      buildingGroup = "GH";
    } else if (building === "I" || building === "J") {
      buildingGroup = "IJ";
    } else {
      buildingGroup = building;
    }

    return buildingConfigs[buildingGroup].eligibleAreas;
  }

  private assignRandomSpot(building: Building): string | null {
    const eligibleAreas = this.getEligibleParkingAreas(building);

    // Filter to only include areas that still have spots available
    const availableAreas = eligibleAreas.filter(
      (area) =>
        this.parkingState.availableSpots[area] &&
        this.parkingState.availableSpots[area].length > 0
    );

    if (availableAreas.length === 0) return null;

    // Randomly select an area from available areas
    const randomAreaIndex = Math.floor(Math.random() * availableAreas.length);
    const selectedArea = availableAreas[randomAreaIndex];

    // Randomly select a spot from the selected area
    const spots = this.parkingState.availableSpots[selectedArea];
    const randomSpotIndex = Math.floor(Math.random() * spots.length);
    const selectedSpot = spots[randomSpotIndex];

    // Remove the selected spot from availableSpots
    this.parkingState.availableSpots[selectedArea].splice(randomSpotIndex, 1);

    return selectedSpot;
  }
}

export const storage = new MemStorage();
