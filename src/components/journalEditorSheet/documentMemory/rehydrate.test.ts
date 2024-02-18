import { expect, test, vi } from "vitest";

import { createDocumentMemory } from "./createDocumentMemory";
import { dehydrate } from "./dehydrate";
import { rehydrate } from "./rehydrate";
import { save } from "./save";
import { advanceTime10s, getAdditiveStates } from "./testHelpers";

vi.setSystemTime(0);
let documentMemory = createDocumentMemory(3);
const states = getAdditiveStates(26);
for (let i = 0; i < states.length; i++) {
  documentMemory = save(documentMemory, states[i]);
  advanceTime10s();
}

test("rehydrates a dehydrated memory", () => {
  const dehydrated = dehydrate(documentMemory);
  expect(rehydrate(dehydrated)).toEqual(documentMemory);
});
