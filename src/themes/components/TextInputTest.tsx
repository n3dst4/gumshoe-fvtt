import { useCallback, useState } from "react";

import { TextInput } from "../../components/inputs/TextInput";

export const TextInputTest = () => {
  const [state, setState] = useState("foobar");

  const onChange = useCallback((v: string) => {
    setState(v);
  }, []);

  return (
    <div>
      TextInput: <span data-testid="state">{state}</span>
      <TextInput value={state} onChange={onChange} />
    </div>
  );
};
