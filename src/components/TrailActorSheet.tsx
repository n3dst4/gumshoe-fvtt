/** @jsx jsx */
import React, { Fragment, useCallback } from "react";
import { TrailActor } from "../module/TrailActor";
import { PoolTracker } from "./abilities/PoolTracker";
import { jsx } from "@emotion/react";
import { useUpdate } from "../hooks/useUpdate";
import { AbilitiesArea } from "./abilities/AbilitiesArea";
import { CSSReset } from "./CSSReset";
import { TrailLogoEditable } from "./TrailLogoEditable";
import { InputGrid } from "./inputs/InputGrid";
import { GridField } from "./inputs/GridField";
import { AsyncTextInput } from "./inputs/AsyncTextInput";
import { generalAbility, investigativeAbility } from "../constants";
import { TrailItem } from "../module/TrailItem";
import { TabContainer } from "./TabContainer";
import { EquipmentArea } from "./equipment/EquipmentArea";
import { NotesArea } from "./NotesArea";
import { WeaponsArea } from "./equipment/WeaponsArea";

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
    const message = `Nuke all of ${entity.data.name}'s abilities and equipment?`;

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

  const onClickRefresh = useCallback(() => {
    const message = `Refresh all of ${entity.data.name}'s abilities? This will reset every pool back to match the rating of the ability.`;

    const d = new Dialog({
      title: "Confirm",
      content: `<p>${message}</p>`,
      buttons: {
        cancel: {
          icon: '<i class="fas fa-ban"></i>',
          label: "Cancel",
        },
        delete: {
          icon: '<i class="fas fa-sync"></i>',
          label: "Refresh",
          callback: async () => {
            entity.refresh();
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
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: "grid",
        gridTemplateRows: "min-content max-content 1fr",
        gridTemplateColumns: "12em 1fr 10em",
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
          {/* <GridFieldStacked label="Occupational Benefits">
            <AsyncTextInput
              value={entity.data.data.occupationalBenefits}
              onChange={updateOccupationalBenefits}
            />
          </GridFieldStacked>
          <GridFieldStacked label="Pillars of Sanity">
            <AsyncTextInput
              value={entity.data.data.pillarsOfSanity}
              onChange={updatePillarsOfSanity}
            />
          </GridFieldStacked> */}
        </InputGrid>
      </div>

      <div
        css={{
          gridArea: "pools",
          position: "relative",
          overflow: "auto",
        }}
        >

          <button onClick={onClickRefresh}>
            Refresh
          </button>
          <hr/>

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
          position: "relative",
          overflow: "hidden",
        }}
      >
        <TabContainer
          defaultTab="abilities"
          tabs={[
            {
              id: "abilities",
              label: "Abilities",
              content: (
                <AbilitiesArea
                  investigativeAbilities={investigativeAbilities}
                  generalAbilities={generalAbilities}
                />
              ),
            },
            {
              id: "equipment",
              label: "Equipment",
              content: (
                <Fragment>
                  <WeaponsArea actor={entity} />
                  <EquipmentArea actor={entity} />
                </Fragment>
              ),
            },
            {
              id: "notes",
              label: "Notes",
              content: (
                <NotesArea actor={entity} />
              ),
            },
          ]}
        />
      </div>
    </CSSReset>
  );
};
