import { AnyStep, Step } from "./types";

type ParamsBase = Record<string, number | string> | string | number | void;

export class Direction<TId extends string, TParams extends ParamsBase = void> {
  constructor(public id: string) {}

  match = (other: AnyStep): other is Step<this> => {
    return this.id === other.direction.id;
  };

  go(params: TParams): Step<Direction<TId, TParams>> {
    return {
      direction: this,
      params,
    };
  }
}

// sorry about the function statements, this could be () => () => Direction
// but something gets screwed up in my syntax highlighting
export const createDirection = function <TId extends string = string>(id: TId) {
  type NewType<TParams extends ParamsBase> = Direction<TId, TParams>;

  return function <TParams extends ParamsBase = void>(): NewType<TParams> {
    return new Direction<TId, TParams>(id);
  };
};
