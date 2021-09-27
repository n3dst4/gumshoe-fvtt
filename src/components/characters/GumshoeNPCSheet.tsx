/** @jsx jsx */
import { Fragment, useCallback } from "react";
import { GumshoeActor } from "../../module/GumshoeActor";
import { jsx } from "@emotion/react";
import { useUpdate } from "../../hooks/useUpdate";
import { CSSReset } from "../CSSReset";
import { AsyncTextArea } from "../inputs/AsyncTextArea";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { LogoEditable } from "./LogoEditable";
import { AbilitiesArea } from "./AbilitiesArea";
import { WeaponsArea } from "./WeaponsArea";
import { ActorSheetAppContext } from "../FoundryAppContext";
import { TrackersArea } from "./TrackersArea";
import { Translate } from "../Translate";
import { assertNPCDataSource } from "../../types";

type GumshoeNPCSheetProps = {
  actor: GumshoeActor,
  foundryApplication: ActorSheet,
}

export const GumshoeNPCSheet = ({
  actor,
  foundryApplication,
}: GumshoeNPCSheetProps) => {
  assertNPCDataSource(actor.data);
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
          gridTemplateColumns: "10em 1fr 10em",
          gap: "0.5em",
          gridTemplateAreas:
            "\"title title image\" " +
            "\"notes notes image\" " +
            "\"stats stats stats\" " +
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
            overflow: "auto",
            display: "flex",
            flexDirection: "row",
            alignItems: "end",
            gap: "1em",
          }}
        >
          <Fragment>
            <h3><Translate>Hit Threshold</Translate></h3>
            <AsyncNumberInput
              min={0}
              value={actor.data.data.hitThreshold}
              onChange={updateHitThreshold}
              noPlusMinus={true}
              css={{
                width: "2em",
              }}
            />
          </Fragment>
          <Fragment>
            <h3><Translate>Armor</Translate></h3>
            <AsyncNumberInput
              min={-10}
              value={actor.data.data.armor}
              onChange={updateArmor}
              noPlusMinus={true}
              css={{
                width: "2em",
              }}
            />
            </Fragment>
            <Fragment>
              <h3><Translate>Alertness Modifier</Translate></h3>
            <AsyncNumberInput
              min={-10}
              value={actor.data.data.alertness}
              onChange={updateAlertness}
              noPlusMinus={true}
              css={{
                width: "2em",
              }}
            />
            </Fragment>
            <Fragment>
              <h3><Translate>Stealth Modifier</Translate></h3>
            <AsyncNumberInput
              min={-10}
              value={actor.data.data.stealth}
              onChange={updateStealth}
              noPlusMinus={true}
              css={{
                width: "2em",
              }}
            />
            </Fragment>
            <Fragment>
              <h3><Translate>Stability Loss</Translate></h3>
            <AsyncNumberInput
              min={-10}
              value={actor.data.data.stabilityLoss}
              onChange={updateStabilityLoss}
              noPlusMinus={true}
              css={{
                width: "2em",
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
          <Fragment>
            <AbilitiesArea
              actor={actor}
              flipLeftRight={true}
            />
            <div css={{ height: "1em" }}/>
            <WeaponsArea actor={actor} />
          </Fragment>
        </div>
      </CSSReset>
    </ActorSheetAppContext.Provider>
  );
};
