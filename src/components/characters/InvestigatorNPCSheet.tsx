/** @jsx jsx */
import { Fragment, useCallback } from "react";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { jsx } from "@emotion/react";
import { useUpdate } from "../../hooks/useUpdate";
import { CSSReset, CSSResetMode } from "../CSSReset";
import { AsyncTextArea } from "../inputs/AsyncTextArea";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { TabContainer } from "../TabContainer";
import { LogoEditable } from "./LogoEditable";
import { AbilitiesAreaEdit } from "./AbilitiesAreaEdit";
import { AbilitiesAreaPlay } from "./AbilitiesAreaPlay";
import { WeaponsArea } from "./WeaponsArea";
import { WeaponsAreaEdit } from "./WeaponsAreaEdit";
import { ActorSheetAppContext } from "../FoundryAppContext";
import { TrackersArea } from "./TrackersArea";
import { Translate } from "../Translate";
import { assertNPCDataSource } from "../../types";
import { ImagePickle } from "../ImagePickle";
import { InitDropDown } from "../abilities/InitDropDown";

type InvestigatorNPCSheetProps = {
  actor: InvestigatorActor,
  foundryApplication: ActorSheet,
}

export const InvestigatorNPCSheet = ({
  actor,
  foundryApplication,
}: InvestigatorNPCSheetProps) => {
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
        mode={CSSResetMode.large}
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
            mainText={actor.data.name}
            onChangeMainText={updateName}
            css={{
              fontSize: "0.66em",
            }}
          />
        </div>
        <div
          css={{
            gridArea: "notes",
            padding: "0.5em",
            backgroundColor: theme.colors.backgroundSecondary,
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
            background: theme.colors.backgroundPrimary,
          }}
        >
            <TrackersArea actor={actor} />
            <hr/>
            <h4 css={{ width: "8em" }}>
              <Translate>Combat Order</Translate>
            </h4>
            <InitDropDown actor={actor} />
        </div>

        <div
          css={{
            gridArea: "stats",
            position: "relative",
            background: theme.colors.backgroundPrimary,
            padding: "0.5em",
            display: "grid",
            gridTemplateColumns: "1fr max-content",
            gridAutoRows: "min-content",
            columnGap: "0.5em",
          }}
        >
          <button
            onClick={actor.confirmRefresh}
            css={{ gridColumn: "1 / span 2" }}
          >
            <Translate>Full Refresh</Translate>
          </button>
          <hr/>
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
            background: theme.colors.backgroundPrimary,
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
                  <Fragment>
                    <WeaponsAreaEdit actor={actor} />
                    <div css={{ height: "1em" }}/>
                    <AbilitiesAreaEdit
                      actor={actor}
                      flipLeftRight={true}
                      showOcc={false}
                    />
                  </Fragment>,
              },
            ]}
          />
        </div>
      </CSSReset>
    </ActorSheetAppContext.Provider>
  );
};
