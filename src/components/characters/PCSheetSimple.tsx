import React, {    
  useEffect,
  useState,
} from "react";

import { assertGame } from "../../functions/utilities";
import { useTheme } from "../../hooks/useTheme";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import {
  AnyItem,
  assertPCActor,
  PersonalDetailItem,
} from "../../v10Types";
// import CardsArea from "../cards/CardsArea";
import { CSSReset } from "../CSSReset";
import { ImagePickle } from "../ImagePickle";
import { LogoEditable } from "./LogoEditable";

interface PCSheetProps {
  actor: InvestigatorActor;
  foundryApplication: ActorSheet;
}

export const PCSheetSimple: React.FC<PCSheetProps> = ({
  actor,
  foundryApplication,
}) => {
  assertGame(game);
  assertPCActor(actor);




  const [occupation, setOccupation] = useState<PersonalDetailItem | undefined>(
    actor.getOccupations()[0],
  );

  // some acrobatics here to make sure we update the occupation when it changes
  // there's no built in hook for "an actor's items changed"
  useEffect(() => {
    const callback = (affectedItem: AnyItem) => {
      if (affectedItem.isOwned && affectedItem.actor?.id === actor.id) {
        setOccupation(actor.getOccupations()[0]);
      }
    };
    Hooks.on("createItem", callback);
    Hooks.on("updateItem", callback);
    Hooks.on("deleteItem", callback);
    return () => {
      Hooks.off("createItem", callback);
      Hooks.off("updateItem", callback);
      Hooks.off("deleteItem", callback);
    };
  }, [actor]);

  const themeName = actor.getSheetThemeName();
  const theme = useTheme(themeName);

  return (  <CSSReset
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
    </div>
  </CSSReset>
  );
};

PCSheetSimple.displayName = "PCSheetSimple";
