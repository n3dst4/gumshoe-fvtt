import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { inputThrottleTime } from "../../constants";
import { isNullOrEmptyString } from "../../functions/utilities";
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

afterEach(() => {
  vi.useRealTimers();
});

it("should show input value and call onChange eventually", async () => {
  const onChange = vi.fn();
  const { getByRole } = render(
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

  vi.useRealTimers();
});

describe.each<[string, string, string | undefined, string | undefined]>([
  ["too high", "11", undefined, "10"],
  ["too high", "99", undefined, "10"],
  ["too high", Number.MAX_SAFE_INTEGER.toString(), undefined, "10"],
  ["too high", "0", undefined, "-1"],
  ["too high", "-100", undefined, "-200"],
  ["too high", "100", undefined, "-200"],
  ["too high", Number.MAX_SAFE_INTEGER.toString(), undefined, "-200"],
])(
  "when input is %s (input %s, min %s, max %s)",
  async (_, input, min, max) => {
    it("should not call upstream onChange", async () => {
      const onChange = vi.fn();
      const { getByRole } = render(
        <AsyncNumberInput
          value={2}
          onChange={onChange}
          min={isNullOrEmptyString(min) ? undefined : Number(min)}
          max={isNullOrEmptyString(max) ? undefined : Number(max)}
          className="test"
        />,
      );
      const inputEl = getByRole("text-input");
      inputEl.focus();
      await user.keyboard("{backspace}" + input);
      expect(getByRole("text-input").getAttribute("value")).toBe(input);
      expect(onChange).toHaveBeenCalledTimes(0);
      vi.advanceTimersByTime(inputThrottleTime * 2);
      expect(onChange).toHaveBeenCalledTimes(0);
    });
  },
);
