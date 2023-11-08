import React from "react";

import { useTheme } from "../../hooks/useTheme";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { assertNPCActor } from "../../v10Types";
import { CSSReset } from "../CSSReset";
import { ImagePickle } from "../ImagePickle";
import { LogoEditable } from "./LogoEditable";

type NPCSheetSimpleProps = {
  actor: InvestigatorActor;
  foundryApplication: ActorSheet;
};

export const NPCSheetSimple = ({
  actor,
  foundryApplication,
}: NPCSheetSimpleProps) => {
  assertNPCActor(actor);
  const themeName = actor.getSheetThemeName();
  const theme = useTheme(themeName);
  const notes = actor.getNotes().html;
  const hasNotes = notes.length > 0;

  return (
    <CSSReset
      theme={theme}
      mode="large"
      css={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: "flex",
        alignItems: "stretch",
        alignContent: "flex-start",
        flexWrap: "wrap",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <LogoEditable
        mainText={actor.name ?? ""}
        onChangeMainText={actor.setName}
        css={{
          fontSize: "0.66em",
          width: "100%",
        }}
      />
      <div
        css={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "row",
          gap: "1em",
        }}
      >
        <div
          css={{
            containerType: "size",
            display: "flex",
            justifyContent: "center",
            alignItems: "start",

            flex: 1,
            padding: "1em",
          }}
        >
          <ImagePickle
            subject={actor}
            application={foundryApplication}
            css={{
              width: "100%",
              height: "auto",
              aspectRatio: "1/1",
              "@container (aspect-ratio > 1/1)": {
                width: "auto",
                height: "100%",
              },

              transform: "rotateZ(-1deg)",
            }}
          />
        </div>
        {hasNotes && (
          <div
            css={{
              flex: 1,
              overflow: "auto",
            }}
            dangerouslySetInnerHTML={{ __html: notes }}
          />
        )}
      </div>
    </CSSReset>
  );
};

NPCSheetSimple.displayName = "NPCSheetSimple";
