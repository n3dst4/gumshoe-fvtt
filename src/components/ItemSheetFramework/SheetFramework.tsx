import React, {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from "react";

import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { ImagePickle } from "../ImagePickle";
import { ModeContext } from "./modeContext";
import { ItemSheetMode } from "./types";

type ItemSheetFrameworkProps = PropsWithChildren<{
  supertitle?: ReactNode;
  item: InvestigatorItem;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  application: DocumentSheet | foundry.applications.api.DocumentSheetV2<any>;
}>;

export const ItemSheetFramework: React.FC<ItemSheetFrameworkProps> = ({
  supertitle,
  item,
  application,
  children,
}) => {
  const { contentEditableRef, onBlur, onFocus, onInput } = useAsyncUpdate(
    item.name ?? "",
    item.setName,
  );

  const [configMode, setConfigMode] = useState(false);

  useEffect(() => {
    // XXX I'm sure we can do better but the types are weird right now
    void application.render(true);
  }, [application, configMode]);

  return (
    <ModeContext.Provider
      value={configMode ? ItemSheetMode.Config : ItemSheetMode.Main}
    >
      <div
        css={{
          paddingBottom: "1em",
          display: "grid",
          gap: "0.3em",
          height: "100%",
          position: "relative",
          gridTemplateColumns: "auto 1fr auto",
          gridTemplateRows: "auto auto 1fr",
          gridTemplateAreas:
            '"image slug     cog" ' +
            '"image headline headline" ' +
            '"body  body     body" ',
        }}
      >
        {/* Supertitle */}
        <div css={{ gridArea: "slug" }}>{supertitle}</div>

        {/* Headline */}
        <h1 css={{ gridArea: "headline" }}>
          <span
            contentEditable
            css={{
              minWidth: "1em",
              display: "inline-block",
            }}
            ref={contentEditableRef}
            onInput={onInput}
            onBlur={onBlur}
            onFocus={onFocus}
          />
        </h1>

        {/* Image */}
        <ImagePickle
          subject={item}
          // @ts-expect-error yikes
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
          <i className={`fa fa-${configMode ? "check" : "cog"}`} />
        </a>
        {/* regular editing stuff */}
        <div
          css={{
            gridArea: "body",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            position: "relative",
          }}
        >
          {children}
        </div>
      </div>
    </ModeContext.Provider>
  );
};

ItemSheetFramework.displayName = "SheetFramework";
