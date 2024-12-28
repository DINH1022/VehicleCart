import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-500 animate-[spin_0.8s_linear_infinite]"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
