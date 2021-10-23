import { ChatOptions } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/foundry.js/roll";

export class InvestigatorRoll extends Roll {
  async render (chatOptions?: ChatOptions | undefined) {
    return `Result: ${this.result}`;
  }
}
