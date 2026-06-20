import React from "react";

interface WarningBoxProps {
  header: string;
  text: React.ReactNode;
}

export const WarningBox: React.FC<WarningBoxProps> = ({ header, text }) => {
  return (
    <div className="bg-orange-900 border border-yellow-700/50 rounded-lg p-4 mt-2 mb-2 shadow-sm">
      <div className="text-sm text-yellow-100/80">
        <span className="font-bold text-yellow-200 mr-1">{header}</span>
        <div className="mt-1">
          {text}
        </div>
      </div>
    </div>
  );
};
