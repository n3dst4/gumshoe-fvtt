import { RecursivePartial } from "../types";

export type ExportedCompendium = {
  name: string,
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
  assertIsImportCandidate(candidate);
  if (candidate.name === undefined) {
    throw new Error("Candidate compendium did not contain a name");
  }
  if (candidate.entity === undefined) {
    throw new Error("Candidate compendium did not contain an entity");
  }
  if (candidate.contents === undefined || candidate.contents.length === undefined) {
    throw new Error("Candidate compendium did not contain any contents");
  }
  const verified = candidate as ExportedCompendium;
  const pack = await CompendiumCollection.createCompendium({
    entity: verified.entity,
    label: verified.name,
    name: verified.name.toLowerCase().replace(/\s+/g, "-").replace(/^-a-z0-9/g, ""),
    path: "",
    private: false,
    package: "world",
  }, { });
  console.log(pack);
};
