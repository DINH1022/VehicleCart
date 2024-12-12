import React from 'react';

const Star = ({ percentage, color }) => {
  const fullStar = Math.floor(percentage);
  const partialStar = percentage - fullStar; 

  return (
    <div className="relative inline-block">
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
    
        <path
          d="M12 17.77l6.18 3.73-1.64-7.03 5.44-4.73-7.18-.62L12 2.5 9.2 9.15l-7.18.62 5.44 4.73-1.64 7.03L12 17.77z"
          className={`text-${color}`} 
        />
        
      </svg>
    </div>
  );
};

export default Star;
