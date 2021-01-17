import { useCallback } from "react";

type Transform<T> = (val: T) => any;
type Callback<T> = (val: T) => void;

/**
 * Hook to create a callback to update a given entity with a given value. The
 * transform argument should take the one value given to the callback and return
 * the entity partial to be used for the update.
 *
 * Examples:
 * const updateName = useUpdate(actor, (name) => ({name}))
 * const updateOccupation = useUpdate(entity, occupation => ({ data: { occupation } }));
 */
export const useUpdate = <T>(entity: Entity, transform: Transform<T>): Callback<T> => {
  return useCallback((val: T) => {
    const update = transform(val);
    entity.update(update);
  }, [entity, transform]);
};
