import { useCallback } from "react";

type Transform = (val: string) => any;
type Callback = (val: string) => void;

/**
 * Hook to create a callback to update a given entity with a given value. The
 * transform argument should take the one value given to the callback and return
 * the entity partial to be used for the update.
 *
 * Examples:
 * const updateName = useUpdate(actor, (name) => ({name}))
 * const updateOccupation = useUpdate(entity, occupation => ({ data: { occupation } }));
 */
export const useUpdate = (entity: Entity, transform: Transform): Callback => {
  return useCallback((val: string) => {
    const update = transform(val);
    entity.update(update);
  }, [entity, transform]);
};
