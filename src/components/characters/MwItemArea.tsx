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
      <MwItemGroup name="Tweaks" mwType="tweak" items={items.tweak} onDragStart={onDragStart} actor={actor} />
      <MwItemGroup name="Cantraps" mwType="cantrap" items={items.cantrap} onDragStart={onDragStart} actor={actor} />
      <MwItemGroup name="Spells" mwType="spell" items={items.spell} onDragStart={onDragStart} actor={actor} />
      <MwItemGroup name="EnchantedItems" mwType="enchantedItem" items={items.enchantedItem} onDragStart={onDragStart} actor={actor} />
      <MwItemGroup name="Melee Weapons" mwType="meleeWeapon" items={items.meleeWeapon} onDragStart={onDragStart} actor={actor} />
      <MwItemGroup name="Missile Weapons" mwType="missileWeapon" items={items.missileWeapon} onDragStart={onDragStart} actor={actor} />
    </div>
  );
};
