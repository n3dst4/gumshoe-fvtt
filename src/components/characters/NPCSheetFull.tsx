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
import { NotesTypeContext } from "../NotesTypeContext";
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

type NPCSheetFullProps = {
  actor: InvestigatorActor;
  foundryApplication:
    | ActorSheet
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    | foundry.applications.api.DocumentSheetV2<InvestigatorActor>;
};

export const NPCSheetFull = ({
  actor,
  foundryApplication,
}: NPCSheetFullProps) => {
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
        display: "grid",
        gridTemplateRows: "min-content 1fr",
        gridTemplateColumns: "max-content 1fr 6em",
        gap: "0.5em",
        gridTemplateAreas: '"sidebar title image" ' + '"sidebar main main" ',
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
          onChangeMainText={actor.setName}
          css={{
            fontSize: "0.66em",
          }}
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

      {/* SIDEBAR */}
      <div
        className={theme.panelClass}
        css={{
          gridArea: "sidebar",
          position: "relative",
          padding: "0.5em",
          overflowX: "visible",
          overflowY: "auto",
          ...theme.panelStylePrimary,
        }}
      >
        <button onClick={actor.confirmRefresh} css={{ marginBottom: "0.5em" }}>
          <Translate>Full Refresh</Translate>
        </button>

        {settings.useMwInjuryStatus.get() && (
          <div css={{ marginBottom: "0.5em" }}>
            <MwInjuryStatusWidget
              status={actor.getMwInjuryStatus()}
              setStatus={actor.setMwInjuryStatus}
            />
          </div>
        )}

        {/* Stats */}
        <hr />
        {/* SotS NPC Combat bonus */}
        {settings.useNpcCombatBonuses.get() && isNPCActor(actor) && (
          <Fragment>
            <h3 css={{ gridColumn: "start / end" }}>
              <Translate>Combat bonus</Translate>
            </h3>
            <AsyncNumberInput
              value={actor.system.combatBonus}
              onChange={actor.setCombatBonus}
            />
            <h3 css={{ gridColumn: "start / end" }}>
              <Translate>Damage bonus</Translate>
            </h3>
            <AsyncNumberInput
              value={actor.system.damageBonus}
              onChange={actor.setDamageBonus}
            />
          </Fragment>
        )}
        {Object.keys(stats).map<ReactNode>((key) => {
          return (
            <StatField key={key} id={key} actor={actor} stat={stats[key]} />
          );
        })}

        <hr />
        <TrackersArea actor={actor} />
        <hr />
        <h4 css={{ width: "8em" }}>
          <Translate>Combat Order</Translate>
        </h4>
        <CombatAbilityDropDown
          value={actor.getInitiativeAbility()}
          onChange={actor.setInitiativeAbility}
        />
        {settings.useTurnPassingInitiative.get() && (
          <Fragment>
            <h4 css={{ width: "8em" }}>
              <Translate>Number of turns</Translate>
            </h4>
            <AsyncNumberInput
              value={actor.system.initiativePassingTurns}
              onChange={actor.setPassingTurns}
            />
          </Fragment>
        )}
      </div>

      {/* MAIN TABS AREA */}
      <div
        css={{
          gridArea: "main",
          position: "relative",
          padding: "0.5em",
          overflow: "auto",
        }}
      >
        <TabContainer
          defaultTab="play"
          tabs={[
            {
              id: "play",
              label: "Play",
              content: (
                <Fragment>
                  <WeaponsArea actor={actor} />
                  <div css={{ height: "1em" }} />
                  <AbilitiesAreaPlay actor={actor} flipLeftRight={true} />
                </Fragment>
              ),
            },
            {
              id: "edit",
              label: "Edit",
              content: (
                <Fragment>
                  <WeaponsAreaEdit actor={actor} />
                  <div css={{ height: "1em" }} />
                  <AbilitiesAreaEdit
                    actor={actor}
                    flipLeftRight={true}
                    showOcc={false}
                  />
                </Fragment>
              ),
            },
            {
              id: "notes",
              label: "Notes",
              content: (
                <InputGrid
                  css={{
                    ...absoluteCover,
                    gridTemplateRows: "1fr",
                    padding: "0.5em",
                  }}
                >
                  <NotesTypeContext.Provider value="npcNote">
                    <NotesEditorWithControls
                      allowChangeFormat
                      format={actor.system.notes.format}
                      html={actor.system.notes.html}
                      source={actor.system.notes.source}
                      onSave={actor.setNotes}
                      css={{
                        height: "100%",
                        "&&": {
                          resize: "none",
                        },
                      }}
                    />
                  </NotesTypeContext.Provider>
                </InputGrid>
              ),
            },
            {
              id: "gmNotes",
              label: "GM Notes",
              content: (
                <InputGrid
                  css={{
                    ...absoluteCover,
                    gridTemplateRows: "1fr",
                    padding: "0.5em",
                  }}
                >
                  <NotesTypeContext.Provider value="npcNote">
                    <NotesEditorWithControls
                      allowChangeFormat
                      format={actor.system.gmNotes.format}
                      html={actor.system.gmNotes.html}
                      source={actor.system.gmNotes.source}
                      onSave={actor.setGMNotes}
                      css={{
                        height: "100%",
                        "&&": {
                          resize: "none",
                        },
                      }}
                    />
                  </NotesTypeContext.Provider>
                </InputGrid>
              ),
            },
          ]}
        />
      </div>
    </CSSReset>
  );
};

NPCSheetFull.displayName = "NPCSheetFull";
