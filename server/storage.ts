import {
  User,
  InsertUser,
  ParkingState,
  buildingConfigs,
  Building,
  BuildingConfig,
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

const FRIENDLY_SPOTS = [
  "AB-25",
  "B3-67",
  "B3-68",
  "B3-70",
  "B3-81",
  "B2-341",
  "B2-372",
  "B2-490",
  "B2-491",
  "B1-568",
  "B1-569",
  "B1-573-1",
  "B1-575",
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
      allSpots: {
        AB: [],
        B3: [],
        B2: [],
        B1: [],
      },
      availableSpots: {
        AB: [],
        B3: [],
        B2: [],
        B1: [],
      },
      reservedSpots: {},
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
      friendlySpots: FRIENDLY_SPOTS,
      restrictedUnits: RESTRICTED_UNITS,
      assignments: [],
      currentUnit: null,
      currentSpot: null,
      isStarted: false,
      isPaused: false,
      isCompleted: false,
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
    this.initializeReservedSpots();

    this.parkingState.isStarted = true;
    this.parkingState.isPaused = false;
    this.parkingState.isCompleted = false;
    this.parkingState.assignments = [];
    this.parkingState.currentUnit = null;
    this.parkingState.currentSpot = null;

    return this.parkingState;
  }

  async drawNext(): Promise<{
    assignment: Assignment | null;
    state: ParkingState;
  }> {
    if (
      !this.parkingState.isStarted ||
      this.parkingState.isPaused ||
      this.parkingState.isCompleted
    ) {
      return { assignment: null, state: this.parkingState };
    }

    // Get an unit from unassigned units
    const selectedUnitInfo = this.getNextUnit();

    if (!selectedUnitInfo) {
      // 所有戶別都已分配完成
      this.parkingState.isCompleted = true;
      this.parkingState.isPaused = true;
      this.parkingState.currentUnit = null;
      this.parkingState.currentSpot = null;
      console.log("所有抽籤已完成！");
      return { assignment: null, state: this.parkingState };
    }

    const { building, unit } = selectedUnitInfo;

    // Assign a random spot to the unit
    const assignedSpot = this.assignRandomSpot(building, unit);

    if (!assignedSpot) {
      // 無法分配車位時也標記為完成
      this.parkingState.isCompleted = true;
      this.parkingState.isPaused = true;
      console.log("無法分配更多車位，抽籤結束！");
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
      allSpots: {
        AB: [],
        B3: [],
        B2: [],
        B1: [],
      },
      availableSpots: {
        AB: [],
        B3: [],
        B2: [],
        B1: [],
      },
      reservedSpots: {},
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
      friendlySpots: FRIENDLY_SPOTS,
      restrictedUnits: RESTRICTED_UNITS,
      assignments: [],
      currentUnit: null,
      currentSpot: null,
      isStarted: false,
      isPaused: false,
      isCompleted: false,
    };

    this.initializeAvailableSpots();
    this.initializeUnassignedUnits();
    this.initializeReservedSpots();
  }

  // 產生時如果有遇到數字尾是 4 的，則減1之後加上 -1 再繼續產生
  private initializeAvailableSpots(): void {
    // 生成 AB 區車位 (1-43，排除25號友善車位)
    const abSpots = [];

    for (let i = 1; i <= 43; i++) {
      const spot = i % 10 === 4 ? `AB-${i - 1}-1` : `AB-${i}`; // 尾數是 4 的，減1後加上 -1

      this.parkingState.allSpots.AB.push(spot);

      if (FRIENDLY_SPOTS.includes(spot) || BAD_SPOTS.includes(spot)) {
        continue; // 排除友善車位和不好停的車位
      }

      abSpots.push(spot);
    }

    // 生成 B3 區車位 (43-1到144號，排除 67, 68, 70, 81 號友善車位)
    const b3Spots = [];

    for (let i = 43; i <= 144; i++) {
      const spot = i % 10 === 4 ? `B3-${i - 1}-1` : `B3-${i}`; // 尾數是 4 的，減1後加上 -1

      this.parkingState.allSpots.B3.push(spot);

      if (FRIENDLY_SPOTS.includes(spot) || BAD_SPOTS.includes(spot)) {
        continue; // 排除友善車位和不好停的車位
      }

      b3Spots.push(spot);
    }

    // 生成 B2 區車位 (145-491號，排除 341, 372, 490, 491 號友善車位)
    const b2Spots = [];

    for (let i = 145; i <= 491; i++) {
      const spot = i % 10 === 4 ? `B2-${i - 1}-1` : `B2-${i}`; // 尾數是 4 的，減1後加上 -1

      this.parkingState.allSpots.B2.push(spot);

      if (FRIENDLY_SPOTS.includes(spot) || BAD_SPOTS.includes(spot)) {
        continue; // 排除友善車位和不好停的車位
      }

      b2Spots.push(spot);
    }

    // 生成 B1 區車位 (492-619號，排除 568, 569, 573-1, 575 號友善車位)
    const b1Spots = [];

    for (let i = 492; i <= 619; i++) {
      const spot = i % 10 === 4 ? `B1-${i - 1}-1` : `B1-${i}`; // 尾數是 4 的，減1後加上 -1

      this.parkingState.allSpots.B1.push(spot);

      if (FRIENDLY_SPOTS.includes(spot) || BAD_SPOTS.includes(spot)) {
        continue; // 排除友善車位和不好停的車位
      }

      b1Spots.push(spot);
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

  // 初始化預留車位機制
  private initializeReservedSpots(): void {
    // 根據 buildingConfigs 中有 spotCount 的配置進行預留

    // AB棟預留：AB區42個 + B3區2個
    const abSpots = this.parkingState.availableSpots.AB.slice(0, 42);
    const b3SpotsForAB = this.parkingState.availableSpots.B3.slice(0, 2);

    this.parkingState.reservedSpots["AB_AB"] = abSpots;
    this.parkingState.reservedSpots["AB_B3"] = b3SpotsForAB;

    // 從 availableSpots 中移除已預留的車位
    this.parkingState.availableSpots.AB =
      this.parkingState.availableSpots.AB.slice(42);
    this.parkingState.availableSpots.B3 =
      this.parkingState.availableSpots.B3.slice(2);

    // IJ棟預留：B1區40個
    const b1SpotsForIJ = this.parkingState.availableSpots.B1.slice(0, 40);
    this.parkingState.reservedSpots["IJ_B1"] = b1SpotsForIJ;

    // 從 availableSpots 中移除已預留的車位
    this.parkingState.availableSpots.B1 =
      this.parkingState.availableSpots.B1.slice(40);
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

    const selectedIndex = Math.floor(Math.random() * allUnits.length);
    const selected = allUnits[selectedIndex];

    // Remove the selected unit from unassignedUnits
    const unitIndex = this.parkingState.unassignedUnits[
      selected.building
    ].indexOf(selected.unit);

    if (unitIndex > -1) {
      this.parkingState.unassignedUnits[selected.building].splice(unitIndex, 1);
    }

    return selected;
  }

  private getBuildingConfig(building: Building): BuildingConfig {
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

    return buildingConfigs[buildingGroup];
  }

  private assignRandomSpot(building: Building, unit: string): string | null {
    const buildingGroup = this.getBuildingGroup(building);

    // 檢查是否為受限戶別
    const hasRestrictedUnit = this.parkingState.restrictedUnits[unit];
    if (hasRestrictedUnit) {
      const spots = this.parkingState.availableSpots[hasRestrictedUnit];
      if (spots && spots.length > 0) {
        const randomIndex = Math.floor(Math.random() * spots.length);
        const selectedSpot = spots[randomIndex];
        spots.splice(randomIndex, 1);
        return selectedSpot;
      }
      return null;
    }

    // 優先使用預留車位
    const reservedKeys = Object.keys(this.parkingState.reservedSpots).filter(
      (key) => key.startsWith(buildingGroup + "_")
    );

    for (const key of reservedKeys) {
      const reservedSpots = this.parkingState.reservedSpots[key];
      if (reservedSpots && reservedSpots.length > 0) {
        const randomIndex = Math.floor(Math.random() * reservedSpots.length);
        const selectedSpot = reservedSpots[randomIndex];
        reservedSpots.splice(randomIndex, 1);
        return selectedSpot;
      }
    }

    // 如果預留車位用完，使用一般車位
    const buildingConfig = this.getBuildingConfig(building);
    const eligibleAreas = buildingConfig.eligibleAreas;

    // 篩選有剩餘車位的區域
    const availableAreas = eligibleAreas.filter(
      (area) =>
        this.parkingState.availableSpots[area] &&
        this.parkingState.availableSpots[area].length > 0
    );

    if (availableAreas.length === 0) {
      return null;
    }

    // 隨機選擇區域
    const randomAreaIndex = Math.floor(Math.random() * availableAreas.length);
    const selectedArea = availableAreas[randomAreaIndex];

    // 隨機選擇車位
    const spots = this.parkingState.availableSpots[selectedArea];
    const randomSpotIndex = Math.floor(Math.random() * spots.length);
    const selectedSpot = spots[randomSpotIndex];

    // 從可用車位中移除
    spots.splice(randomSpotIndex, 1);

    return selectedSpot;
  }

  private getBuildingGroup(building: Building): string {
    if (building === "A" || building === "B") {
      return "AB";
    } else if (building === "G" || building === "H") {
      return "GH";
    } else if (building === "I" || building === "J") {
      return "IJ";
    } else {
      return building;
    }
  }
}

export const storage = new MemStorage();
