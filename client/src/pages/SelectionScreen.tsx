import React, { useState } from 'react';
import { useParkingContext } from '@/contexts/ParkingContext';
import CurrentSelection from '@/components/CurrentSelection';
import ResultsOverview from '@/components/ResultsOverview';
import RemainingSpots from '@/components/RemainingSpots';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const SelectionScreen: React.FC = () => {
  const { state, togglePause, resetSelection } = useParkingContext();
  const { toast } = useToast();
  const [showRemainingSpots, setShowRemainingSpots] = useState(false);

  const handleReset = async () => {
    if (confirm('確定要重置所有選號？此操作無法撤銷。')) {
      await resetSelection();
      toast({
        title: "重置成功",
        description: "所有選號已重置",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">機車停車位選號系統</h1>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowRemainingSpots(!showRemainingSpots)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {showRemainingSpots ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
              {showRemainingSpots ? '隱藏' : '顯示'}剩餘車位
            </Button>
            <Button
              onClick={togglePause}
              className={`px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-white ${
                state.isPaused 
                  ? 'start-selection-btn' 
                  : 'bg-white text-primary hover:bg-gray-100'
              }`}
            >
              {state.isPaused ? '繼續' : '暫停'}
            </Button>
            <Button
              onClick={handleReset}
              className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              重置
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 space-y-6">
        {showRemainingSpots && (
          <RemainingSpots />
        )}
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          <CurrentSelection />
          <ResultsOverview />
        </div>
      </main>
    </div>
  );
};

export default SelectionScreen;
