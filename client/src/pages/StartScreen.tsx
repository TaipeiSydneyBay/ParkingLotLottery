import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useParkingContext } from '@/contexts/ParkingContext';

const StartScreen: React.FC = () => {
  const { startSelection } = useParkingContext();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-secondary">
      <div className="max-w-4xl w-full mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            社區機車停車位選號系統
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            為您的社區自動分配機車停車位
          </p>
          
          {/* Image Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="w-full h-48 bg-gray-300 rounded-lg shadow-md overflow-hidden">
              <svg className="w-full h-full text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="currentColor" opacity="0.2"/>
                <path d="M3 21H21M3 18H21M6 18V9.5M18 18V9.5M10.5 18V13.5M13.5 18V13.5M4.5 10L12 3L19.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="w-full h-48 bg-gray-300 rounded-lg shadow-md overflow-hidden">
              <svg className="w-full h-full text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="currentColor" opacity="0.2"/>
                <path d="M8 18H2V6H22V18H16M12 2V6M4 6H20M16 10H20V14H16M4 10H8V14H4M12 10H14V18H10V10H12M9 18C9 19.6569 7.65685 21 6 21C4.34315 21 3 19.6569 3 18M21 18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="w-full h-48 bg-gray-300 rounded-lg shadow-md overflow-hidden">
              <svg className="w-full h-full text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="currentColor" opacity="0.2"/>
                <path d="M20 22V17M17.5 19.5H22.5M13 6.5L17.5 11M6.5 17.5L11 13M11 6.5L15.5 2L19 5.5L14.5 10M2 19L5.5 15.5L10 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        
        <Card className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">停車位分配規則</h2>
          <div className="text-left">
            <p className="mb-4">社區總共有 ABCDEFGHIJ 10 棟，每戶只能抽一個停車位。</p>
            <ul className="space-y-2 text-gray-700">
              <li><span className="font-semibold">AB棟:</span> 總共 44 戶，可抽 AB 棟的 43 個停車位以及 B3 預留的 2 個停車位</li>
              <li><span className="font-semibold">C棟:</span> 總共 83 戶，可抽 B3 預留的 97 個停車位及 B2 預留的 343 個停車位</li>
              <li><span className="font-semibold">D棟:</span> 總共 84 戶，可抽 B3 預留的 97 個停車位及 B2 預留的 343 個停車位</li>
              <li><span className="font-semibold">E棟:</span> 總共 89 戶，可抽 B2 預留的 343 個停車位及 B1 預留的 124 個停車位</li>
              <li><span className="font-semibold">F棟:</span> 總共 96 戶，可抽 B2 預留的 343 個停車位及 B1 預留的 124 個停車位</li>
              <li><span className="font-semibold">GH棟:</span> 總共 40 戶，可抽 B2 預留的 343 個停車位</li>
              <li><span className="font-semibold">IJ棟:</span> 總共 40 戶，可抽 B1 預留的 124 個停車位</li>
            </ul>
          </div>
        </Card>
        
        <Button 
          onClick={startSelection}
          className="bg-accent hover:bg-orange-600 text-white text-2xl md:text-4xl font-bold py-6 px-12 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 h-auto"
        >
          開始選號
        </Button>
      </div>
    </div>
  );
};

export default StartScreen;
