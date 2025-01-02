import * as Gherkin from '@cucumber/gherkin';
import * as Messages from '@cucumber/messages';

const uuidFn = Messages.IdGenerator.uuid();
const builder = new Gherkin.AstBuilder(uuidFn);
const matcher = new Gherkin.GherkinClassicTokenMatcher(); // or Gherkin.GherkinInMarkdownTokenMatcher()
const parser = new Gherkin.Parser(builder, matcher);

export const isValidGherkin = ({
  gherkinString,
}: {
  gherkinString: string;
}): { isValid: boolean; error?: string } => {
  try {
    const gherkinDocument = parser.parse(gherkinString);
    Gherkin.compile(gherkinDocument, 'uri_of_the_feature.feature', uuidFn);

    return { isValid: true };
  } catch (error: any) {
    return { isValid: false, error: error.message };
  }
};
