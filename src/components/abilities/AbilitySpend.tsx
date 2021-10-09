/** @jsx jsx */
// import { jsx } from "@emotion/react";
// import React, { useCallback, useContext, useState } from "react";
// import * as constants from "../../constants";
// import { assertGame, getTranslated, isGeneralAbility } from "../../functions";
// import { GumshoeItem } from "../../module/GumshoeItem";
// import { ThemeContext } from "../../theme";
// import { assertAbilityDataSource } from "../../types";
// import { CheckButtons } from "../inputs/CheckButtons";
// import { GridField } from "../inputs/GridField";
// import { GridFieldStacked } from "../inputs/GridFieldStacked";
// import { InputGrid } from "../inputs/InputGrid";
// import { Translate } from "../Translate";

// export const abilityTest = useCallback(() => {
//     assertGame(game);
//     assertAbilityDataSource(ability.data);
//     if (ability.actor === null) { return; }
//     const useBoost = game.settings.get(constants.systemName, constants.useBoost);
//     const isBoosted = useBoost && ability.getBoost();
//     const boost = isBoosted ? 1 : 0;
//     const roll = useBoost
//       ? new Roll("1d6 + @spend + @boost", { spend, boost })
//       : new Roll("1d6 + @spend", { spend });
//     const label = getTranslated("RollingAbilityName", { AbilityName: ability.name ?? "" });
//     roll.roll().toMessage({
//       speaker: ChatMessage.getSpeaker({ actor: ability.actor }),
//       flavor: label,
//     });
//     ability.update({ data: { pool: ability.data.data.pool - Number(spend) || 0 } });
//     setSpend(0);
//   }, [ability, spend]);

// export const onSpend = useCallback(() => {
//     assertAbilityDataSource(ability.data);
//     if (ability.actor === null) { return; }
//     const roll = new Roll("@spend", { spend });
//     const label = getTranslated("AbilityPoolSpendForAbilityName", { AbilityName: ability.name ?? "" });
//     roll.roll().toMessage({
//       speaker: ChatMessage.getSpeaker({ actor: ability.actor }),
//       flavor: label,
//     });
//     ability.update({ data: { pool: ability.data.data.pool - Number(spend) || 0 } });
//     setSpend(0);
//   }, [ability, spend]);
