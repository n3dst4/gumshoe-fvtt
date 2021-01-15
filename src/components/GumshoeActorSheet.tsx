/** @jsx jsx */
import React, { useCallback } from "react";
import { GumshoeActor } from "../module/GumshoeActor";
import { PoolTracker } from "./PoolTracker";
import { css, jsx, Global } from "@emotion/react";

type GumshoeActorSheetProps = {
  entity: GumshoeActor,
  foundryWindow: Application,
}

export const GumshoeActorSheet = ({
  entity,
  foundryWindow,
}: GumshoeActorSheetProps) => {
  const onImageClick = useCallback(() => {
    console.log("onImageClick");
    const fp = new FilePicker({
      type: "image",
      current: entity.data.img,
      callback: (path) => {
        entity.update({
          img: path,
        });
      },
      top: foundryWindow.position.top + 40,
      left: foundryWindow.position.left + 10,
    });
    // types aren't quite right for fp
    return (fp as any).browse();
  }, []);

  return (
    <div
      css={css`
        font-family: 'Imbue', serif;
      `}

    >
      <Global
        styles={css`
        @import url('https://fonts.googleapis.com/css2?family=Imbue:wght@300&display=swap');
        `}
      />
      <h1>
        <img
          style={{
            width: "4em",
          }}
          src={entity.data.img}
          onClick={onImageClick}
        />
        {entity.data.name}
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
