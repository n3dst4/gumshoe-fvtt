import React from "react";
import { PoolTracker } from "./PoolTracker";

type GumshoeActorSheetProps = {
  entity: any,
}

export const GumshoeActorSheet = ({
  entity,
}: GumshoeActorSheetProps) => {
  // const updateName =

  return (
    <div>
      <h1>
        React <b>App</b> for {entity.data.name}!
      </h1>
      <p>
        <input value={entity.data.name} onChange={(e) => entity.update({ name: e.currentTarget.value })} />
        <h2>Sanity</h2>
        <PoolTracker value={entity.data.data.sanity || 0} min={0} max={15}/>
        <h2>Stability</h2>
        <PoolTracker value={entity.data.data.stability || 0} min={-12} max={15}/>
        <h2>Health</h2>
        <PoolTracker value={entity.data.data.health || 0} min={-12} max={15}/>
        <h2>Magic</h2>
        <PoolTracker value={entity.data.data.magic || 0} min={0} max={15}/>
      </p>
    </div>
  );
};
