import React from "react";
import {cn} from "@/lib/utils.ts";

interface WarningBoxProps {
  header?: React.ReactNode;
  text: React.ReactNode;
  headerClassName?: string;
  size?: "s" | "m";
}

export const WarningBox: React.FC<WarningBoxProps> = ({ header, text, size = "m",  headerClassName }) => {
  let boxSizeClass = "p-4"
  let textSizeClass = "text-sm"
  if (size === "s") {
    boxSizeClass = "p-2"
    textSizeClass = "text-[12px]"
  }

  return (
    <div className={cn("bg-orange-900 border border-yellow-700/50 rounded-lg p-4 mt-2 mb-2 shadow-sm", boxSizeClass)}>
      <div className="text-sm text-yellow-100/80">
        {header && <div className={cn("font-bold text-yellow-200 mr-1 mb-1", headerClassName)}>{header}</div>}
        <div className={textSizeClass}>
          {text}
        </div>
      </div>
    </div>
  );
};
