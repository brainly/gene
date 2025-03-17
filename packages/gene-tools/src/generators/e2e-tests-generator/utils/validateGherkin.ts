import {
  AstBuilder,
  GherkinClassicTokenMatcher,
  Parser,
  compile,
} from '@cucumber/gherkin';
import { IdGenerator } from '@cucumber/messages';

const uuidFn = IdGenerator.uuid();
const builder = new AstBuilder(uuidFn);
const matcher = new GherkinClassicTokenMatcher(); // or Gherkin.GherkinInMarkdownTokenMatcher()
const parser = new Parser(builder, matcher);

export const isValidGherkin = ({
  gherkinString,
}: {
  gherkinString: string;
}): { isValid: boolean; error?: string } => {
  try {
    const gherkinDocument = parser.parse(gherkinString);
    compile(gherkinDocument, 'uri_of_the_feature.feature', uuidFn);

    return { isValid: true };
  } catch (error: any) {
    return { isValid: false, error: error.message };
  }
};
