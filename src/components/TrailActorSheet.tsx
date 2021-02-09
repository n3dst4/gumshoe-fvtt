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
import { TabContainer } from "./TabContainer";
import { EquipmentArea } from "./equipment/EquipmentArea";
import { NotesArea } from "./NotesArea";
import { WeaponsArea } from "./equipment/WeaponsArea";
import { SettingArea } from "./SettingsArea";

type TrailActorSheetProps = {
  actor: TrailActor,
  foundryWindow: Application,
}

export const TrailActorSheet = ({
  actor,
  foundryWindow,
}: TrailActorSheetProps) => {
  const onImageClick = useCallback(() => {
    console.log("onImageClick");
    const fp = new FilePicker({
      type: "image",
      current: actor.data.img,
      callback: (path) => {
        actor.update({
          img: path,
        });
      },
      top: foundryWindow.position.top + 40,
      left: foundryWindow.position.left + 10,
    });
    // types aren't quite right for fp
    return (fp as any).browse();
  }, [actor, foundryWindow.position.left, foundryWindow.position.top]);

  const updateName = useUpdate(actor, name => ({ name }));
  const updateDrive = useUpdate(actor, drive => ({ data: { drive } }));
  const updateOccupation = useUpdate(actor, occupation => ({ data: { occupation } }));

  const theme = actor.getTheme();

  return (
    <CSSReset
      theme={theme}
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
          "\"title title image\" " +
          "\"pools stats image\" " +
          "\"pools body  body\" ",
      }}
    >
      <div
        css={{
          gridArea: "title",
          textAlign: "center",
        }}
      >
        <TrailLogoEditable
          text={actor.data.name}
          subtext={actor.data.data.occupation}
          defaultSubtext="Investigator"
          onChangeText={updateName}
          onChangeSubtext={updateOccupation}
        />
      </div>
      <div
        css={{
          gridArea: "image",
          backgroundImage: `url("${actor.data.img}")`,
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
          backgroundColor: theme.colors.thin,
        }}
      >
        <InputGrid>
        <GridField label="Name">
            <AsyncTextInput
              value={actor.data.name}
              onChange={updateName}
            />
          </GridField>
          <GridField label="Occupation">
            <AsyncTextInput
              value={actor.data.data.occupation}
              onChange={updateOccupation}
            />
          </GridField>
          <GridField label="Drive">
            <AsyncTextInput
              value={actor.data.data.drive}
              onChange={updateDrive}
            />
          </GridField>
        </InputGrid>
      </div>

      <div
        css={{
          gridArea: "pools",
          position: "relative",
          overflowX: "visible",
          overflowY: "auto",
          padding: "1em",
          background: theme.colors.medium,
        }}
        >
          <button onClick={actor.confirmRefresh}>
            Refresh
          </button>
          <hr/>
          <PoolTracker abilityName="Sanity" actor={actor} />
          <PoolTracker abilityName="Stability" actor={actor} />
          <PoolTracker abilityName="Health" actor={actor} />
          <PoolTracker abilityName="Magic" actor={actor} />
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
              content: <AbilitiesArea actor={actor}/>,
            },
            {
              id: "equipment",
              label: "Equipment",
              content: (
                <Fragment>
                  <WeaponsArea actor={actor} />
                  <div css={{ height: "1em" }}/>
                  <EquipmentArea actor={actor} />
                </Fragment>
              ),
            },
            {
              id: "notes",
              label: "Notes",
              content: (
                <NotesArea actor={actor} />
              ),
            },
            {
              id: "settings",
              label: <i className="fa fa-cog" />,
              content: (
                <SettingArea actor={actor} />
              ),
            },
          ]}
        />
      </div>
    </CSSReset>
  );
};
