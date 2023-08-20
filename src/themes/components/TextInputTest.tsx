import React from "react";

import { TextInput } from "../../components/inputs/TextInput";

export const TextInputTest: React.FC = () => {
  const [state, setState] = React.useState("foobar");

  const onChange = React.useCallback((v: string) => {
    setState(v);
  }, []);

  return (
    <div>
      TextInput: <span data-testid="state">{state}</span>
      <TextInput value={state} onChange={onChange} />
    </div>
  );
};
