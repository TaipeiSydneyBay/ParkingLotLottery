import React, { useEffect, useState, useRef } from "react";
import { useParkingContext } from "@/contexts/ParkingContext";
import { Button } from "@/components/ui/button";

const CurrentSelection: React.FC = () => {
  const { state, drawNext } = useParkingContext();
  const [countdown, setCountdown] = useState<number>(1);
  const timerRef = useRef<number | null>(null);

  // 設置自動抽取下一個停車位的定時器
  useEffect(() => {
    // 如果暫停，則清除定時器
    if (state.isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // 開始自動抽取
    if (!timerRef.current) {
      // 初始抽取
      if (state.isStarted && !state.currentUnit) {
        drawNext();
      }

      // 設置定時器，每1秒抽取一次
      timerRef.current = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // 當倒數到1，執行抽取並重置倒數
            drawNext();
            return 1;
          }
          return prev - 1;
        });
      }, 1 * 1000);
    }

    // 清理函數
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.isPaused, state.isStarted, state.isCompleted, drawNext]);

  return (
    <div className="md:w-1/2 bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-primary text-white p-4">
        <h2 className="text-xl font-bold">目前選號</h2>
      </div>

      <div className="p-6 flex flex-col items-center justify-center min-h-[500px]">
        <div className="mb-12 text-center">
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            目前抽出的停車位號碼
          </h3>
          <div className="text-6xl font-bold text-primary bg-blue-50 rounded-xl p-8 min-w-[200px] text-center">
            {state.currentSpot || "--"}
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            目前抽出的戶別
          </h3>
          <div className="text-5xl font-bold text-primary bg-blue-50 rounded-xl p-6 min-w-[180px] text-center">
            {state.currentUnit || "--"}
          </div>
        </div>

        <div className="mt-8 text-center">
          {state.isCompleted ? (
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-4">🎉 抽籤完成！</div>
              <div className="text-lg text-gray-600">所有住戶都已分配到停車位</div>
            </div>
          ) : state.isPaused ? (
            <Button
              onClick={drawNext}
              className="bg-accent hover:bg-orange-600 text-white text-xl font-bold py-4 px-8 rounded-lg shadow-md transition-colors h-auto"
            >
              手動抽取
            </Button>
          ) : (
            <div className="text-2xl font-semibold text-primary-600">
              <div className="mb-2">自動抽取中...</div>
              <div className="text-3xl font-bold">
                {countdown} 秒後抽取下一個
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentSelection;
