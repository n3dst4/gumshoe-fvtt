/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useContext } from "react";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { ActorSheetAppContext } from "../FoundryAppContext";
import { MwItemGroup } from "./MwItemGroup";

type MwItemAreaProps = {
  actor: InvestigatorActor,
};

export const MwItemArea: React.FC<MwItemAreaProps> = ({
  actor,
}) => {
  const app = useContext(ActorSheetAppContext);

  const onDragStart = useCallback((e: React.DragEvent<HTMLAnchorElement>) => {
    if (app !== null) {
      (app as any)._onDragStart(e);
    }
  }, [app]);

  const items = actor.getMwItems();
  return (
    <div>
      <MwItemGroup items={items.tweak} onDragStart={onDragStart} actor={actor} />
    </div>
  );
};
