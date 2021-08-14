import { useCallback, useRef } from "react";

type Transform<T> = (val: T) => any;
type Callback<T> = (val: T) => void;

/**
 * Hook to create a callback to update a given entity with a given value. The
 * transform argument should take the one value given to the callback and return
 * the entity partial to be used for the update.
 *
 * Note that the transform func is cached in a ref so you can't meaningfully
 * change it after the first render. This is by design, to prevent the callback
 * being constantly regenerated.
 *
 * Examples:
 * const updateName = useUpdate(actor, (name) => ({name}))
 * const updateOccupation = useUpdate(entity, occupation => ({ data: { occupation } }));
 */
export const useUpdate = <T>(entity: foundry.abstract.Document<any, any>, transform: Transform<T>): Callback<T> => {
  // keep a record of the transform in a ref so it's stable and we don't keep
  // regenerating the callback
  const transformStable = useRef(transform);

  return useCallback((val: T) => {
    const update = transformStable.current(val);
    entity.update(update);
  }, [entity]);
};
