/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { absoluteCover } from "../absoluteCover";
type RichTextEditorProps = {
  value: string,
  onChange: (value: string) => void,
  className?: string,
  onSave: () => void,
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  className,
  onSave,
}: RichTextEditorProps) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [initialValue] = useState(value);
  useEffect(() => {
    // const options =
    if (ref.current) {
      const instancePromise = TextEditor.create({
        target: ref.current,
        save_onsavecallback: () => {
          onSave();
        },
      } as any, initialValue).then((mce) => {
        mce.on("change", (event) => {
          onChange(mce.getContent());
        });
        return mce;
      });
      return () => {
        instancePromise.then((mce) => {
          mce.destroy();
        });
      };
    }
  }, [initialValue, onChange, onSave]);
  const onSubmit = useCallback((e: any) => {
    e.preventDefault();
    e.stopPropagation();
    // eslint-disable-next-line no-debugger
    debugger;
  }, []);

  return (
    <form
      onSubmit={onSubmit}
      css={{
        ...absoluteCover,
        backgroundColor: "white",
      }}
    >
      <textarea
        ref={ref}
        value={value}
        // onChange={onChange}
        className={className}
      >
        {value}
      </textarea>
    </form>
  );
};
