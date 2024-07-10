import React, {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

import { occupationSlotIndex } from "../../constants";
import { assertGame } from "../../functions/utilities";
import { useTheme } from "../../hooks/useTheme";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { settings } from "../../settings/settings";
import {
  AnyItem,
  assertPCActor,
  isPCActor,
  PersonalDetailItem,
} from "../../v10Types";
// import CardsArea from "../cards/CardsArea";
import { CSSReset } from "../CSSReset";
import { ImagePickle } from "../ImagePickle";

import { LogoEditable } from "./LogoEditable";
import { InputGrid } from "../inputs/InputGrid";
import { GridField } from "../inputs/GridField";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { PersonalDetailField } from "./PersonalDetailField";
import { IndexedAsyncTextInput } from "../inputs/IndexedAsyncTextInput";
import { Translate } from "../Translate";
import { MwInjuryStatusWidget } from "./MoribundWorld/MwInjuryStatusWidget";
import { TrackersArea } from "./TrackersArea";
import { StatField } from "./StatField";
import { CombatAbilityDropDown } from "../inputs/CombatAbilityDropDown";
import { TabContainer } from "../TabContainer";
import { AbilitiesAreaMW } from "./MoribundWorld/AbilitiesAreaMW";
import { AbilitiesAreaPlay } from "./AbilitiesAreaPlay";
import { MwItemArea } from "./MoribundWorld/MwItemArea";
import { WeaponsArea } from "./Weapons/WeaponsArea";
import { EquipmentArea } from "./Equipment/EquipmentArea";
import { NotesArea } from "./NotesArea";
import { AbilitiesAreaEdit } from "./AbilitiesAreaEdit";
import { SettingArea } from "./SettingsArea";


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

  const updateShortNote = useCallback(
    async (value: string, index: number) => {
      await actor.setShortNote(index, value);
    },
    [actor],
  );

  const updateMwHiddenShortNote = useCallback(
    async (value: string, index: number) => {
      await actor.setMwHiddenShortNote(index, value);
    },
    [actor],
  );

  const genericOccupation = settings.genericOccupation.get();

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
  const personalDetails = settings.personalDetails.get();
  const shortHiddenNotesNames = settings.mwHiddenShortNotes.get();
  const occupationLabel = settings.occupationLabel.get();
  const stats = settings.pcStats.get();

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
