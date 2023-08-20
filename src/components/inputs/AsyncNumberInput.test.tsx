import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterAll, beforeEach, expect, it, vi } from "vitest";

import { inputThrottleTime } from "../../constants";
import { AsyncNumberInput } from "./AsyncNumberInput";

// set up uiser interactions
const user = userEvent.setup({
  // this *should* be how you tell user-event to use vitest's fake timers, but
  // see `vitest.setup.js` in this repo for a hacky workaround to a user-event
  // bug
  advanceTimers: vi.advanceTimersByTime,
});

beforeEach(() => {
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
});

it("should show input value and call onChange eventually", async () => {
  const onChange = vi.fn();
  const { getByRole, unmount } = render(
    <AsyncNumberInput value={2} onChange={onChange} />,
  );
  const input = getByRole("text-input");
  input.focus();
  await user.keyboard("{backspace}123");
  expect(getByRole("text-input").getAttribute("value")).toBe("123");
  expect(onChange).toHaveBeenCalledTimes(0);
  vi.advanceTimersByTime(inputThrottleTime - 1);
  expect(onChange).toHaveBeenCalledTimes(0);
  vi.advanceTimersByTime(1);
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(123);

  unmount();
  vi.useRealTimers();
});
