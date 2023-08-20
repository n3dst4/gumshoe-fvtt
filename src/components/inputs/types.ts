export type ValidationResult =
  | {
      state: "failed";
      reasons: string[];
    }
  | {
      state: "succeeded";
      value: number;
    };
