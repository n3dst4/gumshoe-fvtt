/** @jsx jsx */
import React, { useCallback } from "react";
import { TrailActor } from "../module/TrailActor";
import { PoolTracker } from "./PoolTracker";
import { css, jsx, Global } from "@emotion/react";

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
      }}
    >
      <Global
        // se also
        // Tenor Sans
        // Federo
        styles={css`
        @import url('https://fonts.googleapis.com/css2?family=Imbue:wght@300&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Arya:wght@400;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Tenor+Sans&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Federo&display=swap');
        `}
      />
      <div
        css={{
          gridArea: "title",
          perspective: "1000px",
          perspectivOrigin: "50% 50%",
        }}
      >
        <h1
          css={{
            position: "relative",
            display: "inline-block",
            // fontFamily: "'Arya', sans-serif",
            // fontFamily: "'Tenor Sans', sans-serif",
            fontFamily: "'Federo', sans-serif",
            textTransform: "uppercase",
            fontSize: "4em",
            // fontWeight: "bold",
            letterSpacing: "-0.04em",
            transform: "scaleX(1) scaleY(1.6) rotateY(-30deg) rotateZ(-1deg) translateX(-10%)",
            border: "none",
            margin: "0.5em",
            padding: 0,
            lineHeight: 1,
            ":before": {
              position: "absolute",
              top: 0,
              left: 0,
              content: "'TRAIL OF CTHULHU'",
              textShadow: "2px 0px 1px black, 6px 3px 4px rgba(0,0,0,0.5)",
              color: "transparent",
              zIndex: -1,
            },
            ":after": {
              position: "absolute",
              top: 0,
              left: 0,
              content: "'TRAIL OF CTHULHU'",
              background: "linear-gradient(to bottom right, #000, #BE9F00)",
              backgroundClip: "text",
              color: "transparent",
            },

          }}
        >
          tRaIl Of CtHuLhU
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
