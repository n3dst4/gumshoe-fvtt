import { pc } from "../constants";
import { escape } from "html-escaper";
import * as constants from "../constants";

export const moveOldNotesToNewNoteSlots = (data: any, updateData: any) => {
  if (data.type === pc) {
    const hasOldNotes = !!(
      data.data.drive ||
      data.data.occupationalBenefits ||
      data.data.pillarsOfSanity ||
      data.data.sourcesOfStability ||
      data.data.background
    );

    if (hasOldNotes) {
      if (!updateData.data) {
        updateData.data = {};
      }
      updateData.data.shortNotes = [
        data.data.drive || "",
      ];
      updateData.data.longNotes = [
        data.data.occupationalBenefits || "",
        data.data.pillarsOfSanity || "",
        data.data.sourcesOfStability || "",
        data.data.background || "",
      ];
      updateData.data.drive = null;
      updateData.data.occupationalBenefits = null;
      updateData.data.pillarsOfSanity = null;
      updateData.data.sourcesOfStability = null;
      updateData.data.background = null;
    }
  }
  return updateData;
};

export const upgradeLongNotesToRichText = (data: any, updateData: any) => {
  let updateNeeded = false;
  if (data.type === constants.pc) {
    const newLongNotes: any[] = [];
    for (const note of data.data.longNotes) {
      if (typeof note === "string") {
        updateNeeded = true;
        newLongNotes.push({
          format: "plain",
          source: note,
          html: escape(note),
        });
      } else {
        newLongNotes.push(note);
      }
    }
    if (updateNeeded) {
      if (!updateData.data) {
        updateData.data = {};
      }
      updateData.data.longNotesFormat = "plain";
      updateData.data.longNotes = newLongNotes;
    }
  }
  if (data.type === constants.npc) {
    if (typeof data.data.notes === "string") {
      if (!updateData.data) {
        updateData.data = {};
      }
      updateData.data.notes = {
        format: "plain",
        source: data.data.notes,
        html: escape(data.data.notes),
      };
    }
  }
  return updateData;
};

const MINUS_LIKE_A_BILLION = -1_000_000_000;

export const moveStats = (data: any, updateData: any) => {
  if (
    (data.type === constants.pc || data.type === constants.npc) &&
    data.data.hitThreshold !== MINUS_LIKE_A_BILLION
  ) {
    if (!updateData.data) {
      updateData.data = {};
    }
    if (!updateData.data.stats) {
      updateData.data.stats = {};
    }
    updateData.data.stats.hitThreshold = data.data.hitThreshold;
    updateData.data.stats.armor = data.data.armor;
    updateData.data.stats.alertness = data.data.alertness;
    updateData.data.stats.stealth = data.data.stealth;
    updateData.data.stats.stabilityLoss = data.data.stabilityLoss;
    updateData.data.hitThreshold = MINUS_LIKE_A_BILLION;
  }
};
