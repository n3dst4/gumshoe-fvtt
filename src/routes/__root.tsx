import { createRootRoute, Outlet } from "@tanstack/react-router";
import React from "react";

export const Root: React.FC = () => {
  return (
    <div>
      Root component?
      <Outlet />
    </div>
  );
};

export const Route = createRootRoute({
  component: Root,
});
