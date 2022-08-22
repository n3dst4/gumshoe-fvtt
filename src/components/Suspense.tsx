import React from "react";

export const Suspense: React.FC = ({ children }) => (
  <React.Suspense fallback={<div>Loading...</div>}>{children}</React.Suspense>
);
