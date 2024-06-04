import { createFileRoute } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/investigator/settings/cards/")({
  component: () => <div>Hello /investigator/settings/cards/!</div>,
});
