import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useParkingContext } from "@/contexts/ParkingContext";

const StartScreen: React.FC = () => {
  const { startSelection } = useParkingContext();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-secondary">
      <div className="max-w-4xl w-full mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            台北雪梨灣社區機車停車位選號系統
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            為您的社區自動分配機車停車位
          </p>

          {/* Image Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="w-full h-48 bg-gray-300 rounded-lg shadow-md overflow-hidden">
              <svg
                className="w-full h-full text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="24"
                  height="24"
                  fill="currentColor"
                  opacity="0.2"
                />
                <path
                  d="M3 21H21M3 18H21M6 18V9.5M18 18V9.5M10.5 18V13.5M13.5 18V13.5M4.5 10L12 3L19.5 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="w-full h-48 bg-gray-300 rounded-lg shadow-md overflow-hidden">
              <svg
                className="w-full h-full text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="24"
                  height="24"
                  fill="currentColor"
                  opacity="0.2"
                />
                <path
                  d="M8 18H2V6H22V18H16M12 2V6M4 6H20M16 10H20V14H16M4 10H8V14H4M12 10H14V18H10V10H12M9 18C9 19.6569 7.65685 21 6 21C4.34315 21 3 19.6569 3 18M21 18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="w-full h-48 bg-gray-300 rounded-lg shadow-md overflow-hidden">
              <svg
                className="w-full h-full text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="24"
                  height="24"
                  fill="currentColor"
                  opacity="0.2"
                />
                <path
                  d="M20 22V17M17.5 19.5H22.5M13 6.5L17.5 11M6.5 17.5L11 13M11 6.5L15.5 2L19 5.5L14.5 10M2 19L5.5 15.5L10 20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <Card className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-left space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                📢【台北雪梨灣｜機車位電腦抽籤公告】
              </h2>
              <p className="text-lg text-blue-600 font-semibold mb-3">
                ⏰時間：7/5 19:00 線上直播
              </p>
              <p className="text-lg text-gray-700">
                🛵 本次機車格共計 619 格，將進行電腦抽籤作業，分為「第一車位（固定）476 戶」及「第二車位（月租）87 戶」抽籤。
              </p>
            </div>
            
            <div className="border-t pt-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-blue-600 mb-3">🔹第一車位（固定）隨機抽籤分區如下：</h3>
                <div className="space-y-2 ml-4">
                  <p>🦄 AB 棟 ➜ 抽 AB 區車位</p>
                  <p className="ml-4">　未中籤者 ➜ 剩餘 2 戶抽 B3</p>
                  <p>🦄 CDEF 棟 ➜ 抽 B3 區車位</p>
                  <p>🦄 CDEFGH 棟 ➜ 抽 B2 區車位</p>
                  <p>🦄 IJ 棟 ➜ 抽 B1 區車位</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-blue-600 mb-3">🔹特殊戶別（免搭電梯）抽籤區：</h3>
                <div className="space-y-2 ml-4">
                  <p>🏠 F5-1F、F7-1F、F8-1F、F9-1F</p>
                  <p>🏠 E9-2F、E8-2F、E7-2F、E6-2F、E5-2F</p>
                  <p>👉 以上 9 戶 ➜ 抽 B1</p>
                  <p>🏠 E8-1F、E7-1F、E6-1F、E5-1F</p>
                  <p>👉 共 4 戶 ➜ 抽 B2</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-green-600 mb-3">💰第二車位（月租）照登記順序抽籤：</h3>
                <div className="space-y-2 ml-4">
                  <p>B3 餘 13 格、B2 餘 31 格、B1 餘 73 格，共 117 格可出租機車位：</p>
                  <p>登記共 87 戶需求 ➜ 抽出後年繳使用</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-red-600 mb-3">⛔以下為自行車專區（不列入抽籤）共 13 格：</h3>
                <div className="space-y-1 ml-4">
                  <p>B1：572、573</p>
                  <p>B2：159、160、161、486、487、408、338、339、340</p>
                  <p>B3：82、143-1</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Button
          onClick={startSelection}
          className="start-selection-btn text-2xl md:text-4xl font-bold py-6 px-12 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 h-auto"
        >
          開始選號
        </Button>
      </div>
    </div>
  );
};

export default StartScreen;
