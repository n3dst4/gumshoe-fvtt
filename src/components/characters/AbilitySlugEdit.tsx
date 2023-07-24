import React, { Fragment, useCallback, useContext } from "react";

import { InvestigatorItem } from "../../module/InvestigatorItem";
import { assertAbilityItem } from "../../v10Types";
import { AbilityBadges } from "../abilities/AbilityBadges";
import { SpecialityList } from "../abilities/SpecialityList";
import { FoundryAppContext } from "../FoundryAppContext";
import { AsyncCheckbox } from "../inputs/AsyncCheckbox";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";

type AbilitySlugEditProps = {
  ability: InvestigatorItem;
  showOcc?: boolean;
};

export const AbilitySlugEdit: React.FC<AbilitySlugEditProps> = ({
  ability,
  showOcc = true,
}) => {
  assertAbilityItem(ability);
  const app = useContext(FoundryAppContext);
  const onDragStart = useCallback(
    (e: React.DragEvent<HTMLAnchorElement>) => {
      if (app !== null) {
        (app as any)._onDragStart(e);
      }
    },
    [app],
  );
  const updateRating = useCallback(
    (rating: number) => {
      ability.setRatingRefresh(rating);
    },
    [ability],
  );

  return (
    <Fragment key={ability.id}>
      {showOcc && (
        <div css={{ gridColumn: "isocc", justifySelf: "center" }}>
          <AsyncCheckbox
            checked={ability.system.occupational}
            onChange={ability.setOccupational}
          />
        </div>
      )}
      <a
        onClick={() => {
          ability.sheet?.render(true);
        }}
        data-item-id={ability.id}
        onDragStart={onDragStart}
        draggable="true"
        css={{ gridColumn: "ability" }}
      >
        {ability.name}
      </a>
      <div css={{ gridColumn: "rating", justifySelf: "center" }}>
        <AsyncNumberInput
          min={0}
          value={ability.system.rating}
          onChange={updateRating}
          smallButtons
        />
      </div>
      <AbilityBadges ability={ability} css={{ gridColumn: "1/-1" }} />
      {ability.getHasSpecialities() && ability.getSpecialitesCount() > 0 && (
        <div css={{ paddingLeft: "2em", gridColumn: "1/-1" }}>
          <SpecialityList ability={ability} />
        </div>
      )}
    </Fragment>
  );
};
