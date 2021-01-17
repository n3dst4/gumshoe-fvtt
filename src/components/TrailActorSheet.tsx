/** @jsx jsx */
import React, { useCallback } from "react";
import { TrailActor } from "../module/TrailActor";
import { PoolTracker } from "./PoolTracker";
import { jsx } from "@emotion/react";
import { TrailLogo } from "./TrailLogo";
import { FormField } from "./FormField";
import { useUpdate } from "../hooks/useUpdate";
import { GeneralSkill, InvestigativeSkill } from "../types";
import { SkillsArea } from "./SkillsArea";
import { CSSReset } from "./CSSReset";

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
      if (investigativeSkills[skill.data.data.category] === undefined) {
        investigativeSkills[skill.data.data.category] = [];
      }
      investigativeSkills[skill.data.data.category].push(skill);
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
        gridTemplateRows: "7em max-content 1fr",
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
            width: "100%",
          }}
          src={entity.data.img}
          onClick={onImageClick}
        />
      </div>

      <div
        css={{
          gridArea: "stats",
          padding: "1em",
        }}
      >
        <FormField
          label="Investigator name"
          value={entity.data.name}
          onChange={updateName}
          css={{ fontSize: "1.2em" }}
        />
        <FormField
          label="Drive"
          value={entity.data.data.drive}
          onChange={updateDrive}
        />
        <FormField
          label="Occupation"
          value={entity.data.data.occupation}
          onChange={updateOccupation}
        />
        <FormField
          label="Occupational Benefits"
          value={entity.data.data.occupationalBenefits}
          onChange={updateOccupationalBenefits}
        />
        {/* <input defaultValue="Parparella Q. Blotkins III (jr.)"/> */}
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
