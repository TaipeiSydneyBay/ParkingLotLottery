import React from "react";
import { useParkingContext } from "@/contexts/ParkingContext";
import { Card } from "@/components/ui/card";

const RemainingSpots: React.FC = () => {
  const { state } = useParkingContext();

  // 按區域分組並統計剩餘車位
  const getRemainingSpotsByArea = () => {
    const areas = ["AB", "B3", "B2", "B1"] as const;
    const result: Record<string, { 
      totalRemaining: number; 
      availableForDraw: number; 
      spots: string[] 
    }> = {};

    areas.forEach((area) => {
      // 獲取該區域的可用車位（可抽籤的）
      const availableSpots = state.availableSpots[area] || [];
      
      // 獲取該區域的預留車位
      const reservedSpots: string[] = [];
      Object.entries(state.reservedSpots || {}).forEach(([key, spots]) => {
        if (key.includes('_' + area)) {
          reservedSpots.push(...spots);
        }
      });
      
      // 合併所有剩餘車位
      const allRemainingSpots = [...availableSpots, ...reservedSpots];
      
      result[area] = {
        totalRemaining: allRemainingSpots.length,
        availableForDraw: availableSpots.length,
        spots: allRemainingSpots.sort((a, b) => {
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

    spots.forEach((spot) => {
      const [area, ...parts] = spot.split("-");

      const spotNumber = parts.join("-");

      if (!floors[area]) {
        floors[area] = [];
      }

      floors[area].push(spotNumber);
    });

    return floors;
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
              <h3 className="text-lg font-semibold text-gray-800">{area}區</h3>
              <div className="flex space-x-2">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  可抽 {data.availableForDraw} 個
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  總剩餘 {data.totalRemaining} 個
                </span>
              </div>
            </div>

            {data.totalRemaining > 0 ? (
              <div className="space-y-3">
                {Object.entries(getFloorDistribution(data.spots)).map(
                  ([floor, spots]) => (
                    <div key={floor} className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-8 gap-1">
                        {spots.map((spot) => {
                          const fullSpotId = `${area}-${spot}`;
                          const alreadyAssigned = state.assignments.some(
                            (assignment) => assignment.spot === fullSpotId
                          );
                          const isBad = state.badSpots.includes(fullSpotId);
                          const isFriendly =
                            state.friendlySpots.includes(fullSpotId);

                          return (
                            <div
                              key={spot}
                              className={
                                (isBad
                                  ? "bg-red-300"
                                  : isFriendly
                                  ? "bg-green-300"
                                  : alreadyAssigned
                                  ? "bg-gray-300"
                                  : "bg-white") +
                                ` border border-gray-200 rounded px-1 py-1 text-center text-xs font-mono`
                              }
                              title={fullSpotId}
                            >
                              {spot}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
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
            <div className="space-y-3">
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 數字顯示為車位號碼，滑鼠移至車位上可查看完整編號</li>
                <li>• 包含一般可用車位和各棟預留車位</li>
                <li>• 樓層分布為估算值，實際以現場標示為準</li>
              </ul>
              <div className="flex space-x-4 text-sm flex-wrap">
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
                  <span className="text-gray-600">一般車位</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-green-100 border border-gray-200 rounded"></div>
                  <span className="text-gray-600">友善車位</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-red-100 border border-gray-200 rounded"></div>
                  <span className="text-gray-600">不適合車位</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RemainingSpots;
