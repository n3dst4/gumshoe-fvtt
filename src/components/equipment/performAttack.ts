import { InvestigatorItem } from "../../module/InvestigatorItem";
import * as constants from "../../constants";

type PerformAttackArgs1 = {
  spend: number,
  bonusPool: number,
  setSpend: (value: number) => void,
  setBonusPool: (value: number) => void,
  weapon: InvestigatorItem,
  ability: InvestigatorItem,
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
  if (ability.actor === null) { return; }
  const damage = weapon.getDamage();
  const hitRoll = new Roll("1d6 + @spend", { spend });
  // const rangeNameTranslated = getTranslated(rangeName);
  // const hitLabel = getTranslated("AttacksWithWeaponNameRollingAbilityNameAtRangeName", {
  //   WeaponName: weapon.name ?? "",
  //   AbilityName: ability.name ?? "",
  //   RangeName: rangeNameTranslated,
  // });
  await hitRoll.evaluate({ async: true });
  hitRoll.dice[0].options.rollOrder = 1;

  const damageRoll = new Roll("1d6 + @damage + @rangeDamage", {
    spend,
    damage,
    rangeDamage,
  });
  await damageRoll.evaluate({ async: true });
  damageRoll.dice[0].options.rollOrder = 2;

  // const damageLabel = getTranslated("DamageAtRangeNameWithWeaponName", {
  //   RangeName: rangeNameTranslated,
  //   WeaponName: weapon.name ?? "",
  // });
  // const damageLabel = `Damage at ${rangeName} with <b>${weapon.name}</b>`;

  const pool = PoolTerm.fromRolls([hitRoll, damageRoll]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const actualRoll = Roll.fromTerms([pool]);

  actualRoll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor: ability.actor }),
    content: `
    <div 
      class="${constants.abilityChatMessageClassName}"
      ${constants.htmlDataItemId}="${ability.data._id}"
      ${constants.htmlDataActorId}="${ability.parent?.data._id}"
      ${constants.htmlDataMode}="${constants.htmlDataModeCombat}"
      ${constants.htmlDataRange}="${rangeName}"
      ${constants.htmlDataWeaponId}="${weapon.data._id}"
    />
  `,
  });

  // damageRoll.toMessage({
  //   speaker: ChatMessage.getSpeaker({ actor: ability.actor }),
  //   flavor: damageLabel,
  // });

  // -------------------
  // const attack = await new Roll("d20").evaluate({ async: true });
  // attack.dice[0].options.rollOrder = 1;

  // const directDamage = await new Roll("d6").evaluate({ async: true });
  // directDamage.dice[0].options.rollOrder = 2;

  // const aoeDamage = await new Roll("d4").evaluate({ async: true });
  // aoeDamage.dice[0].options.rollOrder = 2;

  // // Merge rolls
  // const rolls = [attack, directDamage, aoeDamage]; // array of Roll
  // const pool2 = PoolTerm.fromRolls(rolls);
  // const roll2 = Roll.fromTerms([pool2]);

  // roll2.toMessage();
  // -----------------------

  const currentPool = ability.getPool();
  const poolHit = Math.max(0, Number(spend) - bonusPool);
  const newPool = Math.max(0, currentPool - poolHit);
  const newBonusPool = Math.max(0, bonusPool - Number(spend));
  ability.setPool(newPool);
  setBonusPool(newBonusPool);
  setSpend(0);
  weapon.setAmmo(Math.max(0, weapon.getAmmo() - weapon.getAmmoPerShot()));
}
;
