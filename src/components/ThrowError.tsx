import React from "react";

interface ThrowErrorProps {
  message: string;
}

export const ThrowError = (
  {
    message
  }: ThrowErrorProps
) => {
  throw new Error(message);
};

ThrowError.displayName = "ThrowError";
