/** @jsx jsx */
import React, { useCallback } from "react";
import { TrailActor } from "../module/TrailActor";
import { PoolTracker } from "./PoolTracker";
import { jsx } from "@emotion/react";
// import { TrailLogo } from "./TrailLogo";
import { useUpdate } from "../hooks/useUpdate";
import { GeneralSkill, InvestigativeSkill } from "../types";
import { SkillsArea } from "./SkillsArea";
import { CSSReset } from "./CSSReset";
import { TrailLogoEditable } from "./TrailLogoEditable";
import { InputGrid } from "./InputGrid";
import { GridFormField } from "./GridFormField";
import { AsyncTextInput } from "./AsyncTextInput";
import { StackedFormField } from "./StackedFormField";

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
  }, [entity, foundryWindow.position.left, foundryWindow.position.top]);

  const updateName = useUpdate(entity, name => ({ name }));
  const updateDrive = useUpdate(entity, drive => ({ data: { drive } }));
  const updateOccupation = useUpdate(entity, occupation => ({ data: { occupation } }));
  const updateOccupationalBenefits = useUpdate(entity, occupationalBenefits => ({ data: { occupationalBenefits } }));

  const investigativeSkills: { [category: string]: InvestigativeSkill[] } = {};
  const generalSkills: GeneralSkill[] = [];

  for (const item of entity.items.values()) {
    if (item.type === "investigativeSkill") {
      const skill = item as InvestigativeSkill;
      const cat = skill.data.data.category || "Uncategorised";
      if (investigativeSkills[cat] === undefined) {
        investigativeSkills[cat] = [];
      }
      investigativeSkills[cat].push(skill);
    } else if (item.type === "generalSkill") {
      generalSkills.push(item);
    }
  }

  return (
    <CSSReset
      css={{
        display: "grid",
        // this ought to be min-content not 7em, but I'm struggling to get the
        // grid to do exactly what I want.
        gridTemplateRows: "min-content max-content 1fr",
        gridTemplateColumns: "max-content 1fr 12em",
        gridTemplateAreas:
          "\"title title image\" " +
          "\"pools stats image\" " +
          "\"pools body  body\" ",

      }}
    >

      <div
        css={{
          gridArea: "title",
          textAlign: "center",
          // backgroundColor: "rgba(255,255,255, 0.3)",
        }}
      >
        <TrailLogoEditable
          text={entity.data.name}
          subtext={entity.data.data.occupation}
          defaultSubtext="Investigator"
          onChangeText={updateName}
          onChangeSubtext={updateOccupation}
        />
      </div>
      <div
        css={{
          gridArea: "image",
          backgroundImage: `url(${entity.data.img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "0.2em",
          boxShadow: "0em 0em 0.5em 0.1em rgba(0,0,0,0.5)",
          transform: "rotateZ(2deg)",
        }}
        onClick={onImageClick}
      />

      <div
        css={{
          gridArea: "stats",
          padding: "1em",
        }}
      >
        <InputGrid>
        <GridFormField label="Name">
            <AsyncTextInput
              value={entity.data.name}
              onChange={updateName}
            />
          </GridFormField>
          <GridFormField label="Drive">
            <AsyncTextInput
              value={entity.data.data.drive}
              onChange={updateDrive}
            />
          </GridFormField>
          <GridFormField label="Occupation">
            <AsyncTextInput
              value={entity.data.data.occupation}
              onChange={updateOccupation}
            />
          </GridFormField>
          <StackedFormField label="Occupational Benefits">
            <AsyncTextInput
              value={entity.data.data.occupationalBenefits}
              onChange={updateOccupationalBenefits}
            />
          </StackedFormField>
        </InputGrid>
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

      <div
        css={{
          gridArea: "body",
        }}
      >
        <SkillsArea
          investigativeSkills={investigativeSkills}
          generalSkills={generalSkills}
        />
      </div>
    </CSSReset>
  );
};
