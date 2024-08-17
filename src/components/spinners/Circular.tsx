import React from "react";

const Circular: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-32 h-32 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default Circular;
