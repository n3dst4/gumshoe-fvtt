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

  return ( <CSSReset
    theme={theme}
    mode="large"
    css={{
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      display: "grid",
      gridTemplateRows: "min-content max-content 1fr",
      gridTemplateColumns: "10em 1fr 10em",
      gap: "0.5em",
      gridTemplateAreas:
        '"title title image" ' +
        '"pools stats image" ' +
        '"pools body  body" ',
    }}
  >
    <div
      css={{
        gridArea: "title",
        textAlign: "center",
        position: "relative",
      }}
    >
      <LogoEditable
        mainText={actor.name ?? ""}
        subText={occupation?.name ?? genericOccupation}
        defaultSubText={settings.genericOccupation.get()}
        onChangeMainText={actor.setName}
        onChangeSubText={occupation?.setName}
      />
    </div>
    <ImagePickle
      subject={actor}
      application={foundryApplication}
      css={{
        gridArea: "image",
        transform: "rotateZ(2deg)",
      }}
    />

    <div
      className={theme.panelClass}
      css={{
        gridArea: "stats",
        padding: "0.5em",
        position: "relative",
        ...theme.panelStyleSecondary,
      }}
    >
      <InputGrid>
      
        <PersonalDetailField
          name={occupationLabel}
          actor={actor}
          slotIndex={occupationSlotIndex}
        />
        
        {game.user?.isGM &&
          shortHiddenNotesNames.map((name: string, i: number) => (
            <GridField noTranslate key={`${name}--${i}`} label={name}>
              <IndexedAsyncTextInput
                value={
                  isPCActor(actor) ? actor.system.hiddenShortNotes[i] : ""
                }
                onChange={updateMwHiddenShortNote}
                index={i}
              />
            </GridField>
          ))}
      </InputGrid>
    </div>

    <div
      className={theme.panelClass}
      css={{
        gridArea: "pools",
        position: "relative",
        overflowX: "visible",
        overflowY: "auto",
        padding: "0.5em",
        ...theme.panelStylePrimary,
      }}
    >
     
      
 
    </div>

    <div
      css={{
        gridArea: "body",
        position: "relative",
        overflow: "hidden",
      }}
    >
      
    </div>
  </CSSReset>
  );
};

PCSheetSimple.displayName = "PCSheetSimple";
