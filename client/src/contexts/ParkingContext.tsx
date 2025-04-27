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
  availableSpots: {
    'AB': [],
    'B3': [],
    'B2': [],
    'B1': []
  },
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
  currentUnit: null,
  currentSpot: null,
  isStarted: false,
  isPaused: false
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
      } else {
        toast({
          title: "No more units",
          description: "All units have been assigned parking spots.",
        });
      }
      
      // Update the overall state
      dispatch({ type: 'SET_STATE', payload: data.state });
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

  // Context value
  const value = {
    state,
    filteredBuilding,
    setFilteredBuilding,
    startSelection,
    drawNext,
    togglePause,
    resetSelection
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
