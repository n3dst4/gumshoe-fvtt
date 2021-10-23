/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import ReactDOM from "react-dom";
import { assertGame } from "../functions";

interface RollMessageProps {
  msg: ChatMessage;
  roll: Roll;
}

const RollMessage: React.FC<RollMessageProps> = React.memo(({
  roll,
  msg,
}) => {
  assertGame(game);
  return (
  // <div
  //   className="chat-message message flexcol"
  //   data-message-id={msg.data._id}
  // >
  //   Roll result from React: {roll.result}
  // </div>

    <li
      className="chat-message message flexcol {{cssClass}}"
      data-message-id={msg.data._id}
      // {{#if borderColor}}style="border-color:{{borderColor}}"{{/if}}
    >
      <header className="message-header flexrow">
          <h4 className="message-sender">{msg.alias}</h4>
          <span className="message-metadata">
              <time className="message-timestamp">{timeSince(new Date(msg.data.timestamp))}</time>
              {game.user?.isGM &&
                <a className="button message-delete"><i className="fas fa-trash"></i></a>
              }
          </span>

          {msg.data.whisper &&
            <span className="whisper-to">{game.i18n.localize("CHAT.To")}: {msg.data.whisper}</span>
          }

          {msg.data.flavor &&
            <span className="flavor-text">{msg.data.flavor}</span>
          }
      </header>
      <div className="message-content">
        Roll result from React: {roll.result}
      </div>
    </li>
  );
});

export class InvestigatorChatMessage extends ChatMessage {
  async getHTML () {
    if (this.isRoll && this.roll) {
      const div = document.createElement("div");
      ReactDOM.render(<RollMessage roll={this.roll} msg={this}/>, div);
      return jQuery(div);
    } else {
      return super.getHTML();
    }
  }
}
