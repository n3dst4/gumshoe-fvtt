import { pc } from "../constants";

export const _moveOldNotesToNewNoteSlots = (data: any, updateData: any) => {
  if (data.type === pc) {
    const hasOldNotes = !!(
      data.data.drive ||
      data.data.occupationalBenefits ||
      data.data.pillarsOfSanity ||
      data.data.sourcesOfStability ||
      data.data.notes ||
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
        data.data.notes || "",
        data.data.background || "",
      ];
      updateData.data.drive = null;
      updateData.data.occupationalBenefits = null;
      updateData.data.pillarsOfSanity = null;
      updateData.data.sourcesOfStability = null;
      updateData.data.notes = null;
      updateData.data.background = null;
    }
  }
  return updateData;
};
