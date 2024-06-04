import { createFileRoute } from "@tanstack/react-router";
import React from "react";

export function RootIndex() {
  return <div>RootIndex</div>;
}

export const Route = createFileRoute("/")({
  component: RootIndex,
});
