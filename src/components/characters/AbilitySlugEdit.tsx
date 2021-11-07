/** @jsx jsx */
import React, { Fragment, useCallback, useContext } from "react";
import { jsx } from "@emotion/react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { ActorSheetAppContext } from "../FoundryAppContext";
import { assertAbilityDataSource } from "../../types";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { SpecialityList } from "../abilities/SpecialityList";
import { AsyncCheckbox } from "../inputs/AsyncCheckbox";

type AbilitySlugEditProps = {
  ability: InvestigatorItem,
  showOcc?: boolean,
};

export const AbilitySlugEdit: React.FC<AbilitySlugEditProps> = ({ ability, showOcc = true }) => {
  assertAbilityDataSource(ability.data);
  const app = useContext(ActorSheetAppContext);
  const onDragStart = useCallback((e: React.DragEvent<HTMLAnchorElement>) => {
    if (app !== null) {
      (app as any)._onDragStart(e);
    }
  }, [app]);
  const updateRating = useCallback((rating) => { ability.setRatingRefresh(rating); }, [ability]);

  // const [occupational, setOccupational] = useState(ability.data.data.occupational);
  // useEffect(() => {
  //   assertAbilityDataSource(ability.data);
  //   setOccupational(ability.data.data.occupational);
  // }, [ability.data, ability.data.data.occupational]);

  return (
    <Fragment
      key={ability.id}
    >
      { showOcc && (
        <div css={{ gridColumn: "isocc", justifySelf: "center" }} >
          <AsyncCheckbox
            checked={ability.data.data.occupational}
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
      <div css={{ gridColumn: "rating", justifySelf: "center" }} >
        <AsyncNumberInput
          min={0}
          value={ability.data.data.rating}
          onChange={updateRating}
          noPlusMinus={true}
          css={{ width: "2em" }}
        />
      </div>
      {ability.getHasSpecialities() && (ability.data.data.rating > 0) && (
        <div css={{ paddingLeft: "1em", gridColumn: "ability", width: "2em" }}>
          <SpecialityList ability={ability} />
        </div>
      )}
    </Fragment>
  );
};
