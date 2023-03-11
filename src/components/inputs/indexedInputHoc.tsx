import React, { ComponentType } from "react";
import { AsyncTextInput } from "./AsyncTextInput";

interface InputProps<T> {
  onChange: (value: T) => void;
}

export function indexedInputHoc<TProps>(Component: ComponentType<TProps>) {
  type TVal = TProps extends InputProps<infer T> ? T : never;

  type NewProps = TProps extends InputProps<TVal>
    ? Omit<TProps, "onChange"> & {
        onChange: (value: TVal, index: number) => void;
        index: number;
      }
    : never;

  const IndexedInput: React.FC<NewProps> = (props) => {
    const { onChange, index, ...rest } = props;
    const handleChange = (value: TVal) => {
      onChange(value, index);
    };
    return (
      // cast is needed because TS can't follow that
      // NewProps = TProps - onChange+ {index, onChange}
      // therefore Newprops - {index, onChange} + onChange = TProps
      <Component {...(rest as unknown as TProps)} onChange={handleChange} />
    );
  };

  // Just for e.g., this works fine
  // const IndexedInput2: React.FC<TProps> = (props) => {
  //   return (
  //     <Component {...props} />
  //   );
  // };

  IndexedInput.displayName = `Indexed${Component.displayName}`;

  return IndexedInput;
}

export const IndexedAsyncTextInput = indexedInputHoc(AsyncTextInput);
