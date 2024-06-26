import { PropsWithChildren } from "react";

import { Direction } from "./createDirection";

/**
 * What it says - this type can accept any Direction<...>
 */
export type AnyDirection = Direction<string, any>;

/**
 * A Step is a concrete piece of the current state of the router. It contains
 * a direction, and the params (if any) that go with it.
 */
export type Step<TDirection extends AnyDirection> = {
  direction: TDirection;
  params: TDirection extends Direction<any, infer TParams> ? TParams : never;
};

/**
 * A general type that can accept any Step<...>
 */
export type AnyStep = Step<AnyDirection>;

/**
 * Options for the "from" prop of a Link or the first argument to `navigate`.
 * `root` means "navigate to the root then to whatever is in the `to` prop",
 * and `here` means "just add whatever is in the `to` prop to the current path".
 */
type LogicalDirection = "root" | "here";

/**
 * A value that can be fiven as the "from" prop of a Link or the first argument
 * to `navigate`.
 */
export type DirectionType = AnyDirection | LogicalDirection;

/**
 * Each layer of trhe router is wrapped in a context. This is the value of that
 * context.
 */
export type NavigationContextValue = {
  /**
   * Change the state of the router. This is the only way to change the current
   * state of the router.
   *
   * @param from Where to start navigation from.
   * @param to The step or steps to go to.
   */
  navigate: (from: DirectionType, to: AnyStep | AnyStep[] | "up") => void;
  currentStep: AnyStep | undefined;
  parentSteps: AnyStep[];
  childSteps: AnyStep[];
};

/**
 * Convenience type for the props of a Route implementation
 */
export type PropsWithChildrenAndDirection<T = unknown> =
  PropsWithChildren<T> & {
    direction: AnyDirection;
  };

/**
 * An Outlet is a bit of context-driven magic that allows you to control
 * rendering child routes. This is the context value that it uses.
 */
export type OutletContextValue = {
  register: (id: string, content: React.ReactNode) => void;
  unregister: (id: string) => void;
};
