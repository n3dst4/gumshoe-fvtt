import { renderHook } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { useAsyncUpdate } from "./useAsyncUpdate";

// this kinda restests the throttle function, but it's a good sanity check
it("should follow a typical scenario", () => {
  let state = "";
  const onChangeSpy = vi.fn((value: string) => {
    state = value;
  });
  vi.useFakeTimers();
  const { rerender, result } = renderHook(() =>
    useAsyncUpdate(state, onChangeSpy),
  );
  expect(result.current.display).toEqual("");
  const { onChange } = result.current;
  expect(onChangeSpy).not.toHaveBeenCalled();
  expect(result.current.display).toEqual("");
  onChange("foo");
  rerender();
  expect(result.current.display).toEqual("foo");
  expect(onChangeSpy).not.toHaveBeenCalled();
  vi.advanceTimersByTime(499);
  rerender();
  expect(result.current.display).toEqual("foo");
  expect(onChangeSpy).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  rerender();
  expect(result.current.display).toEqual("foo");
  expect(onChangeSpy).toHaveBeenCalledTimes(1);
  expect(onChangeSpy).toHaveBeenCalledWith("foo");
  vi.advanceTimersByTime(20);
  rerender();
  expect(result.current.display).toEqual("foo");
  onChange("bar");
  rerender();
  expect(result.current.display).toEqual("bar");
  vi.advanceTimersByTime(20);
  rerender();
  expect(result.current.display).toEqual("bar");
  onChange("baz");
  rerender();
  expect(result.current.display).toEqual("baz");
  vi.advanceTimersByTime(20);
  rerender();
  expect(result.current.display).toEqual("baz");
  onChange("qux");
  vi.advanceTimersByTime(439);
  rerender();
  expect(result.current.display).toEqual("qux");
  expect(onChangeSpy).toHaveBeenCalledTimes(1);
  vi.advanceTimersByTime(1);
  rerender();
  expect(result.current.display).toEqual("qux");
  expect(onChangeSpy).toHaveBeenCalledTimes(2);
  expect(onChangeSpy).toHaveBeenCalledWith("qux");
});
