/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useEffect, useRef, useState } from "react";
import { absoluteCover } from "../absoluteCover";
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
  const ref = useRef<HTMLTextAreaElement>(null);
  const [initialValue] = useState(value);
  useEffect(() => {
    if (ref.current) {
      const instancePromise = TextEditor.create({
        target: ref.current,
      }, initialValue).then((mce) => {
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
  }, [initialValue, onChange]);
  return (
    <div
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
    </div>
  );
};
