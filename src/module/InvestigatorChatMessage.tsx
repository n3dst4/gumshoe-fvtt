// import { assertGame } from "../functions";

export class InvestigatorChatMessage extends ChatMessage {
  async getHTML () {
    // return super.getHTML();
    return jQuery(`
      <p>Helloe</p>
    `);
  }
}
