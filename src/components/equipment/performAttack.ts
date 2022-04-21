import { InvestigatorItem } from "../../module/InvestigatorItem";
import * as constants from "../../constants";
import { assertGame } from "../../functions";
import { settings } from "../../settings";

type PerformAttackArgs1 = {
  spend: number,
  bonusPool: number,
  setSpend: (value: number) => void,
  setBonusPool: (value: number) => void,
  weapon: InvestigatorItem,
  ability: InvestigatorItem|undefined,
}

type PerformAttackArgs2 = {
  rangeName: string,
  rangeDamage: number,
}

export const performAttack = ({
  spend,
  ability,
  weapon,
  bonusPool,
  setSpend,
  setBonusPool,
}: PerformAttackArgs1) => async ({
  rangeName,
  rangeDamage,
}: PerformAttackArgs2) => {
  assertGame(game);
  if (weapon.actor === null) { return; }
  const damage = weapon.getDamage();

  const useBoost = settings.useBoost.get();
  const isBoosted = useBoost && (ability !== undefined) && ability.getBoost();
  const boost = isBoosted ? 1 : 0;
  const hitRoll = isBoosted
    ? new Roll("1d6 + @spend + @boost", { spend, boost })
    : new Roll("1d6 + @spend", { spend });
  await hitRoll.evaluate({ async: true });
  hitRoll.dice[0].options.rollOrder = 1;

  const damageRoll = new Roll("1d6 + @damage + @rangeDamage", {
    spend,
    damage,
    rangeDamage,
  });
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
  ability?.setPool(newPool);
  setBonusPool(newBonusPool);
  setSpend(0);
  weapon.setAmmo(Math.max(0, weapon.getAmmo() - weapon.getAmmoPerShot()));
}
;
