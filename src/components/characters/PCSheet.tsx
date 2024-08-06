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
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { CombatAbilityDropDown } from "../inputs/CombatAbilityDropDown";
import { GridField } from "../inputs/GridField";
import { IndexedAsyncTextInput } from "../inputs/IndexedAsyncTextInput";
import { InputGrid } from "../inputs/InputGrid";
import { TabContainer } from "../TabContainer";
import { Translate } from "../Translate";
import { AbilitiesAreaEdit } from "./AbilitiesAreaEdit";
import { AbilitiesAreaPlay } from "./AbilitiesAreaPlay";
import { EquipmentArea } from "./Equipment/EquipmentArea";
import { LogoEditable } from "./LogoEditable";
import { AbilitiesAreaMW } from "./MoribundWorld/AbilitiesAreaMW";
import { MwInjuryStatusWidget } from "./MoribundWorld/MwInjuryStatusWidget";
import { MwItemArea } from "./MoribundWorld/MwItemArea";
import { NotesArea } from "./NotesArea";
import { PersonalDetailField } from "./PersonalDetailField";
import { SettingArea } from "./SettingsArea";
import { StatField } from "./StatField";
import { TrackersArea } from "./TrackersArea";
import { WeaponsArea } from "./Weapons/WeaponsArea";
import { PCSheetFull } from "./PCSheetFull";
import { PCSheetSimple } from "./PCSheetSimple";
interface PCSheetProps {
  actor: InvestigatorActor;
  foundryApplication: ActorSheet;
}

export const PCSheet: React.FC<PCSheetProps> = ({
  actor,
  foundryApplication,
}) => {
  assertGame(game);
  assertPCActor(actor);

  const user = game.user;
  const myLevel = user ? actor.getUserLevel(user) ?? 0 : 0;
  // @ts-expect-error types still have DOCUMENT_PERMISSION_LEVELS
  if (myLevel === CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED) {
    return (
      <PCSheetSimple actor={actor} foundryApplication={foundryApplication} />
    );
  } else {
    return (
      <PCSheetFull actor={actor} foundryApplication={foundryApplication} />
    );
  }
};


PCSheet.displayName = "PCSheet";
