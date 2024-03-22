import "./ApplicationV2Types";

import React from "react";
import { createRoot, Root } from "react-dom/client";

import { RecursivePartial } from "./types";

interface DummyAppV2ComponentProps extends React.PropsWithChildren {}

export const DummyAppV2Component: React.FC<DummyAppV2ComponentProps> = ({
  children,
}) => {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <div>{children}</div>
      <div
        css={{
          border: "1px solid #7007",
          padding: "0.5em",
          textAlign: "center",
          background: "#fff1",
          fontSize: "2em",
          margin: "0.5em",
        }}
      >
        {count}
      </div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

DummyAppV2Component.displayName = "DummyAppV2Component";

class DummyAppV2 extends foundry.applications.api.ApplicationV2<void> {
  // STATICS
  static DEFAULT_OPTIONS: RecursivePartial<
    Omit<foundry.applications.types.ApplicationConfiguration, "uniqueId">
  > = {
    ...foundry.applications.api.ApplicationV2.DEFAULT_OPTIONS,
    classes: ["document-sheet"],
    position: {
      height: 100,
      width: 200,
    },

    window: {
      ...foundry.applications.api.ApplicationV2.DEFAULT_OPTIONS.window,
      title: "DummyAppV2",
      frame: true,
    },
  };

  // PROPERTIES

  reactRoot: Root | undefined;

  // METHODS

  // From Atropos: _renderFrame only occurs once and is the most natural point
  // (given the current API) to bind the content div to your react component.
  async _renderFrame(options: unknown) {
    const element = await super._renderFrame(options);
    const target = this.hasFrame
      ? element.querySelector(".window-content")
      : element;
    if (target) {
      this.reactRoot = createRoot(target);
    }
    return element;
  }

  // _renderHTML is the semantically appropriate place to render updates to the
  // HTML of the app.
  override async _renderHTML() {
    console.log("DummyAppV2._renderHTML");

    this.reactRoot?.render(
      <DummyAppV2Component>
        <div css={{ fontSize: "2em" }}>Hello from React</div>
      </DummyAppV2Component>,
    );
  }

  // XXX This override will be optional in P3
  override _replaceHTML(result: any, content: HTMLElement, options: any) {}
}

export function makeDummyAppV2() {
  Hooks.once("ready", () => {
    const app = new DummyAppV2({
      position: {
        height: 300,
        width: 400,
      },
    });
    app.render(true);
  });
}
