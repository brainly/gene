export interface BrainlyNextJSAppGenerator {
  name: string;
  directory?: string;
  tags?: string;
  rewrites?: boolean;
  apollo: boolean;
  reactQuery: boolean;
  e2e?: boolean;
}
