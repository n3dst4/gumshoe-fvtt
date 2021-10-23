/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom";
// import { assertGame } from "../../functions";

interface RollMessageProps {
  msg: ChatMessage;
}

const RollMessage: React.FC<RollMessageProps> = React.memo(({
  msg,
}) => {
  // assertGame(game);
  const [x, setX] = useState(0);
  const incX = useCallback(() => {
    setX((x) => x + 1);
  }, []);
  return (
    <div>
      <div>
        Result from React, take 2: {msg.roll?.result}
      </div>
      <div>
        Counter: {x}; <a onClick={incX}>Inc++</a>
      </div>
    </div>
  );
});

export const installChatMessageWrangler = () => {
  Hooks.on("renderChatMessage", (chatMessage, html, options) => {
    const el = html.find(".investigator-ability-test").get(0);
    if (el) {
      ReactDOM.render(<RollMessage msg={chatMessage} />, el);
    }
  });
};
