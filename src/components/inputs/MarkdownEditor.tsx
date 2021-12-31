/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { AsyncTextArea } from "./AsyncTextArea";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * This is just a wrapper for AsyncTextArea, on the offchance that at some point
 * I want to implement a fancy syntax-highlighting editor for Markdown.
 */
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
