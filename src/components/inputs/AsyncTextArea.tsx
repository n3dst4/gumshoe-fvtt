import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { TextArea } from "./TextArea";

type AsyncTextAreaProps = {
  className?: string;
  value: string;
  onChange: (value: string, index?: number) => void;
  disabled?: boolean;
  index?: number;
};

export const AsyncTextArea = ({
  className,
  value,
  onChange: onChangeOrig,
  disabled,
  index,
}: AsyncTextAreaProps) => {
  const { onChange, onFocus, onBlur, display } = useAsyncUpdate(
    value,
    onChangeOrig,
  );

  return (
    <TextArea
      className={className}
      value={display || ""}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
    />
  );
};
