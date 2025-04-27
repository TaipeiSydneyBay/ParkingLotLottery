import React from 'react';

interface BuildingFilterProps {
  building: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

const BuildingFilter: React.FC<BuildingFilterProps> = ({ 
  building, 
  label, 
  active, 
  onClick 
}) => {
  return (
    <button
      className={`${
        active 
          ? 'bg-blue-700' 
          : 'bg-blue-600 hover:bg-blue-700'
      } px-3 py-1 rounded-full text-sm font-medium text-white`}
      onClick={onClick}
      data-building={building}
    >
      {label}
    </button>
  );
};

export default BuildingFilter;
