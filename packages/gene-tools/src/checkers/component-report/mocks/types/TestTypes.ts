import {DoubleImportedInterface} from './AnotherTypes';

export type TestIntersectionType = Readonly<{
  foo: string;
}>;

export interface TestLiteralType {
  bar: number;
}

export type TestIntersectionTypeWithCallback = Readonly<{
  onClick: () => 1;
}>;

export interface TestImportedInterface
  extends TestIntersectionType,
    DoubleImportedInterface {
  zuzu: boolean;
}

export interface TestInvalidImportedInterface
  extends TestIntersectionTypeWithCallback {
  dydy: number;
}
