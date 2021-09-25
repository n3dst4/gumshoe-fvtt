/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useEffect, useState } from "react";
import { useUpdate } from "../../hooks/useUpdate";
import { GumshoeItem } from "../../module/GumshoeItem";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { isGeneralAbility } from "../../functions";
import { AbilityTest } from "./AbilityTest";
import { AbilityMainBits } from "./AbilityMainBits";
import { AbilityConfig } from "./AbilityConfig";
import { Translate } from "../Translate";

type AbilitySheetProps = {
  ability: GumshoeItem,
  foundryWindow: Application,
};

export const AbilitySheet: React.FC<AbilitySheetProps> = ({
  ability,
  foundryWindow,
}) => {
  const isGeneral = isGeneralAbility(ability);
  const updateName = useUpdate(ability, (name) => ({ name }));
  const [configMode, setConfigMode] = useState(false);

  useEffect(() => {
    foundryWindow.render();
  }, [foundryWindow, configMode]);

  const {
    // display,
    contentEditableRef: contentEditableRefName,
    onBlur: onBlurName,
    onFocus: onFocusName,
    onInput: onInputName,
  } = useAsyncUpdate(ability.data.name, updateName);

  return (
    <div
      css={{
        paddingBottom: "1em",
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gridTemplateRows: "auto auto auto",
        gridTemplateAreas:
          "\"image slug     cog\" " +
          "\"image headline headline\" " +
          "\"body  body     body\" ",
      }}
    >
      {/* Slug */}
      <div css={{ gridArea: "slug" }}>
        <Translate>{isGeneral ? "General ability" : "Investigative ability"}</Translate>
        {ability.actor && <span> ({ability.actor.data.name})</span>}
      </div>

      {/* Headline */}
      <h1 css={{ gridArea: "headline" }}>
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

      {/* Image */}
      <div
        css={{
          gridArea: "image",
          backgroundImage: `url("${ability.data.img}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "0.2em",
          boxShadow: "0em 0em 0.5em 0.1em rgba(0,0,0,0.5)",
          transform: "rotateZ(-2deg)",
          width: "4em",
          height: "4em",
          margin: "0 1em 0.5em 0",
        }}
        // onClick={onImageClick}
      />

      {/* Cog */}
      <a
        css={{
          gridArea: "cog",
        }}
        onClick={() => {
          setConfigMode((mode) => !mode);
        }}
      >
        <i className={`fa fa-${configMode ? "check" : "cog"}`}/>
      </a>
      {/* regular editing stuff */}
      <div css={{ gridArea: "body" }}>
        {configMode
          ? <AbilityConfig ability={ability}/>
          : <Fragment>
              {/* Spending/testing area */}
              {ability.isOwned && <AbilityTest ability={ability} />}
              <AbilityMainBits ability={ability} />
            </Fragment>
        }
      </div>
    </div>
  );
};
