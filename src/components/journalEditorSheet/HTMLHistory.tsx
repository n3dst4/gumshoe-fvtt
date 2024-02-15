import React from "react";

interface HTMLHistoryProps {
  page: any;
  onDone: () => void;
}

export const HTMLHistory: React.FC<HTMLHistoryProps> = ({ page: any }) => {
  return <div>History</div>;
};

HTMLHistory.displayName = "HTMLHistory";
