/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useEffect, useState } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { isGeneralAbility } from "../../functions";
import { AbilityTest } from "./AbilityTest";
import { AbilityMainBits } from "./AbilityMainBits";
import { AbilityConfig } from "./AbilityConfig";
import { Translate } from "../Translate";
import { ImagePickle } from "../ImagePickle";
import { getUseMwStyleAbilities } from "../../settingsHelpers";
import { AbilityTestMW } from "./AbilityTestMW";
import { AbilityMwExtraFields } from "./AbilityMwExtraFields";

type AbilitySheetProps = {
  ability: InvestigatorItem,
  application: ItemSheet,
};

export const AbilitySheet: React.FC<AbilitySheetProps> = ({
  ability,
  application,
}) => {
  const isGeneral = isGeneralAbility(ability);
  const [configMode, setConfigMode] = useState(false);

  useEffect(() => {
    application.render();
  }, [application, configMode]);

  const {
    contentEditableRef: contentEditableRefName,
    onBlur: onBlurName,
    onFocus: onFocusName,
    onInput: onInputName,
  } = useAsyncUpdate(ability.data.name, ability.setName);

  const useMwStyleAbilities = getUseMwStyleAbilities();

  return (
    <div
      css={{
        paddingBottom: "1em",
        display: "grid",
        height: "100%",
        position: "relative",
        gridTemplateColumns: "auto 1fr auto",
        gridTemplateRows: "auto auto 1fr",
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
      <ImagePickle
        subject={ability}
        application={application}
        css={{
          gridArea: "image",
          transform: "rotateZ(-2deg)",
          width: "4em",
          height: "4em",
          margin: "0 1em 0.5em 0",
        }}
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
      <div
        css={{
          gridArea: "body",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {configMode
          ? <AbilityConfig ability={ability}/>
          : <Fragment>
              {/* Spending/testing area */}
              {ability.isOwned &&
                useMwStyleAbilities
                ? <AbilityTestMW ability={ability} />
                : <AbilityTest ability={ability} />}
              <AbilityMainBits ability={ability} />
              {getUseMwStyleAbilities() &&
                <AbilityMwExtraFields ability={ability} />
              }
            </Fragment>
        }
      </div>
    </div>
  );
};
