export interface Config {
  rootPath: string;
  publicPath: string;
  manifestName: string;
  buildPath: string;
  packagePath: string;
}

export interface TaskArgs extends Config {
  manifestPath: string;
  linkDir: string | undefined;
  manifest: Manifest;
  log: (...args: any[]) => void;
  synchronise: (
    srcDirPath: string,
    destDirPath: string,
    log: (...args: any[]) => void,
  ) => void;
}

export type TaskFunction = ((args: TaskArgs) => void | Promise<void>) & {
  description?: string;
};

export interface BootArgs {
  config: Config;
  commands: TaskFunction[];
}

export interface PackDefinition {
  name: string;
  label: string;
  system: string;
  path: string;
  type: string;
}

/**
 * A dumb manifest type which just has the parts we need
 */
export interface Manifest {
  id: string;
  version: string;
  packs?: PackDefinition[];
  download?: string;
}

export interface FoundryConfig {
  dataPath: string;
  url?: string;
}
