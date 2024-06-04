import { createMemoryHistory, createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

const history = createMemoryHistory({
  initialEntries: ["/"],
});

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  history,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
