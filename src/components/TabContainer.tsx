/** @jsx jsx */
import { jsx } from "@emotion/react";
import { nanoid } from "nanoid";
import React, { ChangeEvent, Fragment, useCallback, useMemo, useState } from "react";
// import React, { useMemo, useState } from "react";

type TabDefinition = {
  id: string,
  label: string | JSX.Element,
  content: JSX.Element,
}

type TabContainerProps = {
  tabs: TabDefinition[],
  defaultTab: string,
};

export const TabContainer: React.FC<TabContainerProps> = ({
  tabs,
  defaultTab,
}) => {
  const [selected, setSelected] = useState(defaultTab);
  const activeTabDef = useMemo(
    () => tabs.find((t) => t.id === selected), [selected, tabs],
  );
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSelected(e.currentTarget.value);
  }, []);

  const radioGroup = useMemo(() => nanoid(), []);

  return (
    <div
      css={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        "input[type=radio]": {
          display: "none",
          "+label": {
            padding: "0",
            flex: 1,
            textAlign: "center",
            fontSize: "1.4em",
            fontWeight: "bold",
            border: "2px groove white",
            backgroundColor: "rgba(0,0,0,0.1)",
            paddingBottom: "0.3em",
            borderRadius: "0.2em",
            ":hover, :focus": {
              textShadow: "0 0 0.3em rgba(255,111,18,1)",
            },
          },
          "&:checked+label": {
            background: "grey",
            border: "2px inset white",
            backgroundColor: "rgba(255,111,18,0.2)",
            ":hover": {
              textShadow: "none",
            },
          },
          "&[disabled]+label": {
            opacity: 0.3, //
            ":hover": {
              textShadow: "none",
            },
          },
        },

      }}
    >
      <div>
        {tabs.map(({ id, label }) => {
          const htmlId = nanoid();
          return (<Fragment key={id}>
            <input
              name={radioGroup}
              id={htmlId}
              type="radio"
              value={id}
              checked={id === selected}
              onChange={onChange}
            />
            <label htmlFor={htmlId} tabIndex={0}>
              {label}
            </label>
          </Fragment>);
        })}
      </div>
      <div
        css={{
          flex: 1,
          position: "relative",
          overflow: "auto",
        }}
      >
        {activeTabDef.content}
      </div>
    </div>
  );
};
