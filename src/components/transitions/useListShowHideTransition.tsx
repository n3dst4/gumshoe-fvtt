import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useRefStash } from "../../hooks/useRefStash";

interface ItemWithTransitionState<Item> {
  item: Item;
  isShowing: boolean;
  key: string;
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
      isShowing: true,
      key: getKey(item),
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
    for (const [i, oldItem] of newInternalList.entries()) {
      const externalItem = externallList.find(
        (item) => getKey(item) === oldItem.key,
      );
      // if it exists in new list
      if (externalItem) {
        // update it
        newInternalList[i] = {
          ...oldItem,
          item: externalItem,
        };
        // if it does not exist in new list
      } else {
        // set it to exiting
        newInternalList[i] = {
          ...oldItem,
          isShowing: false,
        };
        // add it to a list to be removed
        keysToRemove.push(oldItem.key);
      }
    }

    // for each item in new list
    let neighbourKey: string | null = null;
    for (const externalItem of externallList) {
      const externalKey = getKey(externalItem);
      // if it does not exist in old list
      if (
        !internalListRef.current.some(
          (internalItem) => internalItem.key === externalKey,
        )
      ) {
        // add it to a list to be added
        keysToEnter.push(externalKey);
        // add it to the list just after its neighbour with startEntering state
        const indexOfNeighbour =
          neighbourKey === null
            ? 0
            : newInternalList.findIndex(
                ({ key: internaItemKey }) => internaItemKey === neighbourKey,
              );
        const newItem: ItemWithTransitionState<Item> = {
          item: externalItem,
          isShowing: false,
          key: externalKey,
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

    // if there are any items in the "remove" list
    if (keysToRemove.length > 0) {
      // set a timeout to remove them
      setTimeout(() => {
        setInternalList((internalList) => {
          const filteredList = internalList.filter(
            (internalItem) => !keysToRemove.includes(internalItem.key),
          );
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
            if (keysToEnter.includes(internalItem.key)) {
              return {
                ...internalItem,
                isShowing: true,
              };
            } else {
              return internalItem;
            }
          });
          return mappedList;
        });
      });
    }
  }, [externallList, getKeyRef, internalListRef, timeoutStash]);

  return internalList;
}
