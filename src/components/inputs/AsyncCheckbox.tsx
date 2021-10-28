/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useEffect, useState } from "react";
import { Checkbox } from "./Checkbox";

type AsyncCheckboxProps = {
  checked: boolean,
  onChange: (checked: boolean) => void,
  className?: string,
};

export const AsyncCheckbox: React.FC<AsyncCheckboxProps> = ({
  checked: checkedProp,
  onChange: onChangeProp,
  className,
}) => {
  const [checked, setChecked] = useState(checkedProp);
  useEffect(() => {
    setChecked(checkedProp);
  }, [checkedProp]);

  const onChange = useCallback((checked: boolean) => {
    onChangeProp(checked);
    setChecked(checked);
  }, [onChangeProp]);

  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
      className={className}
    />
  );
};
