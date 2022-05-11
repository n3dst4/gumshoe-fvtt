import { generalAbility, investigativeAbility } from "../../constants";
// import { InvestigatorItem } from "../../module/InvestigatorItem";
// import { settings } from "../../settings";
import { isAbilityDataSource } from "../../types";

export const getBuildPoints = (actor: Actor) => {
  let investigativeBuildPoints = 0;
  let generalBuildPoints = 0;

  for (const item of actor.items.values()) {
    if (!isAbilityDataSource(item.data)) {
      continue;
    }
    if (item.data.type === investigativeAbility) {
      investigativeBuildPoints += item.data.data.occupational
        ? Math.ceil(item.data.data.rating / 2)
        : item.data.data.rating;
    } else if (item.type === generalAbility) {
      generalBuildPoints += item.data.data.occupational
        ? Math.ceil(item.data.data.rating / 2)
        : item.data.data.rating;
    }
  }

  return { investigativeBuildPoints, generalBuildPoints };
};
