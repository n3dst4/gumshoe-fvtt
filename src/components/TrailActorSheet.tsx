/** @jsx jsx */
import React, { useCallback } from "react";
import { TrailActor } from "../module/TrailActor";
import { PoolTracker } from "./PoolTracker";
import { css, Global, jsx } from "@emotion/react";
import { TrailLogo } from "./TrailLogo";

type TrailActorSheetProps = {
  entity: TrailActor,
  foundryWindow: Application,
}

export const TrailActorSheet = ({
  entity,
  foundryWindow,
}: TrailActorSheetProps) => {
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
      css={{
        fontFamily: "'Imbue', serif",
        display: "grid",
        gridTemplateRows: "auto auto auto",
        gridTemplateColumns: "auto auto auto",
        gridTemplateAreas:
          "\"title title image\" " +
          "\"pools stats image\" " +
          "\"pools body  body\" ",
        h1: {
          border: "none",
          margin: 0,
          padding: 0,
        },
      }}
    >
      <Global
        styles={css`
        @import url('https://fonts.googleapis.com/css2?family=Imbue:wght@300&display=swap');
        `}
      />

      <div
        css={{
          gridArea: "title",
        }}
      >
        <h1>
          <TrailLogo/>
        </h1>
      </div>
      <div
        css={{
          gridArea: "image",
        }}
      >
        <img
          style={{
            width: "4em",
          }}
          src={entity.data.img}
          onClick={onImageClick}
        />
      </div>

      <div
        css={{
          gridArea: "stats",
        }}

      >
        <input
          value={entity.data.name}
          onChange={(e) => entity.update({ name: e.currentTarget.value })}
        />
      </div>

      <div
        css={{
          gridArea: "pools",
        }}
      >
        <h2>Sanity</h2>
        <PoolTracker value={entity.data.data.sanity || 0} min={0} max={15}/>
        <h2>Stability</h2>
        <PoolTracker value={entity.data.data.stability || 0} min={-12} max={15}/>
        <h2>Health</h2>
        <PoolTracker value={entity.data.data.health || 0} min={-12} max={15}/>
        <h2>Magic</h2>
        <PoolTracker value={entity.data.data.magic || 0} min={0} max={15}/>
      </div>
    </div>
  );
};
