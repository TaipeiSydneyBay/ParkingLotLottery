import React from 'react';
import { useParkingContext } from '@/contexts/ParkingContext';
import { Button } from '@/components/ui/button';

const CurrentSelection: React.FC = () => {
  const { state, drawNext } = useParkingContext();

  return (
    <div className="md:w-1/2 bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-primary text-white p-4">
        <h2 className="text-xl font-bold">目前選號</h2>
      </div>
      
      <div className="p-6 flex flex-col items-center justify-center min-h-[500px]">
        <div className="mb-12 text-center">
          <h3 className="text-lg font-medium text-gray-500 mb-2">目前抽出的停車位號碼</h3>
          <div className="text-6xl font-bold text-primary bg-blue-50 rounded-xl p-8 min-w-[200px] text-center">
            {state.currentSpot || '--'}
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-500 mb-2">目前抽出的戶別</h3>
          <div className="text-5xl font-bold text-primary bg-blue-50 rounded-xl p-6 min-w-[180px] text-center">
            {state.currentUnit || '--'}
          </div>
        </div>
        
        <div className="mt-12">
          <Button
            onClick={drawNext}
            disabled={state.isPaused}
            className="bg-accent hover:bg-orange-600 text-white text-xl font-bold py-4 px-8 rounded-lg shadow-md transition-colors h-auto"
          >
            抽下一個
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CurrentSelection;
