/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { AsyncTextArea } from "./AsyncTextArea";
type RichTextEditorProps = {
  value: string,
  onChange: (value: string) => Promise<void>,
  className?: string,
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  className,
}: RichTextEditorProps) => {
  return (
    <AsyncTextArea
      value={value}
      onChange={onChange}
      className={className}
    />
  );
};
