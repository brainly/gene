import { Tree } from '@nx/devkit';

type JSONValue =
  | string
  | number
  | boolean
  | JSONObject
  | JSONArray
  | null
  | undefined;

type JSONArray = JSONValue[];

export type JSONObject = Record<string, JSONValue>;

export const updateJestConfig = (
  tree: Tree,
  path: string,
  update: (current: JSONObject) => JSONObject,
  addLiteral?: () => string
) => {
  const filePath = `${path}/jest.config.ts`;
  const contents = (tree.read(filePath) || '').toString();
  const firstBracket = contents.indexOf('{');
  const lastBracket = contents.lastIndexOf('}') + 1;

  const values = contents.substring(firstBracket, lastBracket);
  const validJSONString = values
    .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ') //wrap keys with double quotes
    .replace(/'/g, '"') //replace quotes with double quotes
    .replace(/,(?!\s*?[{["'\w])/g, ''); //remove trailing commas

  const json = JSON.parse(validJSONString);

  const updated = update(json);
  let updatedString = JSON.stringify(updated);
  // Add the literal string to the updated object
  if (addLiteral) {
    updatedString = addLiteralEntry(addLiteral, updatedString);
  }

  const content = `/* eslint-disable */
  export default ${updatedString}`;
  tree.write(filePath, content);
};

function addLiteralEntry(
  addLiteral: () => string,
  updatedString: string
): string {
  const lastClosingBracketIndex = updatedString.lastIndexOf('}');
  const literalEntry = addLiteral();

  // If a comma is needed before the literal entry.
  const comma = literalEntry.startsWith(',') ? '' : ',';

  // Construct the updated string by inserting the literal entry before the last closing bracket.
  const updatedStringWithLiteral = [
    updatedString.slice(0, lastClosingBracketIndex), // Part of the string before the last closing bracket.
    comma, // Comma if needed.
    literalEntry, // Literal entry to be added.
    updatedString.slice(lastClosingBracketIndex), // Part of the string after the last closing bracket.
  ].join('');

  return updatedStringWithLiteral;
}
