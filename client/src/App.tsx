import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import StartScreen from "@/pages/StartScreen";
import SelectionScreen from "@/pages/SelectionScreen";
import { ParkingProvider, useParkingContext } from "./contexts/ParkingContext";

function Router() {
  const { state } = useParkingContext();

  // Conditionally render either StartScreen or SelectionScreen based on state
  return (
    <Switch>
      <Route path="/">
        {state.isStarted ? <SelectionScreen /> : <StartScreen />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ParkingProvider>
        <AppContent />
      </ParkingProvider>
    </QueryClientProvider>
  );
}

export default App;
