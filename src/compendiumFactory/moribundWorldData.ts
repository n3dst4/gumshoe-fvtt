import { GeneralAbilitiesData, InvestigativeAbilitiesData } from "./types";

export const investigativeAbilities: InvestigativeAbilitiesData = {};

export const generalAbilities: GeneralAbilitiesData = {
  Persuade: [
    { name: "Glib", hideIfZeroRated: true },
    { name: "Eloquent", hideIfZeroRated: true },
    { name: "Obfuscatory ", hideIfZeroRated: true },
    { name: "Forthright", hideIfZeroRated: true },
    { name: "Charming", hideIfZeroRated: true },
    { name: "Intimidating", hideIfZeroRated: true },
  ],
  Rebuff: [
    { name: "Obtuse", hideIfZeroRated: true },
    { name: "Wary", hideIfZeroRated: true },
    { name: "Penetrating", hideIfZeroRated: true },
    { name: "Lawyerly", hideIfZeroRated: true },
    { name: "Contrary", hideIfZeroRated: true },
    { name: "Pure-Hearted", hideIfZeroRated: true },
  ],
  Attack: [
    { name: "Strength", hideIfZeroRated: true },
    { name: "Speed", hideIfZeroRated: true },
    { name: "Finesse", hideIfZeroRated: true },
    { name: "Cunning", hideIfZeroRated: true },
    { name: "Ferocity", hideIfZeroRated: true },
    { name: "Caution", hideIfZeroRated: true },
  ],
  Defense: [
    { name: "Dodge", hideIfZeroRated: true },
    { name: "Parry", hideIfZeroRated: true },
    { name: "Sure-Footedness", hideIfZeroRated: true },
    { name: "Intuition", hideIfZeroRated: true },
    { name: "Misdirection", hideIfZeroRated: true },
    { name: "Vexation", hideIfZeroRated: true },
  ],
  Resist: [
    { name: "Arrogance" },
    { name: "Avarice" },
    { name: "Indolence" },
    { name: "Gourmandism" },
    { name: "Pettifoggery" },
    { name: "Rakishness" },
  ],
  Magic: [
    { name: "Studious", hideIfZeroRated: true },
    { name: "Insightful", hideIfZeroRated: true },
    { name: "Forceful", hideIfZeroRated: true },
    { name: "Daring", hideIfZeroRated: true },
    { name: "Devious", hideIfZeroRated: true },
    { name: "Curious", hideIfZeroRated: true },
  ],
  General: [
    { name: "Health", min: -12, rating: 1, pool: 1, showTracker: true },
    { name: "Appraisal" },
    { name: "Athletics" },
    { name: "Concealment" },
    { name: "Craftsmanship" },
    { name: "Driving" },
    { name: "Engineering" },
    { name: "Etiquette" },
    { name: "Gambling" },
    { name: "Imposture" },
    { name: "Living Rough" },
    { name: "Pedantry" },
    { name: "Perception" },
    { name: "Physician" },
    { name: "Quick Fingers" },
    { name: "Riding" },
    { name: "Scuttlebutt" },
    { name: "Seamanship" },
    { name: "Seduction" },
    { name: "Stealth" },
    { name: "Stewardship" },
    { name: "Tracking" },
    { name: "Wealth" },
    { name: "Wherewithal" },
  ],
};
