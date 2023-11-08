import React, { Fragment, ReactNode } from "react";

import { useTheme } from "../../hooks/useTheme";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { settings } from "../../settings/settings";
import { assertNPCActor, isNPCActor } from "../../v10Types";
import { absoluteCover } from "../absoluteCover";
import { CSSReset } from "../CSSReset";
import { ImagePickle } from "../ImagePickle";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { CombatAbilityDropDown } from "../inputs/CombatAbilityDropDown";
import { InputGrid } from "../inputs/InputGrid";
import { NotesEditorWithControls } from "../inputs/NotesEditorWithControls";
import { TabContainer } from "../TabContainer";
import { Translate } from "../Translate";
import { AbilitiesAreaEdit } from "./AbilitiesAreaEdit";
import { AbilitiesAreaPlay } from "./AbilitiesAreaPlay";
import { LogoEditable } from "./LogoEditable";
import { MwInjuryStatusWidget } from "./MoribundWorld/MwInjuryStatusWidget";
import { StatField } from "./StatField";
import { TrackersArea } from "./TrackersArea";
import { WeaponsArea } from "./Weapons/WeaponsArea";
import { WeaponsAreaEdit } from "./Weapons/WeaponsAreaEdit";

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
  const stats = settings.npcStats.get();

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
        justifyContent: "center",
        alignItems:"flex-start",
        alignContent:"flex-start",
        flexWrap: "wrap",
      }}
    >
   
        <LogoEditable
          mainText={actor.name ?? ""}
          onChangeMainText={actor.setName}
          css={{
            fontSize: "0.66em",            
            width:"100%",
          }}
        />
      
      <ImagePickle
        subject={actor}
        application={foundryApplication}
        css={{          
          transform: "rotateZ(2deg)",
          width:"200px",
          height:"200px",
        }}
      />
      <div
        css={{          
          width:"100%",
        }}
        dangerouslySetInnerHTML={{ __html: actor.getNotes().html }}
      />    
    </CSSReset>
  );
};

NPCSheetSimple.displayName = "NPCSheetSimple";
