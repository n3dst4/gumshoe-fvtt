import { InvestigatorItem } from "../../module/InvestigatorItem";
import * as constants from "../../constants";
import { assertGame } from "../../functions";
import { settings } from "../../settings";
import {
  isGeneralAbilityDataSource,
  isNPCDataSource,
} from "../../typeAssertions";

type PerformAttackArgs1 = {
  spend: number;
  bonusPool: number;
  setSpend: (value: number) => void;
  setBonusPool: (value: number) => void;
  weapon: InvestigatorItem;
  ability: InvestigatorItem | undefined;
};

type PerformAttackArgs2 = {
  rangeName: string;
  rangeDamage: number;
};

export const performAttack =
  ({
    spend,
    ability,
    weapon,
    bonusPool,
    setSpend,
    setBonusPool,
  }: PerformAttackArgs1) =>
  async ({ rangeName, rangeDamage }: PerformAttackArgs2) => {
    assertGame(game);
    if (weapon.actor === null) {
      return;
    }
    const damage = weapon.getDamage();

    const useBoost = settings.useBoost.get();
    const isBoosted = useBoost && ability !== undefined && ability.getBoost();
    const boost = isBoosted ? 1 : 0;

    let hitTerm = "1d6 + @spend";
    const hitParams: { [name: string]: number } = { spend };
    if (isBoosted) {
      hitTerm += " + @boost";
      hitParams.boost = boost;
    }

    const useNpcBonuses =
      settings.useNpcCombatBonuses.get() &&
      ability?.isOwned &&
      ability.parent &&
      isNPCDataSource(ability.parent.data) &&
      isGeneralAbilityDataSource(ability.data);

    if (useNpcBonuses) {
      hitTerm += " + @npcCombatBonus";
      hitParams.npcCombatBonus = ability.parent.data.data.combatBonus;
      hitTerm += " + @abilityCombatBonus";
      hitParams.abilityCombatBonus = ability.data.data.combatBonus;
    }
    const hitRoll = new Roll(hitTerm, hitParams);

    await hitRoll.evaluate({ async: true });
    hitRoll.dice[0].options.rollOrder = 1;

    let damageTerm = "1d6 + @damage + @rangeDamage";
    const damageParams: { [name: string]: number } = { damage, rangeDamage };
    if (useNpcBonuses) {
      damageTerm += " + @npcDamageBonus";
      damageParams.npcDamageBonus = ability.parent.data.data.damageBonus;
      damageTerm += " + @abilityDamageBonus";
      damageParams.abilityDamageBonus = ability.data.data.damageBonus;
    }

    const damageRoll = new Roll(damageTerm, damageParams);
    await damageRoll.evaluate({ async: true });
    damageRoll.dice[0].options.rollOrder = 2;

    const pool = PoolTerm.fromRolls([hitRoll, damageRoll]);
    const actualRoll = Roll.fromTerms([pool]);

    actualRoll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: weapon.actor }),
      content: `
    <div 
      class="${constants.abilityChatMessageClassName}"
      ${constants.htmlDataItemId}="${ability?.data._id}"
      ${constants.htmlDataActorId}="${weapon.actor?.data._id}"
      ${constants.htmlDataMode}="${constants.htmlDataModeAttack}"
      ${constants.htmlDataRange}="${rangeName}"
      ${constants.htmlDataWeaponId}="${weapon.data._id}"
      ${constants.htmlDataName}="${weapon.data.name}"
      ${constants.htmlDataImageUrl}="${weapon.data.img}"  
    />
  `,
    });

    const currentPool = ability?.getPool() ?? 0;
    const poolHit = Math.max(0, Number(spend) - bonusPool);
    const newPool = Math.max(0, currentPool - poolHit);
    const newBonusPool = Math.max(0, bonusPool - Number(spend));
    await ability?.setPool(newPool);
    setBonusPool(newBonusPool);
    setSpend(0);
    weapon.setAmmo(Math.max(0, weapon.getAmmo() - weapon.getAmmoPerShot()));
  };
