import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-12 h-12">
        <div className="w-full h-full border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <span className="mt-2 text-sm text-black font-semibold">Loading...</span>
    </div>
  );
};

export default Spinner;
