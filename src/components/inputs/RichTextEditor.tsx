/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useEffect, useRef, useState } from "react";
import { absoluteCover } from "../absoluteCover";
type RichTextEditorProps = {
  value: string,
  className?: string,
  onSave: () => void,
  onChange: (newSource: string) => void,
};

/**
 * ham-fisted attempt to cram Foundry's TextEditor, which is itself a wrapper
 * around TnyMCE, into a React component. It follows the same pattern as other
 * reacty controls in that it triggers onChange whenever the user types, and
 * calls onSave if they click the save button.
 */
export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  className,
  onSave,
  onChange,
}: RichTextEditorProps) => {
  // useWhyDidYouUpdate("RichTextEditor", {
  //   value,
  //   className,
  //   onSave,
  //   onChange,
  // });

  const ref = useRef<HTMLTextAreaElement>(null);
  const [initialValue] = useState(value);
  useEffect(() => {
    if (ref.current) {
      const instancePromise = TextEditor.create({
        target: ref.current,
        save_onsavecallback: onSave,
      } as any, initialValue).then((mce) => {
        mce.on("change", () => {
          const content = mce.getContent();
          onChange(content);
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
