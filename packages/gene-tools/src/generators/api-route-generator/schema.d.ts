export interface APIRouteGenerator {
    name: string;
    directory: string;
    wrapWithSentry: boolean;
    addCors: boolean;
  }
  