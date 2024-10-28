export interface Options {
  name: string;
}

export interface NormalizedOptions extends Options {
  isLibrary: boolean;
  projectRoot: string;
  storybookDir: string;
}
