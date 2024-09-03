import React, { useCallback, useEffect } from "react";

import { InvestigatorItem } from "../../module/InvestigatorItem";
import { settings } from "../../settings/settings";
import {
  ActorPayload,
  AnyActor,
  assertAbilityItem,
  assertActiveCharacterActor,
  isActiveCharacterActor,
  isInvestigativeAbilityItem,
} from "../../v10Types";
import { AsyncCheckbox } from "../inputs/AsyncCheckbox";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { GridField } from "../inputs/GridField";
import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { InputGrid } from "../inputs/InputGrid";
import { NotesEditorWithControls } from "../inputs/NotesEditorWithControls";
import { Toggle } from "../inputs/Toggle";
import { Translate } from "../Translate";
import { AbilityBadges } from "./AbilityBadges";
import { SpecialityList } from "./SpecialityList";

type AbilityMainBitsProps = {
  ability: InvestigatorItem;
};

export const AbilityMainBits: React.FC<AbilityMainBitsProps> = ({
  ability,
}) => {
  assertAbilityItem(ability);

  const onClickRefresh = useCallback(() => {
    void ability.refreshPool();
  }, [ability]);

  const useBoost = settings.useBoost.get();

  const isCombatAbility = settings.combatAbilities
    .get()
    .includes(ability.name ?? "");

  const [actorInitiativeAbility, setActorInitiativeAbility] = React.useState(
    isActiveCharacterActor(ability?.actor) &&
      ability?.actor?.system.initiativeAbility,
  );

  useEffect(() => {
    const callback = (
      actor: AnyActor,
      diff: ActorPayload,
      options: unknown,
      id: string,
    ) => {
      if (actor.id === ability?.actor?.id) {
        setActorInitiativeAbility(
          isActiveCharacterActor(ability?.actor) &&
            ability?.actor?.system.initiativeAbility,
        );
      }
    };
    Hooks.on("updateActor", callback);
    return () => {
      Hooks.off("updateActor", callback);
    };
  }, [ability?.actor]);

  const isAbilityUsed = actorInitiativeAbility === ability.name;
  const onClickUseForInitiative = useCallback(
    (e: React.MouseEvent) => {
      assertActiveCharacterActor(ability?.actor);
      void ability?.actor?.update({
        system: {
          initiativeAbility: ability.name,
        },
      });
    },
    [ability?.actor, ability.name],
  );

  const useMwStyleAbilities = settings.useMwStyleAbilities.get();

  const poolMax = useMwStyleAbilities
    ? undefined
    : ability.system.allowPoolToExceedRating
      ? ability.system.max
      : ability.system.rating - 1;

  const isQuickShock =
    isInvestigativeAbilityItem(ability) && ability.system.isQuickShock;

  const handleQuickShockToggle = useCallback(
    (checked: boolean) => {
      if (checked) {
        void ability.setRatingAndRefreshPool(1);
      } else {
        void ability.setRatingAndRefreshPool(0);
      }
    },
    [ability],
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
            checked={ability.system.rating > 0}
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
                min={0}
                max={poolMax}
                value={ability.system.pool}
                onChange={ability.setPool}
                css={{
                  flex: 1,
                }}
              />
              <button
                css={{
                  flexBasis: "min-content",
                  flex: 0,
                  lineHeight: "inherit",
                }}
                onClick={onClickRefresh}
              >
                <Translate>Refresh</Translate>
              </button>
            </div>
          </GridField>
          <GridField label="Rating">
            <AsyncNumberInput
              min={0}
              value={ability.system.rating}
              onChange={ability.setRating}
            />
          </GridField>
        </>
      )}
      <AbilityBadges
        css={{
          gridColumn: "1 / 4",
        }}
        ability={ability}
      />
      <NotesEditorWithControls
        source={ability.getNotes().source}
        format={ability.getNotes().format}
        html={ability.getNotes().html}
        // setSource={ability.setNotesSource}
        // setFormat={ability.setNotesFormat}
        allowChangeFormat
        onSave={ability.setNotes}
        css={{
          gridRow: "notes",
        }}
      />
      {ability.system.hasSpecialities && (
        <GridFieldStacked
          label={
            ability.getSpecialities().length === 1
              ? "Speciality"
              : "Specialities"
          }
        >
          <div
            css={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <SpecialityList ability={ability} />
          </div>
        </GridFieldStacked>
      )}
      {useBoost && (
        <GridField label="Boost?">
          <AsyncCheckbox
            checked={ability.system.boost}
            onChange={ability.setBoost}
          />
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
                <Translate values={{ AbilityName: ability?.name ?? "" }}>
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
