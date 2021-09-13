import { getTranslated } from "../../functions";
import { GumshoeItem } from "../../module/GumshoeItem";

type PerformAttackArgs1 = {
  spend: number,
  bonusPool: number,
  setSpend: (value: number) => void,
  setBonusPool: (value: number) => void,
  weapon: GumshoeItem,
  ability: GumshoeItem,
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
}: PerformAttackArgs1) => ({
  rangeName,
  rangeDamage,
}: PerformAttackArgs2) => {
  if (ability.actor === null) { return; }
  const damage = weapon.getDamage();
  const hitRoll = new Roll("1d6 + @spend", { spend });
  const rangeNameTranslated = getTranslated(rangeName);
  const hitLabel = getTranslated("AttacksWithWeaponNameRollingAbilityNameAtRangeName", {
    WeaponName: weapon.name ?? "",
    AbilityName: ability.name ?? "",
    RangeName: rangeNameTranslated,
  });
  hitRoll.roll();
  hitRoll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor: ability.actor }),
    flavor: hitLabel,
  });
  const damageRoll = new Roll("1d6 + @damage + @rangeDamage", {
    spend,
    damage,
    rangeDamage,
  });
  const damageLabel = getTranslated("DamageAtRangeNameWithWeaponName", {
    RangeName: rangeNameTranslated,
    WeaponName: weapon.name ?? "",
  });
  // const damageLabel = `Damage at ${rangeName} with <b>${weapon.name}</b>`;
  damageRoll.roll();
  damageRoll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor: ability.actor }),
    flavor: damageLabel,
  });
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
