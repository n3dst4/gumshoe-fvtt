import { useCallback } from "react";
import { TrailActor } from "../module/TrailActor";

type XForm = (val: string) => any;
type Callback = (val: string) => void;

export const useUpdate = (entity: TrailActor, xform: XForm): Callback => {
  return useCallback((val: string) => {
    const update = xform(val);
    entity.update(update);
  }, [entity, xform]);
};
