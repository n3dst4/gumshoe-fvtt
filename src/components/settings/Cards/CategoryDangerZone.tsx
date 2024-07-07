import React from "react";

// import { ThemeContext } from "../../../themes/ThemeContext";
import { AsyncTextInput } from "../../inputs/AsyncTextInput";
import { Button } from "../../inputs/Button";
import { GridField } from "../../inputs/GridField";
import { InputGrid } from "../../inputs/InputGrid";
import { Translate } from "../../Translate";

type CategoryDangerZoneProps = {
  category: any;
  onDelete: () => void;
  onChangeId: (newId: string) => void;
};

export const CategoryDangerZone: React.FC<CategoryDangerZoneProps> = ({
  category,
  onDelete,
  onChangeId,
}) => {
  // const theme = useContext(ThemeContext);

  return (
    <>
      <h2>
        <Translate>Danger Zone</Translate> ({category?.name})
      </h2>
      <InputGrid>
        <GridField label="Unique Id">
          <AsyncTextInput value={category?.id} onChange={onChangeId} />
        </GridField>
        <GridField label="Delete">
          <Button
            onClick={onDelete}
            css={{
              "&&": {
                // color: theme.colors.danger,
              },
            }}
          >
            <Translate>Delete</Translate>
          </Button>
        </GridField>
      </InputGrid>
    </>
  );
};
