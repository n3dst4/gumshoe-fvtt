/** @jsx jsx */
import { jsx } from "@emotion/react";
import { nanoid } from "nanoid";
import React, { ChangeEvent, Fragment, useCallback, useContext, useMemo, useState } from "react";
import { ThemeContext } from "../themes/ThemeContext";
import { Translate } from "./Translate";
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

  const theme = useContext(ThemeContext);

  const radioGroup = useMemo(() => nanoid(), []);

  return (
    <div
      key={selected}
      css={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        ".tab-strip": {
          display: "flex",
          flexDirection: "row",
          gap: "0.5em",
        },
        "input[type=radio]": {
          display: "none",
          "+label": {
            flex: 1,
            padding: "0.3em",
            display: "inline-block",
            textAlign: "center",
            fontSize: "1.4em",
            background: theme.colors.backgroundSecondary,
            borderRadius: "0.2em 0.2em 0 0",
            color: theme.colors.accent,

            ":hover": {
              textShadow: `0 0 0.3em ${theme.colors.glow}`,
            },
          },
          "&:checked+label": {
            // background: "grey",
            // border: "2px inset white",
            // backgroundColor: "rgba(255,111,18,0.2)",
            background: theme.colors.backgroundPrimary,
            ":hover": {
              textShadow: "none",
            },
          },
          "&[disabled]+label": {
            opacity: 0.3,
            ":hover": {
              textShadow: "none",
            },
          },
        },

      }}
    >
      {["foo", "bar"].map<JSX.Element>((x) => <span key={x}/>)}

      <div className="tab-strip">
        {tabs.map<jsx.JSX.Element>(({ id, label }) => {
          const htmlId = nanoid();
          return (
            <Fragment key={id}>
              <input
                name={radioGroup}
                id={htmlId}
                type="radio"
                value={id}
                checked={id === selected}
                onChange={onChange}
              />
              <label htmlFor={htmlId} tabIndex={0}>
                {typeof label === "string"
                  ? <Translate>{label}</Translate>
                  : label
                }
              </label>
            </Fragment>
          );
        })}
      </div>
      <div
        css={{
          flex: 1,
          position: "relative",
          overflow: "auto",
          background: theme.colors.backgroundPrimary,
          padding: "0.5em",
        }}
      >
        {activeTabDef?.content}
      </div>
    </div>
  );
};
