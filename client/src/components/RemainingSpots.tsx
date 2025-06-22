import React from 'react';
import { useParkingContext } from '@/contexts/ParkingContext';
import { Card } from '@/components/ui/card';

const RemainingSpots: React.FC = () => {
  const { state } = useParkingContext();

  // 按區域分組並統計剩餘車位
  const getRemainingSpotsByArea = () => {
    const areas = ['AB', 'B3', 'B2', 'B1'] as const;
    const result: Record<string, { total: number; spots: string[] }> = {};

    areas.forEach(area => {
      // 獲取該區域的一般可用車位
      const availableSpots = state.availableSpots[area] || [];
      
      // 獲取該區域的預留車位
      const reservedSpots: string[] = [];
      Object.entries(state.reservedSpots || {}).forEach(([key, spots]) => {
        if (key.includes('_' + area)) {
          reservedSpots.push(...spots);
        }
      });
      
      // 合併所有剩餘車位
      const allSpots = [...availableSpots, ...reservedSpots];
      
      result[area] = {
        total: allSpots.length,
        spots: allSpots.sort((a, b) => {
          const numA = parseInt(a.split('-')[1]);
          const numB = parseInt(b.split('-')[1]);
          return numA - numB;
        })
      };
    });

    return result;
  };

  const remainingSpots = getRemainingSpotsByArea();

  // 取得區域的樓層分布
  const getFloorDistribution = (spots: string[]) => {
    const floors: Record<string, string[]> = {};
    
    spots.forEach(spot => {
      const parts = spot.split('-');
      const area = parts[0];
      const spotNumber = parts[1];
      let floor = 'B1F'; // 預設地下一樓
      
      // 根據停車位號碼判斷樓層（簡化版本）
      const num = parseInt(spotNumber);
      if (area === 'AB') {
        if (num <= 14) floor = 'B1F';
        else if (num <= 28) floor = 'B2F';
        else floor = 'B3F';
      } else if (area === 'B3') {
        if (num <= 80) floor = 'B3F';
        else if (num <= 120) floor = 'B4F';
        else floor = 'B5F';
      } else if (area === 'B2') {
        if (num <= 250) floor = 'B2F';
        else if (num <= 400) floor = 'B3F';
        else floor = 'B4F';
      } else if (area === 'B1') {
        floor = 'B1F';
      }
      
      if (!floors[floor]) floors[floor] = [];
      floors[floor].push(spot);
    });

    // 按樓層排序
    const sortedFloors: Record<string, string[]> = {};
    const floorOrder = ['B5F', 'B4F', 'B3F', 'B2F', 'B1F'];
    floorOrder.forEach(floorName => {
      if (floors[floorName]) {
        sortedFloors[floorName] = floors[floorName];
      }
    });

    return sortedFloors;
  };

  return (
    <Card className="w-full">
      <div className="bg-primary text-white p-4">
        <h2 className="text-xl font-bold">剩餘車位詳細資訊</h2>
      </div>
      
      <div className="p-4 space-y-6">
        {Object.entries(remainingSpots).map(([area, data]) => (
          <div key={area} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                {area}區
              </h3>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                剩餘 {data.total} 個
              </span>
            </div>
            
            {data.total > 0 ? (
              <div className="space-y-3">
                {Object.entries(getFloorDistribution(data.spots)).map(([floor, spots]) => (
                  <div key={floor} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">{floor}</span>
                      <span className="text-sm text-gray-500">{spots.length} 個</span>
                    </div>
                    <div className="grid grid-cols-8 gap-1">
                      {spots.map(spot => (
                        <div 
                          key={spot} 
                          className="bg-white border border-gray-200 rounded px-1 py-1 text-center text-xs font-mono"
                          title={spot}
                        >
                          {spot.split('-')[1]}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                此區域已無剩餘車位
              </div>
            )}
          </div>
        ))}
        
        <div className="border-t pt-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">說明</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• 數字顯示為車位號碼，點擊可查看完整編號</li>
              <li>• 包含一般可用車位和各棟預留車位</li>
              <li>• 已排除友善車位及不適合停車的位置</li>
              <li>• 樓層分布為估算值，實際以現場標示為準</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RemainingSpots;