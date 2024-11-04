export interface SubappGenerator {
  name: string;
  library: string;
  directory: string;
  getHandler: boolean;
  postHandler: boolean;
}
