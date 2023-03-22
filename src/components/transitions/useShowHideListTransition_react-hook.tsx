// useShowHideListTransition.tsx

import { useEffect, useRef, useState } from "react";
import { TransitionState } from "./shared";

type RenderCallback<Item> = (
  item: Item,
  transitionState: TransitionState,
  shouldMount: boolean,
  isSHowing: boolean,
) => React.ReactNode;

type ItemWithState<Item> = {
  item: Item;
  key: number;
  transitionState: TransitionState;
};

type ItemWithKey<Item> = {
  item: Item;
  index: number;
};

export function insertArray<Item>(
  array: Array<Item>,
  asIndex: number,
  item: Item,
) {
  const newArr = [...array];
  newArr.splice(asIndex, 0, item);
  return newArr;
}

export function useListTransition<Item>(list: Array<Item>, timeout: number) {
  const keyRef = useRef(0);
  // change list to our list form with extra information.
  // XXX this gets called on every render but only used on first render
  const initialList: Array<ItemWithState<Item>> = list.map((item, key) => ({
    item,
    key: keyRef.current,
    transitionState: TransitionState.entered,
  }));

  const [listState, setListState] = useState(initialList);

  useEffect(
    function handleListChange() {
      const newItemsWithIndex: Array<ItemWithKey<Item>> = [];

      // 0: build up list of new items with their index
      // for each item in the list
      list.forEach((item, index) => {
        // XXX could this be a .contains?
        // if it is NOT in the state list
        if (listState.every((itemState) => itemState.item !== item)) {
          // push it into newItemsWithIndex with its index
          newItemsWithIndex.push({ item, index });
        }
      });

      // 1: add new items into list state
      if (newItemsWithIndex.length > 0) {
        keyRef.current++;
        setListState((prevListState) =>
          newItemsWithIndex.reduce(
            (prev, { item, index }, i) =>
              insertArray(prev, index, {
                item,
                key: keyRef.current,
                // XXX this was "from" in t-h,l not sure if this is right
                transitionState: TransitionState.startEntering,
              }),
            prevListState,
          ),
        );
      }

      // 2: enter those new items immediatly
      if (
        newItemsWithIndex.length === 0 &&
        listState.some((item) => item.stage === "from")
      ) {
        requestAnimationFrame(() => {
          setListState((prev) =>
            prev.map((item) => ({
              ...item,
              stage: item.stage === "from" ? "enter" : item.stage,
            })),
          );
        });
      }

      // 3 leave items from list state
      const subtractItemStates = listState.filter(
        (itemState) =>
          !list.includes(itemState.item) && itemState.stage !== "leave",
      );
      const subtractItems = subtractItemStates.map((item) => item.item);

      if (newItemsWithIndex.length === 0 && subtractItemStates.length > 0) {
        setListState((prev) =>
          prev.map((itemState) =>
            subtractItemStates.includes(itemState)
              ? { ...itemState, stage: "leave" }
              : itemState,
          ),
        );

        setAnimationFrameTimeout(() => {
          setListState((prev) =>
            prev.filter((item) => !subtractItems.includes(item.item)),
          );
        }, timeout);
      }
    },
    [list, listState, timeout],
  );

  function transition(renderCallback: RenderCallback<Item>) {
    return listState.map((item) => (
      <Fragment key={item.key}>
        {renderCallback(item.item, item.stage)}
      </Fragment>
    ));
  }

  return transition;
}
