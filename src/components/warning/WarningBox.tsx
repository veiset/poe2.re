import React from "react";
import {cn} from "@/lib/utils.ts";

interface WarningBoxProps {
  header: React.ReactNode;
  text: React.ReactNode;
  headerClassName?: string;
}

export const WarningBox: React.FC<WarningBoxProps> = ({ header, text, headerClassName }) => {
  return (
    <div className="bg-orange-900 border border-yellow-700/50 rounded-lg p-4 mt-2 mb-2 shadow-sm">
      <div className="text-sm text-yellow-100/80">
        <div className={cn("font-bold text-yellow-200 mr-1", headerClassName)}>{header}</div>
        <div className="mt-1">
          {text}
        </div>
      </div>
    </div>
  );
};
