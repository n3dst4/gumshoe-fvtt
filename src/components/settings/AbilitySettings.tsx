import React, { useContext } from "react";
import { assertGame } from "../../functions";
import { SettingsDict } from "../../settings";
import { InputGrid } from "../inputs/InputGrid";
import { Setters } from "./types";
import { SettingsGridField } from "./SettingsGridField";
import { IdContext } from "../IdContext";
import { ListEdit } from "../inputs/ListEdit";
import { Checkbox } from "../inputs/Checkbox";
import { Translate } from "../Translate";
import { nanoid } from "nanoid";
import { ThemeContext } from "../../themes/ThemeContext";

export const AbilitySettings: React.FC<{
  tempSettings: SettingsDict,
  setters: Setters,
}> = ({ tempSettings, setters }) => {
  assertGame(game);

  let idx = 0;

  const theme = useContext(ThemeContext);

  return (
    <InputGrid
      css={{
        flex: 1,
        overflow: "auto",
      }}
    >
      <SettingsGridField
        label="Compendium packs for new characters"
        index={idx++}
        noLabel
      >
        <div
          css={{
            display: "grid",
            gridTemplateColumns: "max-content 1fr max-content",
            gridAutoRows: "min-content",
            columnGap: "0.5em",
            whiteSpace: "nowrap",
            ".header": {
              fontWeight: "bold",
            },
          }}
        >
          <div css={{ gridColumn: 1, gridRow: 1 }}>
            <label>
              {" "}
              <Translate>PCs</Translate>{" "}
            </label>
          </div>
          <div css={{ gridColumn: 3, gridRow: 1 }}>
            <label>
              {" "}
              <Translate>NPCs</Translate>{" "}
            </label>
          </div>
          {game.packs
            .filter(
              (pack: CompendiumCollection<CompendiumCollection.Metadata>) => {
                // v0.8/v9 compatibility hack - in v9 pack.metadata.entity is
                // getter which warns you about deprecation and then returns
                // pack.metadata.type BUT it's throwing "this.metadata is
                // undefined" for me, hence this touchy-feeling approach
                try {
                  const documentType =
                    (pack.metadata as any).type ?? pack.metadata.entity;
                  return documentType === "Item";
                } catch (e) {
                  return false;
                }
              },
            )
            .map<JSX.Element>(
              (
                pack: CompendiumCollection<CompendiumCollection.Metadata>,
                i,
              ) => {
                const pcSelected = tempSettings.newPCPacks.includes(
                  pack.collection,
                );
                const npcSelected = tempSettings.newNPCPacks.includes(
                  pack.collection,
                );
                const id = nanoid();
                const gridRow = i + 2;
                return (
                  <IdContext.Provider value={id} key={pack.metadata.name}>
                    {gridRow % 2 === 0 && (
                      <div
                        css={{
                          gridRow,
                          gridColumn: "1/4",
                          background: theme.colors.backgroundButton,
                        }}
                      />
                    )}
                    <Checkbox
                      checked={pcSelected}
                      css={{
                        gridColumn: 1,
                        gridRow,
                      }}
                      onChange={(checked) => {
                        if (checked) {
                          setters.newPCPacks([
                            ...tempSettings.newPCPacks,
                            pack.collection,
                          ]);
                        } else {
                          setters.newPCPacks(
                            tempSettings.newPCPacks.filter(
                              (x) => x !== pack.collection,
                            ),
                          );
                        }
                      }}
                    />
                    <Checkbox
                      css={{
                        gridColumn: 3,
                        gridRow,
                        top: 0,
                      }}
                      checked={npcSelected}
                      onChange={(checked) => {
                        if (checked) {
                          setters.newNPCPacks([
                            ...tempSettings.newNPCPacks,
                            pack.collection,
                          ]);
                        } else {
                          setters.newNPCPacks(
                            tempSettings.newNPCPacks.filter(
                              (x) => x !== pack.collection,
                            ),
                          );
                        }
                      }}
                    />
                    <label
                      className="parp"
                      key={pack.collection}
                      title={pack.collection}
                      htmlFor={id}
                      css={{
                        display: "block",
                        paddingTop: "0.3em",
                        gridColumn: 2,
                        gridRow,
                        textAlign: "center",
                      }}
                    >
                      {pack.metadata.label}
                    </label>
                  </IdContext.Provider>
                );
              },
            )}
        </div>
      </SettingsGridField>
      <SettingsGridField label="Investigative Ability Categories" index={idx++}>
        <ListEdit
          value={tempSettings.investigativeAbilityCategories}
          onChange={setters.investigativeAbilityCategories}
          nonempty
        />
      </SettingsGridField>
      <SettingsGridField label="General Ability Categories" index={idx++}>
        <ListEdit
          value={tempSettings.generalAbilityCategories}
          onChange={setters.generalAbilityCategories}
          nonempty
        />
      </SettingsGridField>
      <SettingsGridField label="Combat Abilities" index={idx++}>
        <ListEdit
          value={tempSettings.combatAbilities}
          onChange={setters.combatAbilities}
          nonempty
        />
      </SettingsGridField>
      <SettingsGridField label="Can Abilities be Boosted?" index={idx++}>
        <Checkbox checked={tempSettings.useBoost} onChange={setters.useBoost} />
      </SettingsGridField>
      <SettingsGridField
        label="Show empty Investigative categories?"
        index={idx++}
      >
        <Checkbox
          checked={tempSettings.showEmptyInvestigativeCategories}
          onChange={setters.showEmptyInvestigativeCategories}
        />
      </SettingsGridField>
      <SettingsGridField label="Use NPC Combat bonuses?" index={idx++}>
        <Checkbox
          checked={tempSettings.useNpcCombatBonuses}
          onChange={setters.useNpcCombatBonuses}
        />
      </SettingsGridField>

    </InputGrid>
  );
};

AbilitySettings.displayName = "CoreSettings";
