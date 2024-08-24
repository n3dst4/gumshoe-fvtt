import { Link, Router } from "@lumphammer/minirouter";
import React from "react";
import { FaArrowRight } from "react-icons/fa6";

import { confirmADoodleDo } from "../../functions/confirmADoodleDo";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { assertCardItem } from "../../v10Types";
import { absoluteCover } from "../absoluteCover";
import { Button } from "../inputs/Button";
import { SlideInNestedPanelRoute } from "../nestedPanels/SlideInNestedPanelRoute";
import { Translate } from "../Translate";
import { CardDisplay } from "./CardDisplay";
import { CardMain } from "./CardMain";
import { edit } from "./directions";

type CardSheetProps = {
  card: InvestigatorItem;
  application: ItemSheet;
};

export const CardSheet: React.FC<CardSheetProps> = ({ card, application }) => {
  assertCardItem(card);

  const handleClickDiscard = React.useCallback(async () => {
    const message = card.actor
      ? "DiscardActorNamesCardNameCard"
      : "DeleteCardName";

    const confirmText = card.actor ? "Discard" : "Delete";

    const yes = await confirmADoodleDo({
      message,
      confirmText,
      cancelText: "Cancel",
      confirmIconClass: "fa-trash",
      resolveFalseOnCancel: true,
      values: {
        ActorName: card.actor?.name ?? "",
        CardName: card.name ?? "",
      },
    });
    if (yes) {
      void card.delete();
    }
  }, [card]);

  const handleClickDeactivate = React.useCallback(async () => {
    await card.update({ system: { active: false } });
  }, [card]);

  const handleClickActivate = React.useCallback(async () => {
    await card.update({ system: { active: true } });
  }, [card]);

  return (
    <Router>
      <div
        css={{
          ...absoluteCover,
          margin: "0.5em",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          css={{
            display: "flex",
            flexDirection: "row",
            paddingBottom: "0.5em",
          }}
        >
          <Button onClick={handleClickDiscard}>
            <Translate>{card.actor ? "Discard" : "Delete"}</Translate>
          </Button>{" "}
          {card.system.active ? (
            <Button onClick={handleClickDeactivate}>
              <Translate>Deactivate</Translate>
            </Button>
          ) : (
            <Button onClick={handleClickActivate}>
              <Translate>Activate</Translate>
            </Button>
          )}
          <div css={{ flex: 1 }} />
          <Link to={edit()}>
            Edit <FaArrowRight css={{ verticalAlign: "bottom" }} />
          </Link>
        </div>
        <div
          css={{
            flex: 1,
            opacity: card.system.active ? 1 : 0.5,
            transition: "opacity 200ms ease-in-out",
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
          }}
        >
          <CardDisplay card={card} showCategory={true} viewMode="full" />
        </div>
      </div>
      <SlideInNestedPanelRoute
        direction={edit}
        css={{ display: "flex", flexDirection: "column" }}
      >
        <div
          className="fooey"
          css={{
            // ...absoluteCover,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardMain card={card} />
        </div>
      </SlideInNestedPanelRoute>
    </Router>
  );
};
