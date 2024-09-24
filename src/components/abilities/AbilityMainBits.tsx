import React, { useCallback, useEffect } from "react";

import { useItemSheetContext } from "../../hooks/useSheetContexts";
import { settings } from "../../settings/settings";
import {
  ActorPayload,
  AnyActor,
  assertAbilityItem,
  assertActiveCharacterActor,
  isActiveCharacterActor,
  isInvestigativeAbilityItem,
} from "../../v10Types";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { Button } from "../inputs/Button";
import { GridField } from "../inputs/GridField";
import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { InputGrid } from "../inputs/InputGrid";
import { NotesEditorWithControls } from "../inputs/NotesEditorWithControls";
import { Toggle } from "../inputs/Toggle";
import { Translate } from "../Translate";
import { AbilityBadges } from "./AbilityBadges";
import { SpecialityList } from "./SpecialityList";

export const AbilityMainBits = () => {
  const { item } = useItemSheetContext();
  assertAbilityItem(item);

  const onClickRefresh = useCallback(() => {
    void item.refreshPool();
  }, [item]);

  const useBoost = settings.useBoost.get();

  const isCombatAbility = settings.combatAbilities
    .get()
    .includes(item.name ?? "");

  const [actorInitiativeAbility, setActorInitiativeAbility] = React.useState(
    isActiveCharacterActor(item?.actor) &&
      item?.actor?.system.initiativeAbility,
  );

  useEffect(() => {
    const callback = (
      actor: AnyActor,
      diff: ActorPayload,
      options: unknown,
      id: string,
    ) => {
      if (actor.id === item?.actor?.id) {
        setActorInitiativeAbility(
          isActiveCharacterActor(item?.actor) &&
            item?.actor?.system.initiativeAbility,
        );
      }
    };
    Hooks.on("updateActor", callback);
    return () => {
      Hooks.off("updateActor", callback);
    };
  }, [item?.actor]);

  const isAbilityUsed = actorInitiativeAbility === item.name;
  const onClickUseForInitiative = useCallback(
    (e: React.MouseEvent) => {
      assertActiveCharacterActor(item?.actor);
      void item?.actor?.update({
        system: {
          initiativeAbility: item.name,
        },
      });
    },
    [item?.actor, item.name],
  );

  const useMwStyleAbilities = settings.useMwStyleAbilities.get();

  const poolMax = useMwStyleAbilities
    ? undefined
    : item.system.allowPoolToExceedRating
      ? item.system.max
      : item.system.rating;

  const isQuickShock =
    isInvestigativeAbilityItem(item) && item.system.isQuickShock;

  const handleQuickShockToggle = useCallback(
    (checked: boolean) => {
      if (checked) {
        void item.setRatingAndRefreshPool(1);
      } else {
        void item.setRatingAndRefreshPool(0);
      }
    },
    [item],
  );

  return (
    <InputGrid
      css={{
        flex: 1,
        gridTemplateRows: "auto auto min-content [notes] 1fr",
      }}
    >
      {isQuickShock && (
        <GridField label="Enabled">
          <Toggle
            checked={item.system.rating > 0}
            onChange={handleQuickShockToggle}
          />
        </GridField>
      )}
      {!isQuickShock && (
        <>
          <GridField label="Pool">
            <div
              css={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <AsyncNumberInput
                min={item.system.min}
                max={poolMax}
                value={item.system.pool}
                onChange={item.setPool}
                css={{
                  flex: 1,
                }}
              />
              <Button
                css={{
                  flexBasis: "min-content",
                  flex: 0,
                  lineHeight: "inherit",
                }}
                onClick={onClickRefresh}
              >
                <Translate>Refresh</Translate>
              </Button>
            </div>
          </GridField>
          <GridField label="Rating">
            <AsyncNumberInput
              min={0}
              value={item.system.rating}
              onChange={item.setRating}
            />
          </GridField>
        </>
      )}
      <AbilityBadges
        css={{
          gridColumn: "1 / 4",
        }}
        ability={item}
      />
      <NotesEditorWithControls
        source={item.getNotes().source}
        format={item.getNotes().format}
        html={item.getNotes().html}
        // setSource={ability.setNotesSource}
        // setFormat={ability.setNotesFormat}
        allowChangeFormat
        onSave={item.setNotes}
        css={{
          gridRow: "notes",
        }}
      />
      {item.system.hasSpecialities && (
        <GridFieldStacked
          label={
            item.getSpecialities().length === 1 ? "Speciality" : "Specialities"
          }
        >
          <div
            css={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <SpecialityList ability={item} />
          </div>
        </GridFieldStacked>
      )}
      {useBoost && (
        <GridField label="Boost?">
          <Toggle checked={item.system.boost} onChange={item.setBoost} />
        </GridField>
      )}

      {isCombatAbility && (
        <GridField label="Combat order">
          {isAbilityUsed ? (
            <i>
              <Translate>
                This ability is currently being used for combat ordering
              </Translate>
            </i>
          ) : (
            <span>
              <a onClick={onClickUseForInitiative}>
                <Translate values={{ AbilityName: item?.name ?? "" }}>
                  Use (ability name) for combat ordering
                </Translate>
              </a>{" "}
              (
              {actorInitiativeAbility ? (
                <Translate values={{ AbilityName: actorInitiativeAbility }}>
                  Currently using (ability name)
                </Translate>
              ) : (
                <Translate>Currently using nothing</Translate>
              )}
              )
            </span>
          )}
        </GridField>
      )}
    </InputGrid>
  );
};

AbilityMainBits.displayName = "AbilityMainBits";
