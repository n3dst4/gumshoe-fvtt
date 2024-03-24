import React, { useCallback, useEffect, useRef, useState } from "react";

import { wait } from "../../functions/utilities";
import { absoluteCover } from "../absoluteCover";
type RichTextEditorProps = {
  value: string;
  className?: string;
  onSave: () => void;
  onChange: (newSource: string) => void;
};

/**
 * This doesn't seem to be made directly available so we need to use TS
 * shenanigans to extract it.
 */
type TinyMceEditor = Awaited<ReturnType<typeof TextEditor.create>>;

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

  const myOnSave = useCallback(async () => {
    // hacky delay to allow the editor to update the content before we try to
    // save it. I would try harder here but we will almost certainlky end up
    // using foundry's cool new editor in due course anyway.
    await wait(500);
    onSave();
  }, [onSave]);

  const ref = useRef<HTMLTextAreaElement>(null);
  const [initialValue] = useState(value);

  useEffect(() => {
    let tinyMceEditor: TinyMceEditor | null = null;
    if (ref.current) {
      void TextEditor.create(
        {
          target: ref.current,
          save_onsavecallback: myOnSave,
          height: "100%",
        } as any,
        initialValue,
      )
        .then((mce) => {
          mce.on("change", () => {
            const content = mce.getContent();
            onChange(content);
          });
          return mce;
        })
        .then((mce) => {
          tinyMceEditor = mce;
        });
      return () => {
        if (tinyMceEditor) {
          tinyMceEditor.destroy();
        }
      };
    }
  }, [initialValue, myOnSave, onChange]);

  return (
    <form
      css={{
        ...absoluteCover,
        backgroundColor: "white",
      }}
      className={className}
    >
      <textarea ref={ref} css={{ height: "100%" }} />
    </form>
  );
};
