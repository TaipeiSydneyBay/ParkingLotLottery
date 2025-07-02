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
                📢【雪梨灣｜機車位電腦抽籤公告】時間：7/5 19:00線上直播
              </h2>
              <p className="text-lg text-gray-700">
                🛵 本次機車格共計 619格，將進行電腦抽籤作業，分為「第一車位（固定）476戶」及「第二車位（月租）79個」抽籤。
              </p>
            </div>
            
            <div className="border-t pt-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-blue-600 mb-3">🔹第一車位（固定）隨機抽籤分區如下：</h3>
                <div className="space-y-2 ml-4">
                  <p>🦄 AB棟 ➜ 抽AB區車位</p>
                  <p className="ml-4">　未中籤者 ➜ 剩餘2戶抽B3</p>
                  <p>🦄 CDEF棟 ➜ 抽B3區車位</p>
                  <p>🦄 CDEFGH棟 ➜ 抽B2區車位</p>
                  <p>🦄 IJ棟 ➜ 抽B1區車位</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-blue-600 mb-3">🔹特殊戶別（免搭電梯）優先抽籤區：</h3>
                <div className="space-y-2 ml-4">
                  <p>🏠 B1F（277、281、283、285）</p>
                  <p>🏠 B1E（287、289、291、293、295）</p>
                  <p>👉 以上 9戶 ➜ 抽 B1</p>
                  <p>🏠 B2E（289、291、293、295）</p>
                  <p>👉 共 4戶 ➜ 抽 B2</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-green-600 mb-3">💰第二車位（月租）照登記順序抽籤：</h3>
                <div className="space-y-2 ml-4">
                  <p>B3餘13個、B2餘22個、B1餘82個，共117個可出租機車位：</p>
                  <p>登記共 78+1友善需求 ➜ 抽出後年繳使用</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-red-600 mb-3">⛔以下為自行車專區（不列入抽籤）共 13格：</h3>
                <div className="space-y-1 ml-4 text-sm">
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
