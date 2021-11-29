/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useEffect, useRef, useState } from "react";
import { useWhyDidYouUpdate } from "../../hooks/useWhyDidYouUpdate";
import { absoluteCover } from "../absoluteCover";
type RichTextEditorProps = {
  value: string,
  className?: string,
  onSave: (newSource: string) => void,
  onChange?: (newSource: string) => void,
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  className,
  onSave,
  onChange,
}: RichTextEditorProps) => {
  useWhyDidYouUpdate("RichTextEditor", {
    value,
    className,
    onSave,
    onChange,
  });

  const ref = useRef<HTMLTextAreaElement>(null);
  const [initialValue] = useState(value);
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
          const content = mce.getContent();
          onChange && onChange(content);
          currentValue = content;
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
  // const onSubmit = useCallback((e: any) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   // eslint-disable-next-line no-debugger
  //   // debugger;
  // }, []);

  return (
    <form
      // onSubmit={onSubmit}
      css={{
        ...absoluteCover,
        backgroundColor: "white",
      }}
      className={className}
      >
      <textarea
        ref={ref}
      />
    </form>
  );
};
