import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

interface CheckOrCrossProps {
  checked: boolean;
}

export const CheckOrCross: React.FC<CheckOrCrossProps> = ({ checked }) => {
  return checked ? <FaCheck /> : <FaTimes />;
};

CheckOrCross.displayName = "CheckOrCross";
