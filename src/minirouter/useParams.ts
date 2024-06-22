import { Direction } from "./createDirection";
import { AnyDirection } from "./types";
import { useNavigationContext } from "./useNavigationContext";

type ParamsFromDirection<T extends AnyDirection> =
  T extends Direction<any, infer TParams> ? TParams : never;

export function useParamsSafe<TDirection extends AnyDirection>(
  direction: TDirection,
): ParamsFromDirection<TDirection> | undefined {
  const { currentStep, parentSteps } = useNavigationContext();
  const allSteps = [...parentSteps, ...(currentStep ? [currentStep] : [])];
  const step = allSteps.find(direction.match);
  return step?.params;
}

export function useParams<TDirection extends AnyDirection>(
  direction: TDirection,
): ParamsFromDirection<TDirection> {
  const params = useParamsSafe(direction);
  if (params === undefined) {
    throw new Error(`Could not find step for ${direction.id}`);
  }
  return params;
}
