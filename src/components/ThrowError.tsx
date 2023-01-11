import React from "react";

interface ThrowErrorProps {
  message: string;
}

export const ThrowError: React.FC<ThrowErrorProps> = ({ message }) => {
  throw new Error(message);
};

ThrowError.displayName = "ThrowError";
