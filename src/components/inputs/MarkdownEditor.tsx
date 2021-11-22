/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { AsyncTextArea } from "./AsyncTextArea";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => Promise<void>;
  className?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  className,
}: MarkdownEditorProps) => {
  return (
    <AsyncTextArea
      value={value}
      onChange={onChange}
      className={className}
    />
  );
};
