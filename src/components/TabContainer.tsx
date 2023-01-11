import { nanoid } from "nanoid";
import React, {
  ChangeEvent,
  Fragment,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { ThemeContext } from "../themes/ThemeContext";
import { Translate } from "./Translate";
// import React, { useMemo, useState } from "react";

type TabDefinition = {
  id: string;
  label: string | JSX.Element;
  content: JSX.Element;
};

type TabContainerProps = {
  tabs: TabDefinition[];
  defaultTab: string;
};

export const TabContainer: React.FC<TabContainerProps> = ({
  tabs,
  defaultTab,
}) => {
  const [selected, setSelected] = useState(defaultTab);
  const activeTabDef = useMemo(
    () => tabs.find((t) => t.id === selected),
    [selected, tabs],
  );
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSelected(e.currentTarget.value);
  }, []);

  const theme = useContext(ThemeContext);

  const radioGroup = useMemo(nanoid, []);

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
          "+label": theme.tabStyle,
          "&:checked+label": theme.tabActiveStyle,
          "&[disabled]+label": {
            opacity: 0.3,
            ":hover": {
              textShadow: "none",
            },
          },
        },
      }}
    >
      {["foo", "bar"].map<JSX.Element>((x) => (
        <span key={x} />
      ))}

      <div className="tab-strip">
        {tabs.map<JSX.Element>(({ id, label }) => {
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
              <label
                htmlFor={htmlId}
                tabIndex={0}
                className={theme.tabClass}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                {typeof label === "string" ? (
                  <Translate>{label}</Translate>
                ) : (
                  label
                )}
              </label>
            </Fragment>
          );
        })}
      </div>
      <div
        className={theme.panelClass}
        css={{
          flex: 1,
          position: "relative",
          overflow: "auto",
          padding: "0.5em",
          ...theme.panelStylePrimary,
        }}
      >
        {activeTabDef?.content}
      </div>
    </div>
  );
};
