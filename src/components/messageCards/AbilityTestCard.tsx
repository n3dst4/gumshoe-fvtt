/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useRef, useState } from "react";
import ReactDOM from "react-dom";

interface AbilityTestCardProps {
  msg: ChatMessage;
}

const AbilityTestCard: React.FC<AbilityTestCardProps> = React.memo(({
  msg,
}) => {
  const renderCountRef = useRef(0);
  const [x, setX] = useState(0);
  const incX = useCallback(() => {
    setX((x) => x + 1);
  }, []);

  renderCountRef.current++;
  return (
    <div
      css={{
        position: "relative",
      }}
    >
      <div>
        Result for {msg.getRollData}: {msg.roll?.result}
      </div>
      <div>
        Counter: {x}; <a onClick={incX}>Inc++</a>
      </div>
      <div>
        Render count: {renderCountRef.current}
      </div>
    </div>
  );
});

export const installAbilityTestCardChatWrangler = () => {
  Hooks.on("renderChatMessage", (chatMessage, html, options) => {
    const el = html.find(".investigator-ability-test").get(0);
    logger.log("chatMessage: ", chatMessage);
    if (el) {
      ReactDOM.render(<AbilityTestCard msg={chatMessage} />, el);
    }
  });
};
