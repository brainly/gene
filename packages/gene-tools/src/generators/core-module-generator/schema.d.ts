export interface BrainlyCoreModuleGenerator {
  name: string;
  directory: string;
  tags: string;
  errorBoundary?: boolean;
}
