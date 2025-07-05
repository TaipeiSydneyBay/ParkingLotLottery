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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* 機車圖示 */}
            <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg overflow-hidden border border-blue-200">
              <svg
                className="w-full h-full text-blue-600 p-8"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* 機車車身 */}
                <rect x="25" y="35" width="50" height="15" rx="7" fill="currentColor"/>
                {/* 前輪 */}
                <circle cx="20" cy="65" r="12" stroke="currentColor" strokeWidth="3" fill="none"/>
                <circle cx="20" cy="65" r="6" fill="currentColor"/>
                {/* 後輪 */}
                <circle cx="80" cy="65" r="12" stroke="currentColor" strokeWidth="3" fill="none"/>
                <circle cx="80" cy="65" r="6" fill="currentColor"/>
                {/* 把手 */}
                <path d="M25 35 L15 25 M25 35 L35 25" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                {/* 車座 */}
                <rect x="55" y="25" width="20" height="8" rx="4" fill="currentColor"/>
                {/* 連接部分 */}
                <line x1="20" y1="53" x2="20" y2="65" stroke="currentColor" strokeWidth="3"/>
                <line x1="80" y1="53" x2="80" y2="65" stroke="currentColor" strokeWidth="3"/>
                <line x1="32" y1="50" x2="68" y2="50" stroke="currentColor" strokeWidth="3"/>
              </svg>
            </div>

            {/* 停車場圖示 */}
            <div className="w-full h-48 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg overflow-hidden border border-green-200">
              <svg
                className="w-full h-full text-green-600 p-6"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* 建築物外框 */}
                <rect x="10" y="20" width="80" height="60" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                {/* 屋頂 */}
                <path d="M5 20 L50 5 L95 20" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2"/>
                {/* 停車格線 */}
                <line x1="25" y1="30" x2="25" y2="70" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="40" y1="30" x2="40" y2="70" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="55" y1="30" x2="55" y2="70" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="70" y1="30" x2="70" y2="70" stroke="currentColor" strokeWidth="1.5"/>
                {/* 停車位標記 */}
                <text x="17" y="55" fontSize="8" fill="currentColor" textAnchor="middle">P</text>
                <text x="32" y="55" fontSize="8" fill="currentColor" textAnchor="middle">P</text>
                <text x="47" y="55" fontSize="8" fill="currentColor" textAnchor="middle">P</text>
                <text x="62" y="55" fontSize="8" fill="currentColor" textAnchor="middle">P</text>
                <text x="77" y="55" fontSize="8" fill="currentColor" textAnchor="middle">P</text>
                {/* 入口 */}
                <rect x="42" y="75" width="16" height="5" fill="currentColor"/>
              </svg>
            </div>

            {/* 抽籤箱圖示 */}
            <div className="w-full h-48 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg overflow-hidden border border-orange-200">
              <svg
                className="w-full h-full text-orange-600 p-8"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* 抽籤箱 */}
                <rect x="20" y="40" width="60" height="45" rx="5" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.1"/>
                {/* 箱蓋 */}
                <ellipse cx="50" cy="40" rx="30" ry="8" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.2"/>
                {/* 投入口 */}
                <rect x="40" y="25" width="20" height="15" rx="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                {/* 抽籤紙片飛出效果 */}
                <rect x="65" y="15" width="8" height="12" rx="2" fill="currentColor" transform="rotate(15 69 21)"/>
                <rect x="75" y="10" width="6" height="9" rx="1.5" fill="currentColor" fillOpacity="0.7" transform="rotate(25 78 14.5)"/>
                <rect x="15" y="20" width="7" height="10" rx="1.5" fill="currentColor" fillOpacity="0.8" transform="rotate(-20 18.5 25)"/>
                {/* 手柄 */}
                <circle cx="75" cy="55" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                <line x1="75" y1="51" x2="75" y2="45" stroke="currentColor" strokeWidth="2"/>
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
