/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { getDefaultThemeName } from "../../settingsHelpers";
import { themes } from "../../themes/themes";
import { CSSReset, CSSResetMode } from "../CSSReset";
// import { assertGame } from "../../functions";

interface RollMessageProps {
  msg: ChatMessage;
}

const RollMessage: React.FC<RollMessageProps> = React.memo(({
  msg,
}) => {
  // assertGame(game);
  const renderCountRef = useRef(0);
  const [x, setX] = useState(0);
  const incX = useCallback(() => {
    setX((x) => x + 1);
  }, []);
  const theme = themes[getDefaultThemeName()];

  renderCountRef.current++;
  return (
    <CSSReset
      theme={theme}
      mode={CSSResetMode.small}
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
    </CSSReset>
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
