import { fromZodError } from "zod-validation-error";

import { SettingsDict, superValidator } from "./settings";

export function validateImportedSettings(rawText: string) {
  const candidateSettings = JSON.parse(rawText);

  try {
    const newSettings: Partial<SettingsDict> =
      superValidator.parse(candidateSettings);
    return newSettings;
  } catch (e) {
    throw fromZodError(e as any);
  }
}
