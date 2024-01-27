import { beforeEach, expect, test, vi } from "vitest";

import { createDocumentMemory } from "./createDocumentMemory";
import { listEdits } from "./listEdits";
import { save } from "./save";
import { advanceTime10s, epoch, getAdditiveStates } from "./testHelpers";

beforeEach(() => {
  vi.setSystemTime(new Date(epoch));
});

test.each(new Array(20).fill(null).map((_, i) => i))(
  "listEdits: %i edits",
  (i) => {
    let memory = createDocumentMemory(3);
    const states = getAdditiveStates(i);
    for (const state of states) {
      memory = save(memory, state);
      advanceTime10s();
    }
    const edits = listEdits(memory);
    expect(edits).toMatchSnapshot();
  },
);
