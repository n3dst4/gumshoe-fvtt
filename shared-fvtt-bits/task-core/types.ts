export interface Config {
  rootPath: string;
  publicPath: string;
  manifestName: string;
  buildPath: string;
}

export interface TaskArgs {
  publicPath: string;
  manifestName: string;
  manifestPath: string;
  buildPath: string;
  linkDir: string | undefined;
  rootPath: string;
  manifest: any;
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
