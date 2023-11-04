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
import CardsArea from "../Cards/CardsArea";
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

export const PCSheet: React.FC<{
  actor: InvestigatorActor;
  foundryApplication: ActorSheet;
}> = ({ actor, foundryApplication }) => {
  assertGame(game);
  assertPCActor(actor);

  const updateShortNote = useCallback(
    (value: string, index: number) => {
      actor.setShortNote(index, value);
    },
    [actor],
  );

  const updateMwHiddenShortNote = useCallback(
    (value: string, index: number) => {
      actor.setMwHiddenShortNote(index, value);
    },
    [actor],
  );

  const genericOccupation = settings.genericOccupation.get();

  const [occupation, setOccupation] = useState<PersonalDetailItem | undefined>(
    actor.getOccupations()[0],
  );

  // some acrobatics here to make sure we update the occupation when it changes
  // there's no built in hook for "an actor's items changed"
  useEffect(() => {
    const callback = (affectedItem: AnyItem) => {
      if (affectedItem.isOwned && affectedItem.actor?.id === actor.id) {
        setOccupation(actor.getOccupations()[0]);
      }
    };
    Hooks.on("createItem", callback);
    Hooks.on("updateItem", callback);
    Hooks.on("deleteItem", callback);
    return () => {
      Hooks.off("createItem", callback);
      Hooks.off("updateItem", callback);
      Hooks.off("deleteItem", callback);
    };
  }, [actor]);

  const themeName = actor.getSheetThemeName();
  const theme = useTheme(themeName);
  const personalDetails = settings.personalDetails.get();
  const shortHiddenNotesNames = settings.mwHiddenShortNotes.get();
  const occupationLabel = settings.occupationLabel.get();
  const stats = settings.pcStats.get();

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
        gridTemplateRows: "min-content max-content 1fr",
        gridTemplateColumns: "10em 1fr 10em",
        gap: "0.5em",
        gridTemplateAreas:
          '"title title image" ' +
          '"pools stats image" ' +
          '"pools body  body" ',
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
          subText={occupation?.name ?? genericOccupation}
          defaultSubText={settings.genericOccupation.get()}
          onChangeMainText={actor.setName}
          onChangeSubText={occupation?.setName}
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
        className={theme.panelClass}
        css={{
          gridArea: "stats",
          padding: "0.5em",
          position: "relative",
          ...theme.panelStyleSecondary,
        }}
      >
        <InputGrid>
          <GridField label="Person Name">
            <AsyncTextInput value={actor.name ?? ""} onChange={actor.setName} />
          </GridField>
          <PersonalDetailField
            name={occupationLabel}
            actor={actor}
            slotIndex={occupationSlotIndex}
          />
          {personalDetails.map(({ name, type }, i) =>
            type === "text" ? (
              <GridField noTranslate key={`${name}--${i}`} label={name}>
                <IndexedAsyncTextInput
                  value={isPCActor(actor) ? actor.system.shortNotes[i] : ""}
                  onChange={updateShortNote}
                  index={i}
                />
              </GridField>
            ) : (
              <PersonalDetailField
                key={`${name}--${i}`}
                name={name}
                actor={actor}
                slotIndex={i}
              />
            ),
          )}
          {game.user?.isGM &&
            shortHiddenNotesNames.map((name: string, i: number) => (
              <GridField noTranslate key={`${name}--${i}`} label={name}>
                <IndexedAsyncTextInput
                  value={
                    isPCActor(actor) ? actor.system.hiddenShortNotes[i] : ""
                  }
                  onChange={updateMwHiddenShortNote}
                  index={i}
                />
              </GridField>
            ))}
        </InputGrid>
      </div>

      <div
        className={theme.panelClass}
        css={{
          gridArea: "pools",
          position: "relative",
          overflowX: "visible",
          overflowY: "auto",
          padding: "0.5em",
          ...theme.panelStylePrimary,
        }}
      >
        {settings.useMwStyleAbilities.get() && (
          <Fragment>
            <button onClick={actor.confirmMw2Refresh}>
              <Translate>2h Refresh</Translate>
            </button>
            <hr />
            <button onClick={actor.confirmMw4Refresh}>
              <Translate>4h Refresh</Translate>
            </button>
            <hr />
            <button onClick={actor.confirmMw8Refresh}>
              <Translate>8h Refresh</Translate>
            </button>
            <hr />
          </Fragment>
        )}
        <button onClick={actor.confirmRefresh}>
          <Translate>Full Refresh</Translate>
        </button>
        <hr />
        {settings.useMwStyleAbilities.get() || (
          <Fragment>
            <button onClick={actor.confirm24hRefresh}>
              <Translate>24h Refresh</Translate>
            </button>
            <hr />
          </Fragment>
        )}
        {settings.useMwInjuryStatus.get() && (
          <Fragment>
            <MwInjuryStatusWidget
              status={actor.getMwInjuryStatus()}
              setStatus={actor.setMwInjuryStatus}
            />
            <hr />
          </Fragment>
        )}
        <TrackersArea actor={actor} />
        <hr />
        {Object.keys(stats).map<ReactNode>((key) => {
          return (
            <StatField key={key} id={key} actor={actor} stat={stats[key]} />
          );
        })}
        <hr />
        <h3 css={{ gridColumn: "start / end" }}>
          <Translate>Combat Order</Translate>
        </h3>
        <CombatAbilityDropDown
          value={actor.getInitiativeAbility()}
          onChange={actor.setInitiativeAbility}
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
              content: settings.useMwStyleAbilities.get() ? (
                <AbilitiesAreaMW actor={actor} />
              ) : (
                <AbilitiesAreaPlay actor={actor} />
              ),
            },
            {
              id: "cards",
              label: "Cards",
              content: <CardsArea actor={actor} />,
            },
            settings.mwUseAlternativeItemTypes.get()
              ? {
                  id: "items",
                  label: "MWItems",
                  content: <MwItemArea actor={actor} />,
                }
              : {
                  id: "equipment",
                  label: "Equipment",
                  content: (
                    <Fragment>
                      <WeaponsArea actor={actor} />
                      <div css={{ height: "1em" }} />
                      <EquipmentArea actor={actor} />
                    </Fragment>
                  ),
                },
            {
              id: "notes",
              label: "Notes",
              content: <NotesArea actor={actor} />,
            },
            {
              id: "abilities-edit",
              label: "Edit",
              content: <AbilitiesAreaEdit actor={actor} />,
            },
            {
              id: "settings",
              label: <i className="fa fa-cog" />,
              content: <SettingArea actor={actor} />,
            },
          ]}
        />
      </div>
    </CSSReset>
  );
};

PCSheet.displayName = "PCSheet";
