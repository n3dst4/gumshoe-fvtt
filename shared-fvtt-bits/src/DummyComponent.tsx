import "./ApplicationV2Types";

import React from "react";

interface DummyComponentProps extends React.PropsWithChildren {}

export const DummyComponent: React.FC<DummyComponentProps> = ({ children }) => {
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

DummyComponent.displayName = "DummyComponent";
