/** @jsx jsx */
import React, { useCallback } from "react";
import { TrailActor } from "../module/TrailActor";
import { PoolTracker } from "./PoolTracker";
import { jsx } from "@emotion/react";
// import { TrailLogo } from "./TrailLogo";
import { useUpdate } from "../hooks/useUpdate";
// import { GeneralAbility, InvestigativeAbility } from "../types";
import { AbilitiesArea } from "./abilities/AbilitiesArea";
import { CSSReset } from "./CSSReset";
import { TrailLogoEditable } from "./TrailLogoEditable";
import { InputGrid } from "./inputs/InputGrid";
import { GridField } from "./inputs/GridField";
import { AsyncTextInput } from "./inputs/AsyncTextInput";
import { GridFieldStacked } from "./inputs/GridFieldStacked";
import { generalAbility, investigativeAbility } from "../constants";
import { TrailItem } from "../module/TrailItem";

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

  const investigativeAbilities: { [category: string]: TrailItem[] } = {};
  const generalAbilities: TrailItem[] = [];

  for (const item of entity.items.values()) {
    if (item.type === investigativeAbility) {
      const ability = item as TrailItem;
      const cat = ability.data.data.category || "Uncategorised";
      if (investigativeAbilities[cat] === undefined) {
        investigativeAbilities[cat] = [];
      }
      investigativeAbilities[cat].push(ability);
    } else if (item.type === generalAbility) {
      generalAbilities.push(item as TrailItem);
    }
  }

  const onClickNuke = useCallback(() => {
    const message = `Nuke all of ${entity.data.name}'s abilities and equipemt?`;

    const d = new Dialog({
      title: "Confirm",
      content: `<p>${message}</p>`,
      buttons: {
        cancel: {
          icon: '<i class="fas fa-ban"></i>',
          label: "Whoops no!",
        },
        delete: {
          icon: '<i class="fas fa-radiation"></i>',
          label: "Nuke it from orbit",
          callback: async () => {
            await entity.deleteEmbeddedEntity(
              "OwnedItem",
              entity.items.map(i => i.id),
            );
            window.alert("Nuked");
          },
        },
      },
      default: "two",
      // render: html => console.log("Register interactivity in the rendered dialog"),
      // close: html => console.log("This always is logged no matter which option is chosen"),
    });
    d.render(true);
  }, [entity]);

  return (
    <CSSReset
      css={{
        display: "grid",
        gridTemplateRows: "min-content max-content 1fr",
        gridTemplateColumns: "max-content 1fr 12em",
        gap: "0.5em",
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
        <GridField label="Name">
            <AsyncTextInput
              value={entity.data.name}
              onChange={updateName}
            />
          </GridField>
          <GridField label="Drive">
            <AsyncTextInput
              value={entity.data.data.drive}
              onChange={updateDrive}
            />
          </GridField>
          <GridField label="Occupation">
            <AsyncTextInput
              value={entity.data.data.occupation}
              onChange={updateOccupation}
            />
          </GridField>
          <GridFieldStacked label="Occupational Benefits">
            <AsyncTextInput
              value={entity.data.data.occupationalBenefits}
              onChange={updateOccupationalBenefits}
            />
          </GridFieldStacked>
        </InputGrid>
      </div>

      <div
        css={{
          gridArea: "pools",
        }}
      >
        <PoolTracker abilityName="Sanity" actor={entity} />
        <PoolTracker abilityName="Stability" actor={entity} />
        <PoolTracker abilityName="Health" actor={entity} />
        <PoolTracker abilityName="Magic" actor={entity} />
        <hr/>
        <button onClick={onClickNuke}>
          Nuke
        </button>
      </div>

      <div
        css={{
          gridArea: "body",
        }}
      >
        <AbilitiesArea
          investigativeAbilities={investigativeAbilities}
          generalAbilities={generalAbilities}
        />
      </div>
    </CSSReset>
  );
};
