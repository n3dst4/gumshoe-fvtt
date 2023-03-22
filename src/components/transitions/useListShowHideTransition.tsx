import { useEffect, useState } from "react";
import { useRefStash } from "../../hooks/useRefStash";
import { TransitionState } from "./shared";

interface ItemWithTransitionState<Item> {
  item: Item;
  transitionState: TransitionState;
}

export function useListShowHideTransition<Item>(
  externallList: Item[],
  getKey: (item: Item) => string,
  timeout: number,
) {
  const [internalList, setInternalList] = useState<
    ItemWithTransitionState<Item>[]
  >(
    externallList.map((item) => ({
      item,
      transitionState: TransitionState.entered,
    })),
  );

  const internalListRef = useRefStash(internalList);
  const getKeyRef = useRefStash(getKey);
  const timeoutStash = useRefStash(timeout);

  useEffect(() => {
    const newInternalList = [...internalListRef.current];

    const keysToRemove: string[] = [];
    const keysToEnter: string[] = [];

    const getKey = getKeyRef.current;

    // for each item in old list
    for (const oldItem of newInternalList) {
      const externalItem = externallList.find(
        (item) => getKey(item) === getKey(oldItem.item),
      );
      // if it exists in new list
      if (externalItem) {
        // update it
        oldItem.item = externalItem;
        // if it does not exist in new list
      } else {
        // set it to exiting
        oldItem.transitionState = TransitionState.exiting;
        // add it to a list to be removed
        keysToRemove.push(getKey(oldItem.item));
      }
    }

    // for each item in new list
    const neighbourKey: string | null = null;
    for (const externalItem of externallList) {
      const externalKey = getKey(externalItem);
      // if it does not exist in old list
      if (
        !internalListRef.current.some(
          (internalItem) => getKey(internalItem.item) === externalKey,
        )
      ) {
        // add it to a list to be added
        keysToEnter.push(getKey(externalItem));
        // add it to the list just after its neighbour with startEntering state
        const indexOfNeighbour =
          neighbourKey === null
            ? 0
            : newInternalList.findIndex(
                ({ item }) => getKey(item) === neighbourKey,
              );
        newInternalList.splice(indexOfNeighbour + 1, 0, {
          item: externalItem,
          transitionState: TransitionState.startEntering,
        });
      }
    }

    // update the state
    setInternalList(newInternalList);

    // if there are any items in the "remove" list
    if (keysToRemove.length > 0) {
      // set a timeout to remove them
      setTimeout(() => {
        setInternalList((internalList) =>
          internalList.filter(
            (internalItem) => !keysToRemove.includes(getKey(internalItem.item)),
          ),
        );
      }, timeoutStash.current);
    }

    // if the "new items" list is not empty
    if (keysToEnter.length > 0) {
      // set a timeout to start them entering
      requestAnimationFrame(() => {
        setInternalList((internalList) => {
          const mappedList = internalList.map((internalItem) => {
            if (keysToEnter.includes(getKey(internalItem.item))) {
              internalItem.transitionState = TransitionState.entering;
            }
            return internalItem;
          });
          return mappedList;
        });
      });
    }

    //   set a timeout to start them entering
  }, [externallList, getKeyRef, internalListRef, timeoutStash]);

  return internalList;
}
