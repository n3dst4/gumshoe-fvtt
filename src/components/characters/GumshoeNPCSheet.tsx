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
import { AbilitiesArea } from "./AbilitiesArea";
import { EquipmentArea } from "./EquipmentArea";
import { WeaponsArea } from "./WeaponsArea";
import { SettingArea } from "./SettingsArea";
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
          gridTemplateRows: "min-content max-content 1fr",
          gridTemplateColumns: "10em 1fr 10em",
          gap: "0.5em",
          gridTemplateAreas:
            "\"title title image\" " +
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
            gridArea: "pools",
            position: "relative",
            overflowX: "visible",
            overflowY: "auto",
            padding: "1em",
            background: theme.colors.bgTransPrimary,
          }}
          >
            <h3 css={{ gridColumn: "start / end" }}>
              <Translate>Hit Threshold</Translate>
            </h3>
            <AsyncNumberInput
              min={0}
              value={actor.data.data.hitThreshold}
              onChange={updateHitThreshold}
            />
            <h3 css={{ gridColumn: "start / end" }}>
              <Translate>Armor</Translate>
            </h3>
            <AsyncNumberInput
              min={-10}
              value={actor.data.data.armor}
              onChange={updateArmor}
            />
            <h3 css={{ gridColumn: "start / end" }}>
              <Translate>Alertness Modifier</Translate>
            </h3>
            <AsyncNumberInput
              min={-10}
              value={actor.data.data.alertness}
              onChange={updateAlertness}
            />
            <h3 css={{ gridColumn: "start / end" }}>
              <Translate>Stealth Modifier</Translate>
            </h3>
            <AsyncNumberInput
              min={-10}
              value={actor.data.data.stealth}
              onChange={updateStealth}
            />
            <h3 css={{ gridColumn: "start / end" }}>
              <Translate>Stability Loss</Translate>
            </h3>
            <AsyncNumberInput
              min={-10}
              value={actor.data.data.stabilityLoss}
              onChange={updateStabilityLoss}
            />
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
                content: <AbilitiesArea
                  actor={actor}
                  flipLeftRight={true}
                />,
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
                  <Fragment>
                    <h2><Translate>Notes</Translate></h2>
                    <AsyncTextArea
                      onChange={updateNPCNotes}
                      value={actor.data.data.notes}
                    />
                  </Fragment>
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
