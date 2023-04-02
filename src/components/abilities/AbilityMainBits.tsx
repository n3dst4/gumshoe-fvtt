import React, { useCallback, useEffect } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { SpecialityList } from "./SpecialityList";
import { Translate } from "../Translate";
import { ActiveCharacterDataSource } from "../../types";
import {
  assertAbilityDataSource,
  assertActiveCharacterDataSource,
  isActiveCharacterDataSource,
} from "../../typeAssertions";
import { AsyncCheckbox } from "../inputs/AsyncCheckbox";
import { NotesEditorWithControls } from "../inputs/NotesEditorWithControls";
import { settings } from "../../settings";
import { AbilityBadges } from "./AbilityBadges";

type AbilityMainBitsProps = {
  ability: InvestigatorItem;
};

export const AbilityMainBits: React.FC<AbilityMainBitsProps> = ({
  ability,
}) => {
  assertAbilityItem(ability);

  const onClickRefresh = useCallback(() => {
    ability.refreshPool();
  }, [ability]);

  const useBoost = settings.useBoost.get();

  const isCombatAbility = settings.combatAbilities
    .get()
    .includes(ability.data.name);

  const [actorInitiativeAbility, setActorInitiativeAbility] = React.useState(
    isActiveCharacterDataSource(ability?.actor?.data) &&
      ability?.actor?.system.initiativeAbility,
  );

  useEffect(() => {
    const callback = (
      actor: Actor,
      diff: { _id: string; data: DeepPartial<ActiveCharacterDataSource> },
      options: unknown,
      id: string,
    ) => {
      if (actor.data._id === ability?.actor?.data?._id) {
        setActorInitiativeAbility(
          isActiveCharacterDataSource(ability?.actor?.data) &&
            ability?.actor?.system.initiativeAbility,
        );
      }
    };
    Hooks.on("updateActor", callback);
    return () => {
      Hooks.off("updateActor", callback);
    };
  }, [ability?.actor?.data]);

  const isAbilityUsed = actorInitiativeAbility === ability.name;
  const onClickUseForInitiative = useCallback(
    (e: React.MouseEvent) => {
      assertActiveCharacterDataSource(ability?.actor?.data);
      ability?.actor?.update({
        data: {
          initiativeAbility: ability.data.name,
        },
      });
    },
    [ability?.actor, ability.data.name],
  );

  const useMwStyleAbilities = settings.useMwStyleAbilities.get();

  return (
    <InputGrid
      css={{
        flex: 1,
        gridTemplateRows: "auto auto min-content 1fr",
      }}
    >
      <GridField label="Pool">
        <div
          css={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <AsyncNumberInput
            min={0}
            max={useMwStyleAbilities ? undefined : ability.system.rating}
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
          height: "100%",
          "&&": {
            resize: "none",
          },
        }}
      />
      {ability.getHasSpecialities() && (
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
            checked={ability.getBoost()}
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
