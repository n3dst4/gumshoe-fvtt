import React, { useCallback } from "react";

type ListEditProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

export const ListEdit: React.FC<ListEditProps> = ({
  value,
  onChange,
}) => {
  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.dataset.index) { return; }
    const newList = [...value];
    newList[Number(e.currentTarget.dataset.index)] = e.currentTarget.value;
    onChange(newList);
  }, [onChange, value]);

  return (
    <div>
      {value.map((s, i) => (
        <div key={i}>
          <input
            data-index={i}
            type="text"
            value={s}
            onChange={onInputChange}
          />
        </div>
      ))}
    </div>
  );
};
