import { nanoid } from "nanoid";
import { assertGame } from "../functions";
import { RecursivePartial } from "../types";

export type ExportedCompendium = {
  name: string,
  label: string,
  entity: CompendiumCollection.Metadata["entity"],
  contents: any[],
}

export type ImportCandidate = RecursivePartial<ExportedCompendium>;

function assertIsImportCandidate (candidate: unknown): asserts candidate is ImportCandidate {
  if (!(typeof candidate === "object") || candidate === null) {
    throw new Error("Candidate compendium was not an object");
  }
}

export const importCompendium = async (candidate: unknown) => {
  assertGame(game);
  assertIsImportCandidate(candidate);
  if (candidate.name === undefined) {
    throw new Error("Candidate compendium did not contain a name");
  }
  if (candidate.label === undefined) {
    throw new Error("Candidate compendium did not contain a label");
  }
  if (candidate.entity === undefined) {
    throw new Error("Candidate compendium did not contain an entity");
  }
  if (candidate.contents === undefined || candidate.contents.length === undefined) {
    throw new Error("Candidate compendium did not contain any contents");
  }
  const verified = candidate as ExportedCompendium;
  const name = `${verified.name}-${nanoid()}`;
  logger.log(`creating pack ${name}`);
  const pack = await CompendiumCollection.createCompendium({
    entity: verified.entity,
    label: verified.label,
    name,
    path: "",
    private: false,
    package: "world",
  }, { });

  console.log(pack);
};
