/** @jsx jsx */
import React, { Fragment, useCallback, useMemo } from "react";
import { TrailActor } from "../../module/TrailActor";
import { jsx } from "@emotion/react";
import { useUpdate } from "../../hooks/useUpdate";
import { AbilitiesArea } from "./AbilitiesArea";
import { CSSReset } from "../CSSReset";
import { TrailLogoEditable } from "./TrailLogoEditable";
import { InputGrid } from "../inputs/InputGrid";
import { GridField } from "../inputs/GridField";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { TabContainer } from "../TabContainer";
import { EquipmentArea } from "./EquipmentArea";
import { NotesArea } from "./NotesArea";
import { WeaponsArea } from "./WeaponsArea";
import { SettingArea } from "./SettingsArea";
import { ActorSheetAppContext } from "../FoundryAppContext";
import system from "../../system.json";
import { shortNotes } from "../../constants";
import { crappySplit } from "../../functions";
import { TrackersArea } from "./TrackersArea";

type TrailActorSheetProps = {
  actor: TrailActor,
  foundryApplication: ActorSheet,
}

export const TrailActorSheet = ({
  actor,
  foundryApplication,
}: TrailActorSheetProps) => {
  const onImageClick = useCallback(() => {
    console.log("onImageClick");
    const fp = new FilePicker({
      type: "image",
      current: actor.data.img,
      callback: (path: string) => {
        actor.update({
          img: path,
        });
      },
      top: (foundryApplication.position.top ?? 0) + 40,
      left: (foundryApplication.position.left ?? 0) + 10,
    });
    // types aren't quite right for fp
    return (fp as any).browse();
  }, [actor, foundryApplication.position.left, foundryApplication.position.top]);

  const updateName = useUpdate(actor, name => ({ name }));
  const updateOccupation = useUpdate(actor, occupation => ({ data: { occupation } }));

  const updateShortNote = useCallback((value, index) => {
    const newNotes = [...actor.data.data.shortNotes || []];
    newNotes[index] = value;
    actor.update({
      data: {
        shortNotes: newNotes,
      },
    });
  }, [actor]);

  const theme = actor.getSheetTheme();

  const shortNotesAsString = game.settings.get(system.name, shortNotes);
  const shortNotesNames = useMemo(() => {
    return crappySplit(shortNotesAsString);
  }, [shortNotesAsString]);

  return (
    <ActorSheetAppContext.Provider value={foundryApplication}>
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
            {
              shortNotesNames.map((name: string, i: number) => (
                <GridField key={`${name}--${i}`} label={name}>
                  <AsyncTextInput
                    value={actor.data.data.shortNotes[i]}
                    onChange={updateShortNote}
                    index={i}
                  />
                </GridField>
              ))
            }
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
            <TrackersArea actor={actor} />
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
    </ActorSheetAppContext.Provider>
  );
};
