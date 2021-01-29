/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useState } from "react";
import { useUpdate } from "../../hooks/useUpdate";
import { TrailItem } from "../../module/TrailItem";
import { CSSReset } from "../CSSReset";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { isGeneralAbility } from "../../functions";
import { AbilityTest } from "./AbilityTest";
import { AbilityEditorMain } from "./AbilityEditorMain";
import { AbilityConfig } from "./AbilityConfig";

type AbilitySheetProps = {
  ability: TrailItem,
  foundryWindow: Application,
};

export const AbilitySheet: React.FC<AbilitySheetProps> = ({
  ability,
  foundryWindow,
}) => {
  const isGeneral = isGeneralAbility(ability);
  const updateName = useUpdate(ability, (name) => ({ name }));
  const [configMode, setConfigMode] = useState(false);

  // useEffect(() => {
  //   foundryWindow.render();
  // }, [foundryWindow, configMode]);

  const {
    // display,
    contentEditableRef: contentEditableRefName,
    onBlur: onBlurName,
    onFocus: onFocusName,
    onInput: onInputName,
  } = useAsyncUpdate(ability.data.name, updateName);

  return (
    <CSSReset
      css={{
        paddingBottom: "1em",
      }}
    >
      <div>
        {isGeneral ? "General" : "Investigative"} ability
        <a
          css={{
            float: "right",
          }}
          onClick={() => {
            setConfigMode((mode) => !mode);
          }}
        >
          <i className={`fa fa-${configMode ? "check" : "cog"}`}/>
        </a>
      </div>

      <h1>
        <span
          contentEditable
          css={{
            minWidth: "1em",
            display: "inline-block",
          }}
          ref={contentEditableRefName}
          onInput={onInputName}
          onBlur={onBlurName}
          onFocus={onFocusName}
        />
      </h1>

      {/* regular editing stuff */}
      {configMode
        ? <AbilityConfig ability={ability}/>
        : <Fragment>
            {/* Spending/testing area */}
            {ability.isOwned && <AbilityTest ability={ability} />}
            <AbilityEditorMain ability={ability} />
          </Fragment>
      }
    </CSSReset>
  );
};
