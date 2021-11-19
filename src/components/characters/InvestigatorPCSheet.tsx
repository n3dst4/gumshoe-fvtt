/** @jsx jsx */
import { Fragment, useCallback } from "react";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { jsx } from "@emotion/react";
import { AbilitiesAreaEdit } from "./AbilitiesAreaEdit";
import { AbilitiesAreaPlay } from "./AbilitiesAreaPlay";
import { CSSReset, CSSResetMode } from "../CSSReset";
import { LogoEditable } from "./LogoEditable";
import { InputGrid } from "../inputs/InputGrid";
import { GridField } from "../inputs/GridField";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { TabContainer } from "../TabContainer";
import { EquipmentArea } from "./EquipmentArea";
import { NotesArea } from "./NotesArea";
import { WeaponsArea } from "./WeaponsArea";
import { SettingArea } from "./SettingsArea";
import { ActorSheetAppContext } from "../FoundryAppContext";
import { TrackersArea } from "./TrackersArea";
import { getMwHiddenShortNotes, getUseMwStyleAbilities, getOccupationlabel, getShortNotes, getMwUseAlternativeItemTypes } from "../../settingsHelpers";
import { Translate } from "../Translate";
import { assertPCDataSource, isPCDataSource } from "../../types";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { ImagePickle } from "../ImagePickle";
import { assertGame } from "../../functions";
import { AbilitiesAreaMW } from "./AbilitiesAreaMW";
import { MwItemArea } from "./MwItemArea";

type InvestigatorPCSheetProps = {
  actor: InvestigatorActor,
  foundryApplication: ActorSheet,
}

export const InvestigatorPCSheet = ({
  actor,
  foundryApplication,
}: InvestigatorPCSheetProps) => {
  assertGame(game);
  assertPCDataSource(actor.data);

  const updateShortNote = useCallback((value, index) => {
    actor.setShortNote(index, value);
  }, [actor]);

  const updateMwHiddenShortNote = useCallback((value, index) => {
    actor.setMwHiddenShortNote(index, value);
  }, [actor]);

  const updateHitThreshold = useCallback((newThreshold) => {
    actor.setHitThreshold(newThreshold);
  }, [actor]);

  const theme = actor.getSheetTheme();
  const shortNotesNames = getShortNotes();
  const shortHiddenNotesNames = getMwHiddenShortNotes();
  const occupationLabel = getOccupationlabel();

  return (
    <ActorSheetAppContext.Provider value={foundryApplication}>
      <CSSReset
        theme={theme}
        mode={CSSResetMode.large}
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
            position: "relative",
          }}
        >
          <LogoEditable
            mainText={actor.data.name}
            subText={actor.data.data.occupation}
            defaultSubText="Investigator"
            onChangeMainText={actor.setName}
            onChangeSubText={actor.setOccupation}
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
          css={{
            gridArea: "stats",
            padding: "0.5em",
            backgroundColor: theme.colors.backgroundSecondary,
            position: "relative",
          }}
        >
          <InputGrid>
          <GridField label="Name">
              <AsyncTextInput
                value={actor.data.name}
                onChange={actor.setName}
              />
            </GridField>
            <GridField noTranslate label={occupationLabel}>
              <AsyncTextInput
                value={actor.data.data.occupation}
                onChange={actor.setOccupation}
              />
            </GridField>
            {
              shortNotesNames.map((name: string, i: number) => (
                <GridField noTranslate key={`${name}--${i}`} label={name}>
                  <AsyncTextInput
                    value={isPCDataSource(actor.data) ? actor.data.data.shortNotes[i] : ""}
                    onChange={updateShortNote}
                    index={i}
                  />
                </GridField>
              ))
            }
            {
              game.user?.isGM && shortHiddenNotesNames.map((name: string, i: number) => (
                <GridField noTranslate key={`${name}--${i}`} label={name}>
                  <AsyncTextInput
                    value={isPCDataSource(actor.data) ? actor.data.data.hiddenShortNotes[i] : ""}
                    onChange={updateMwHiddenShortNote}
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
            padding: "0.5em",
            background: theme.colors.backgroundPrimary,
          }}
          >
            {getUseMwStyleAbilities() &&
              <Fragment>
              <button onClick={actor.confirmMw2Refresh}>
                <Translate>2h Refresh</Translate>
              </button>
              <hr/>
              <button onClick={actor.confirmMw4Refresh}>
                <Translate>4h Refresh</Translate>
              </button>
              <hr/>
              <button onClick={actor.confirmMw8Refresh}>
                <Translate>8h Refresh</Translate>
              </button>
              <hr/>
              </Fragment>
            }
            <button onClick={actor.confirmRefresh}>
              <Translate>Full Refresh</Translate>
            </button>
            <hr/>
            {getUseMwStyleAbilities ||
              <Fragment>
                <button onClick={actor.confirm24hRefresh}>
                  <Translate>24h Refresh</Translate>
                </button>
                <hr/>
              </Fragment>
            }
            <TrackersArea actor={actor} />
            <hr/>
            <h3 css={{ gridColumn: "start / end" }}>
              <Translate>Hit Threshold</Translate>
            </h3>
            <AsyncNumberInput
              min={0}
              value={actor.data.data.hitThreshold}
              onChange={updateHitThreshold}
            />
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
                content: getUseMwStyleAbilities() ? <AbilitiesAreaMW actor={actor}/> : <AbilitiesAreaPlay actor={actor}/>,
              },
              getMwUseAlternativeItemTypes()
                ? {
                    id: "items",
                    label: "MWItems",
                    content: (
                      <MwItemArea actor={actor} />
                    ),
                  }
                : {
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
                id: "abilities-edit",
                label: "Edit",
                content: <AbilitiesAreaEdit actor={actor}/>,
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
