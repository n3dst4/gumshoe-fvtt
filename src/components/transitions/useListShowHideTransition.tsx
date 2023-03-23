import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useRefStash } from "../../hooks/useRefStash";
import { showingStates, TransitionState } from "./shared";

interface ItemWithTransitionState<Item> {
  item: Item;
  transitionState: TransitionState;
}

export function useListShowHideTransition<Item>(
  externallList: Item[],
  getKey: (item: Item) => string,
  timeout: number,
) {
  console.log("rendering useListShowHideTransition");
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
    console.log("useEffect");
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
    let neighbourKey: string | null = null;
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
        const newItem: ItemWithTransitionState<Item> = {
          item: externalItem,
          transitionState: TransitionState.startEntering,
        };
        newInternalList.splice(indexOfNeighbour + 1, 0, newItem);
      }
      neighbourKey = externalKey;
    }

    // update the state
    // flushSync is needed in React 18+ to avoid automatic batching. without it,
    // the state update will be batched with the timeout below, so we will not
    // see the items render in their "out" state.
    // see https://github.com/reactwg/react-18/discussions/21
    // raf is needed bec
    requestAnimationFrame(() => {
      flushSync(() => {
        setInternalList(newInternalList);
      });
    });
    console.log("newInternalList", newInternalList);

    // if there are any items in the "remove" list
    if (keysToRemove.length > 0) {
      // set a timeout to remove them
      setTimeout(() => {
        setInternalList((internalList) => {
          const filteredList = internalList.filter(
            (internalItem) => !keysToRemove.includes(getKey(internalItem.item)),
          );
          console.log("filteredList", filteredList);
          return filteredList;
        });
      }, timeoutStash.current);
    }

    // if the "new items" list is not empty
    if (keysToEnter.length > 0) {
      // set a timeout to start them entering
      requestAnimationFrame(() => {
        setInternalList((internalList) => {
          const mappedList = internalList.map((internalItem) => {
            if (keysToEnter.includes(getKey(internalItem.item))) {
              return {
                item: internalItem.item,
                transitionState: TransitionState.entering,
              };
            } else {
              return internalItem;
            }
          });
          console.log("start entering", mappedList);
          return mappedList;
        });
      });
    }
  }, [externallList, getKeyRef, internalListRef, timeoutStash]);

  return internalList.map((internalItem) => ({
    item: internalItem.item,
    transitionState: internalItem.transitionState,
    isShowing: showingStates.includes(internalItem.transitionState),
  }));
}
