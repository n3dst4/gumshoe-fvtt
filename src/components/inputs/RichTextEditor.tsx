/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useEffect, useRef } from "react";
import { absoluteCover } from "../absoluteCover";
type RichTextEditorProps = {
  initialValue: string,
  className?: string,
  onSave: (newSource: string) => void,
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialValue,
  className,
  onSave,
}: RichTextEditorProps) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    let currentValue = initialValue;
    if (ref.current) {
      const instancePromise = TextEditor.create({
        target: ref.current,
        save_onsavecallback: () => {
          onSave(currentValue);
        },
      } as any, initialValue).then((mce) => {
        mce.on("change", () => {
          currentValue = mce.getContent();
        });
        return mce;
      });
      return () => {
        instancePromise.then((mce) => {
          mce.destroy();
        });
      };
    }
  }, [initialValue, onSave]);
  const onSubmit = useCallback((e: any) => {
    e.preventDefault();
    e.stopPropagation();
    // eslint-disable-next-line no-debugger
    // debugger;
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
        value={initialValue}
        className={className}
      >
        {initialValue}
      </textarea>
    </form>
  );
};
