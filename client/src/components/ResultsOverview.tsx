import React from 'react';
import { useParkingContext } from '@/contexts/ParkingContext';
import BuildingFilter from './BuildingFilter';

const ResultsOverview: React.FC = () => {
  const { state, filteredBuilding, setFilteredBuilding } = useParkingContext();

  // Calculate totals
  const totalAssigned = state.assignments.length;
  const totalRemaining = Object.values(state.availableSpots).reduce(
    (sum, spots) => sum + spots.length, 
    0
  );

  // Filter assignments by building
  const filteredAssignments = state.assignments.filter(
    assignment => filteredBuilding === 'all' || assignment.building === filteredBuilding
  );

  return (
    <div className="md:w-1/2 bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-primary text-white p-4">
        <h2 className="text-xl font-bold">已選停車位總覽</h2>
        <div className="flex mt-2 space-x-2 overflow-x-auto pb-2">
          <BuildingFilter 
            building="all" 
            label="全部" 
            active={filteredBuilding === 'all'} 
            onClick={() => setFilteredBuilding('all')} 
          />
          <BuildingFilter 
            building="A" 
            label="A棟" 
            active={filteredBuilding === 'A'} 
            onClick={() => setFilteredBuilding('A')} 
          />
          <BuildingFilter 
            building="B" 
            label="B棟" 
            active={filteredBuilding === 'B'} 
            onClick={() => setFilteredBuilding('B')} 
          />
          <BuildingFilter 
            building="C" 
            label="C棟" 
            active={filteredBuilding === 'C'} 
            onClick={() => setFilteredBuilding('C')} 
          />
          <BuildingFilter 
            building="D" 
            label="D棟" 
            active={filteredBuilding === 'D'} 
            onClick={() => setFilteredBuilding('D')} 
          />
          <BuildingFilter 
            building="E" 
            label="E棟" 
            active={filteredBuilding === 'E'} 
            onClick={() => setFilteredBuilding('E')} 
          />
          <BuildingFilter 
            building="F" 
            label="F棟" 
            active={filteredBuilding === 'F'} 
            onClick={() => setFilteredBuilding('F')} 
          />
          <BuildingFilter 
            building="G" 
            label="G棟" 
            active={filteredBuilding === 'G'} 
            onClick={() => setFilteredBuilding('G')} 
          />
          <BuildingFilter 
            building="H" 
            label="H棟" 
            active={filteredBuilding === 'H'} 
            onClick={() => setFilteredBuilding('H')} 
          />
          <BuildingFilter 
            building="I" 
            label="I棟" 
            active={filteredBuilding === 'I'} 
            onClick={() => setFilteredBuilding('I')} 
          />
          <BuildingFilter 
            building="J" 
            label="J棟" 
            active={filteredBuilding === 'J'} 
            onClick={() => setFilteredBuilding('J')} 
          />
        </div>
      </div>
      
      <div className="p-4">
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">已分配停車位:</span>
            <span className="font-bold">{totalAssigned}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">剩餘停車位:</span>
            <span className="font-bold">{totalRemaining}</span>
          </div>
        </div>
        
        <div className="h-[550px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 pr-2">
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment, index) => (
              <div 
                key={index} 
                className="bg-green-50 border border-green-200 rounded-lg p-3 flex justify-between shadow-sm"
                data-building={assignment.building}
              >
                <div>
                  <div className="text-sm text-gray-500">戶別</div>
                  <div className="font-bold">{assignment.unit}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">停車位</div>
                  <div className="font-bold text-success">{assignment.spot}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 text-gray-500">
              {totalAssigned > 0 
                ? "沒有符合篩選條件的停車位分配" 
                : "尚未分配任何停車位"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsOverview;
