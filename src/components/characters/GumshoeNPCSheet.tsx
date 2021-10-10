/** @jsx jsx */
import { Fragment, useCallback } from "react";
import { GumshoeActor } from "../../module/GumshoeActor";
import { jsx } from "@emotion/react";
import { useUpdate } from "../../hooks/useUpdate";
import { CSSReset } from "../CSSReset";
import { AsyncTextArea } from "../inputs/AsyncTextArea";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { TabContainer } from "../TabContainer";
import { LogoEditable } from "./LogoEditable";
import { AbilitiesAreaEdit } from "./AbilitiesAreaEdit";
import { AbilitiesAreaPlay } from "./AbilitiesAreaPlay";
import { WeaponsArea } from "./WeaponsArea";
import { ActorSheetAppContext } from "../FoundryAppContext";
import { TrackersArea } from "./TrackersArea";
import { Translate } from "../Translate";
import { assertNPCDataSource } from "../../types";
import { ImagePickle } from "../ImagePickle";

type GumshoeNPCSheetProps = {
  actor: GumshoeActor,
  foundryApplication: ActorSheet,
}

export const GumshoeNPCSheet = ({
  actor,
  foundryApplication,
}: GumshoeNPCSheetProps) => {
  assertNPCDataSource(actor.data);
  const updateName = useUpdate(actor, name => ({ name }));

  const updateHitThreshold = useCallback((newThreshold) => {
    return actor.update({ data: { hitThreshold: newThreshold } });
  }, [actor]);

  const updateArmor = useCallback((newArmor) => {
    return actor.update({ data: { armor: newArmor } });
  }, [actor]);

  const updateAlertness = useCallback((newAlertness) => {
    return actor.update({ data: { alertness: newAlertness } });
  }, [actor]);

  const updateStealth = useCallback((newStealth) => {
    return actor.update({ data: { stealth: newStealth } });
  }, [actor]);

  const updateStabilityLoss = useCallback((newStabilityLoss) => {
    return actor.update({ data: { stabilityLoss: newStabilityLoss } });
  }, [actor]);

  const updateNPCNotes = useCallback((newNotes) => {
    return actor.update({ data: { notes: newNotes } });
  }, [actor]);

  const theme = actor.getSheetTheme();

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
          gridTemplateRows: "min-content max-content min-content 1fr",
          gridTemplateColumns: "max-content 1fr 10em",
          gap: "0.5em",
          gridTemplateAreas:
            "\"title title image\" " +
            "\"notes notes image\" " +
            "\"stats body body\" " +
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
            text={actor.data.name}
            onChangeText={updateName}
            css={{
              fontSize: "0.66em",
            }}
          />
        </div>
        <div
          css={{
            gridArea: "notes",
            padding: "0.5em",
            backgroundColor: theme.colors.bgTransSecondary,
            position: "relative",
          }}
        >
          <Fragment>
            <h3><Translate>Description</Translate></h3>
            <AsyncTextArea
              onChange={updateNPCNotes}
              value={actor.data.data.notes}
            />
          </Fragment>
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
            gridArea: "pools",
            position: "relative",
            overflowX: "visible",
            overflowY: "auto",
            padding: "1em",
            background: theme.colors.bgTransPrimary,
          }}
        >
            <TrackersArea actor={actor} />
        </div>

        <div
          css={{
            gridArea: "stats",
            position: "relative",
            background: theme.colors.bgTransPrimary,
            padding: "0.5em",
            display: "grid",
            gridTemplateColumns: "1fr max-content",
            gridAutoRows: "min-content",
            columnGap: "0.5em",
          }}
        >
          <Fragment>
            <h3 css={{ gridColumn: "1" }}><Translate>Hit Threshold</Translate></h3>
            <AsyncNumberInput
              min={0}
              value={actor.data.data.hitThreshold}
              onChange={updateHitThreshold}
              noPlusMinus={true}
              css={{
                width: "2em",
                gridColumn: "2",
              }}
            />
          </Fragment>
          <Fragment>
            <h3 css={{ gridColumn: "1" }}><Translate>Armor</Translate></h3>
            <AsyncNumberInput
              min={-10}
              value={actor.data.data.armor}
              onChange={updateArmor}
              noPlusMinus={true}
              css={{
                width: "2em",
                gridColumn: "2",
              }}
            />
          </Fragment>
          <Fragment>
            <h3 css={{ gridColumn: "1" }}><Translate>Alertness Modifier</Translate></h3>
            <AsyncNumberInput
              min={-10}
              value={actor.data.data.alertness}
              onChange={updateAlertness}
              noPlusMinus={true}
              css={{
                width: "2em",
                gridColumn: "2",
              }}
            />
          </Fragment>
          <Fragment>
            <h3 css={{ gridColumn: "1" }}><Translate>Stealth Modifier</Translate></h3>
            <AsyncNumberInput
              min={-10}
              value={actor.data.data.stealth}
              onChange={updateStealth}
              noPlusMinus={true}
              css={{
                width: "2em",
                gridColumn: "2",
              }}
            />
          </Fragment>
          <Fragment>
            <h3 css={{ gridColumn: "1" }}><Translate>Stability Loss</Translate></h3>
            <AsyncNumberInput
              min={-10}
              value={actor.data.data.stabilityLoss}
              onChange={updateStabilityLoss}
              noPlusMinus={true}
              css={{
                width: "2em",
                gridColumn: "2",
              }}
            />
          </Fragment>
        </div>

        <div
          css={{
            gridArea: "body",
            position: "relative",
            background: theme.colors.bgTransPrimary,
            padding: "0.5em",
            overflow: "auto",
          }}
        >
          <TabContainer
            defaultTab="abilities"
            tabs={[
              {
                id: "abilities",
                label: "Abilities",
                content:
                  <Fragment>
                    <WeaponsArea actor={actor} />
                    <div css={{ height: "1em" }}/>
                    <AbilitiesAreaPlay
                      actor={actor}
                      flipLeftRight={true}
                    />
                  </Fragment>,
              },
              {
                id: "edit",
                label: "Edit",
                content:
                  <AbilitiesAreaEdit
                    actor={actor}
                    flipLeftRight={true}
                    showOcc={false}
                  />,
              },
            ]}
          />
        </div>
      </CSSReset>
    </ActorSheetAppContext.Provider>
  );
};
