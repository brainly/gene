export interface BrainlyModuleGenerator {
  name: string;
  appName?: string;
  errorBoundary?: boolean;
  e2e?: boolean;
  shouldAutoprefix?: boolean;
}
