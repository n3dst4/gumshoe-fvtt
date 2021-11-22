/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useEffect, useRef, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { StacksEditor } from "@stackoverflow/stacks-editor";
// don't forget to include the styles as well
// eslint-disable-next-line import/no-webpack-loader-syntax
import sCss from "!!to-string-loader!css-loader!./stack-css.css";
// eslint-disable-next-line import/no-webpack-loader-syntax
import reset from "!!to-string-loader!css-loader!./reset.css";
// import { createPortal } from "react-dom";

interface MarkdownEditorProps {
  className?: string;
  value: string;
  onChange: (value: string, index?: number) => void;
  disabled?: boolean;
  index?: number;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  className,
  value,
  onChange,
  disabled,
  index,
}: MarkdownEditorProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [initialValue] = useState(value);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [shadow, setShadow] = useState<ShadowRoot|null>(null);
  useEffect(() => {
    if (divRef.current) {
      const shadow = divRef.current.attachShadow({ mode: "closed" });
      setShadow(shadow);
      const rootEl = document.createElement("div");
      rootEl.id = "root";
      rootEl.innerHTML = `
        <style>
          ${reset.toString()}
        </style>
        <style>
          ${sCss.toString()}
        </style>
      `;
      const editorEl = document.createElement("div");
      editorEl.id = "editor";
      shadow.appendChild(rootEl);
      rootEl.appendChild(editorEl);
      // eslint-disable-next-line no-new
      new StacksEditor(
        editorEl,
        initialValue,
      );
      logger.log("Setting shadow");
    }
  }, [divRef, initialValue]);

  // let portal: ReactNode = null;
  // if (shadow) {
  //   logger.log("Got shadow, finding root...");
  //   const root = shadow.querySelector("#root");
  //   if (root) {
  //     logger.log("Rendering portal into root");
  //     portal = createPortal(<button>Button</button>, root);
  //   }
  // }

  return (
    <Fragment>
      <div ref={divRef}></div>
      {/* {portal} */}
    </Fragment>
  );
};
