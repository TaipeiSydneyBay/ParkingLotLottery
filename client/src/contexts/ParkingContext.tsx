import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  ParkingState,
  Assignment,
  Building,
  ParkingArea,
  StateResponse,
  AssignmentResponse,
  ResetResponse
} from "@shared/schema";

// Initial state
const initialState: ParkingState = {
  allSpots: {
    'AB': [],
    'B3': [],
    'B2': [],
    'B1': []
  },
  availableSpots: {
    'AB': [],
    'B3': [],
    'B2': [],
    'B1': []
  },
  reservedSpots: {},
  unassignedUnits: {
    'A': [],
    'B': [],
    'C': [],
    'D': [],
    'E': [],
    'F': [],
    'G': [],
    'H': [],
    'I': [],
    'J': []
  },
  assignments: [],
  bicycleSpots: [],
  friendlySpots: [],
  restrictedUnits: {},
  currentUnit: null,
  currentSpot: null,
  isStarted: false,
  isPaused: false,
  isCompleted: false,
  // Second round properties
  isSecondRound: false,
  secondRoundUnits: {},
  secondRoundAssignments: [],
  isSecondRoundCompleted: false,
};

// Action types
type Action =
  | { type: 'SET_STATE'; payload: ParkingState }
  | { type: 'SET_STARTED'; payload: boolean }
  | { type: 'SET_PAUSED'; payload: boolean }
  | { type: 'SET_CURRENT_SELECTION'; payload: { unit: string | null; spot: string | null } }
  | { type: 'ADD_ASSIGNMENT'; payload: Assignment }
  | { type: 'RESET' };

// Reducer function
function parkingReducer(state: ParkingState, action: Action): ParkingState {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'SET_STARTED':
      return { ...state, isStarted: action.payload };
    case 'SET_PAUSED':
      return { ...state, isPaused: action.payload };
    case 'SET_CURRENT_SELECTION':
      return { 
        ...state, 
        currentUnit: action.payload.unit, 
        currentSpot: action.payload.spot 
      };
    case 'ADD_ASSIGNMENT':
      return {
        ...state,
        assignments: [action.payload, ...state.assignments]
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Context interface
interface ParkingContextType {
  state: ParkingState;
  filteredBuilding: string;
  setFilteredBuilding: (building: string) => void;
  startSelection: () => Promise<void>;
  drawNext: () => Promise<void>;
  togglePause: () => void;
  resetSelection: () => Promise<void>;
  startSecondRound: () => Promise<void>;
  drawNextSecond: () => Promise<void>;
}

// Create context
const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

// Provider component
export function ParkingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(parkingReducer, initialState);
  const [filteredBuilding, setFilteredBuilding] = React.useState<string>('all');
  const { toast } = useToast();

  // Initialize state from server on component mount
  useEffect(() => {
    const fetchState = async () => {
      try {
        const response = await apiRequest('GET', '/api/parking/state', undefined);
        const data: StateResponse = await response.json();
        dispatch({ type: 'SET_STATE', payload: data.state });
      } catch (error) {
        console.error('Failed to fetch state:', error);
      }
    };

    fetchState();
  }, []);

  // Start selection process
  const startSelection = async () => {
    try {
      const response = await apiRequest('POST', '/api/parking/start', undefined);
      const data: StateResponse = await response.json();
      dispatch({ type: 'SET_STATE', payload: data.state });
    } catch (error) {
      console.error('Failed to start selection:', error);
      toast({
        title: "Error",
        description: "Failed to start the selection process. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Draw next parking spot
  const drawNext = async () => {
    if (state.isPaused) return;

    try {
      const response = await apiRequest('POST', '/api/parking/draw', undefined);
      const data: AssignmentResponse = await response.json();
      
      if (data.assignment) {
        dispatch({ 
          type: 'SET_CURRENT_SELECTION', 
          payload: { 
            unit: data.assignment.unit, 
            spot: data.assignment.spot 
          } 
        });
        dispatch({ type: 'ADD_ASSIGNMENT', payload: data.assignment });
      }
      
      // Update the overall state
      dispatch({ type: 'SET_STATE', payload: data.state });
      
      // Check if completed
      if (data.state.isCompleted) {
        toast({
          title: "抽籤完成",
          description: "所有住戶都已分配到停車位！",
        });
        return;
      }
      
      if (!data.assignment) {
        console.warn('No more units to assign');
      }
    } catch (error) {
      console.error('Failed to draw next:', error);
      toast({
        title: "Error",
        description: "Failed to draw the next parking spot. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Toggle pause/resume
  const togglePause = () => {
    dispatch({ type: 'SET_PAUSED', payload: !state.isPaused });
  };

  // Reset selection
  const resetSelection = async () => {
    try {
      const response = await apiRequest('POST', '/api/parking/reset', undefined);
      const data: ResetResponse = await response.json();
      
      if (data.success) {
        dispatch({ type: 'RESET' });
        setFilteredBuilding('all');
      }
    } catch (error) {
      console.error('Failed to reset:', error);
      toast({
        title: "Error",
        description: "Failed to reset the selection process. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Start second round selection
  const startSecondRound = async () => {
    try {
      const response = await apiRequest('POST', '/api/parking/start-second', undefined);
      const data: StateResponse = await response.json();
      
      dispatch({ type: 'SET_STATE', payload: data.state });
      toast({
        title: "第二輪抽籤開始",
        description: "開始進行第二個車位的抽籤",
      });
    } catch (error) {
      console.error('Failed to start second round:', error);
      toast({
        title: "Error",
        description: "Failed to start second round selection. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Draw next parking spot for second round
  const drawNextSecond = async () => {
    if (state.isPaused) return;

    try {
      const response = await apiRequest('POST', '/api/parking/draw-second', undefined);
      const data: AssignmentResponse = await response.json();
      
      if (data.assignment) {
        dispatch({ 
          type: 'SET_CURRENT_SELECTION', 
          payload: { 
            unit: data.assignment.unit, 
            spot: data.assignment.spot 
          } 
        });
        
        dispatch({ type: 'ADD_ASSIGNMENT', payload: data.assignment });
        dispatch({ type: 'SET_STATE', payload: data.state });
        
        toast({
          title: "第二個車位抽中",
          description: `${data.assignment.unit} 抽中 ${data.assignment.spot}`,
        });
      } else {
        dispatch({ type: 'SET_STATE', payload: data.state });
        toast({
          title: "第二輪抽籤完成",
          description: "所有第二個車位已分配完畢",
        });
      }
    } catch (error) {
      console.error('Failed to draw second:', error);
      toast({
        title: "Error",
        description: "Failed to draw second spot. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Context value
  const value = {
    state,
    filteredBuilding,
    setFilteredBuilding,
    startSelection,
    drawNext,
    togglePause,
    resetSelection,
    startSecondRound,
    drawNextSecond
  };

  return (
    <ParkingContext.Provider value={value}>
      {children}
    </ParkingContext.Provider>
  );
}

// Custom hook for using the context
export function useParkingContext() {
  const context = useContext(ParkingContext);
  if (context === undefined) {
    throw new Error('useParkingContext must be used within a ParkingProvider');
  }
  return context;
}
