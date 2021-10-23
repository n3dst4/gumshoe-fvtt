/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useRef, useState } from "react";
import ReactDOM from "react-dom";

interface RollMessageProps {
  msg: ChatMessage;
}

const RollMessage: React.FC<RollMessageProps> = React.memo(({
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
        Result from React, take 2: {msg.roll?.result}
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

export const installChatMessageWrangler = () => {
  Hooks.on("renderChatMessage", (chatMessage, html, options) => {
    const el = html.find(".investigator-ability-test").get(0);
    if (el) {
      ReactDOM.render(<RollMessage msg={chatMessage} />, el);
    }
  });
};
