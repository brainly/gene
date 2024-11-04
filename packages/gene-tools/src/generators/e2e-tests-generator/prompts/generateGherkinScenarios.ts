import type {OpenAIApi} from 'openai';
import {isValidGherkin} from '../utils/validateGherkin';

const getGherkinReflectionPrompt = ({
  previousOutput,
  input,
  considerations,
  devDescription,
  error,
}: {
  previousOutput: string;
  input: string;
  considerations?: string;
  devDescription?: string;
  error?: string;
}) => `
  Your task is to reflect on the <OUTPUT> according to <ORIGINAL PROMPT>.
  Return improved <OUTPUT> according to <ORIGINAL PROMPT> instruction and <CONSIDERATIONS>${
    error ? 'and <ERROR>.' : '.'
  }.

  ${
    error
      ? `
  <ERROR>
  ${error}
  `
      : ''
  }

  <CONSIDERATIONS>
  ${considerations}
  <OUTPUT>
  ${previousOutput}

  <ORIGINAL PROMPT>
  ${getGherkinPrompt({input, devDescription})}
  `;

const getGherkinPrompt = ({
  input,
  devDescription,
}: {
  input: string;
  devDescription?: string;
}) => `
PROMPT
Context: Improving the User Experience in Our Web Application.

ROLE:  You are a software developer writing Gherkin tests that will later be translated to TypeScript files with Cypress E2E runner.

DEV DESCRIPTION:
${devDescription}

COMMAND: Given the detailed user-interface interactions provided, deduce the potential scenarios that would help understand how users engage with our application's components. From the details provided about user-interface components, let's describe potential user experiences and how the system might respond.
INPUT:
${input}

Each item should be a dictionary with the structure:
* humanReadableElementName: A description of the component that non-developers can understand.
* componentName: The technical name of the component.
* dataTestId: A string representing the testing identifier of the component.
* userInteraction: The type of user interaction (e.g., 'click', 'display', 'type').

OUTPUT FORMAT:
* Start with "Scenario: [name of the scenario using humanReadableElementName]"
* "Given [come up with a base scenario for the test]"
* If there's an actionable userInteraction (like 'click' or 'type' or 'navigate'), include "When [come up with a Gherkin like when statement for the scenario]"
* "Then  [provide an intuitive and comprehensible reaction to that interaction]".

Use the Gherkin Given-When-Then format.
The output format should consider managerial language in the first place, using first person language.
The output should be pasteable to .feature files without any modification.
Do not disclose explanations. Do not disclose notes.
Prepare <DATA> according to <OUTPUT FORMAT>.
Do not disclose in your answer anything except output according to EXAMPLE OUTPUT.
Figure out the FEATURE from the input and context.

EXAMPLE OUTPUTS:

Feature: The answer answer API is a back-end-for-front ed (BFF) API for Android
  Scenario: Explain More Rating
    Given I make a POST request to rate an explained answer
    Then I receive a valid response for the explained answer rating


  Scenario: Follow Up
    Given I make a POST request to get a follow up answer
    Then I receive a follow up answer

  Scenario: Follow Up Answer Rating V1
    Given I make a POST request to rate a follow up answer V1
    Then I receive a valid response for the follow up answer rating V1


  Scenario: Simplify Answer V1
    Given I make a POST request to simplify and answer V1
    Then I receive a simplified V1 response


  Scenario: Simplify Answer Rating V1
    Given I make a POST request to rate a simplified answer V1
    Then I receive a valid V1 response

  Feature: Class Creation

    Scenario: User tries to add a class and gets success
      Given I am on the Class creation base form module
      When I click on the Subject dropdown
      And I click on the Grade dropdown
      And I type in the Class name input
      And I click on the Submit button
      Then I see the class has been successfully added

    Scenario: User tries to add a class and gets an error
      Given I am on the Class creation base form module
      When I click on the Subject dropdown
      And I click on the Grade dropdown
      And I type in the Class name input
      And I click on the Submit button
      Then I see an Error message displayed on the screen
`;

export const generateGherkinScenarios = async ({
  openai,
  componentDescriptions,
  devDescription,
}: {
  openai: OpenAIApi;
  componentDescriptions: string;
  devDescription?: string;
}): Promise<string> => {
  const completion = await openai.createChatCompletion({
    model: 'gpt-4-0613',
    messages: [
      {
        role: 'user',
        content: getGherkinPrompt({
          input: componentDescriptions,
          devDescription,
        }),
      },
    ],
    temperature: 0.5,
  });

  const content = completion.data?.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No content');
  }

  const validationResult = isValidGherkin({
    gherkinString: content,
  });

  if (!validationResult.isValid) {
    return reflectOnGherkinScenarios({
      openai,
      componentDescriptions,
      previousOutput: content,
      devDescription,
      considerations: 'Fix errors given in <ERROR>',
      error: validationResult.error,
    });
  }

  return content;
};

export const reflectOnGherkinScenarios = async ({
  openai,
  componentDescriptions,
  previousOutput,
  devDescription,
  considerations,
  error,
}: {
  openai: OpenAIApi;
  componentDescriptions: string;
  previousOutput: string;
  devDescription?: string;
  considerations?: string;
  error?: string;
}): Promise<string> => {
  const reflectionCompletion = await openai.createChatCompletion({
    model: 'gpt-4-0613',
    messages: [
      {
        role: 'user',
        content: getGherkinPrompt({
          input: componentDescriptions,
          devDescription,
        }),
      },
      {role: 'assistant', content: previousOutput},
      {
        role: 'user',
        content: getGherkinReflectionPrompt({
          previousOutput,
          input: componentDescriptions,
          considerations,
          devDescription,
          error,
        }),
      },
    ],
    temperature: 0.3,
  });

  const content = reflectionCompletion.data?.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No content');
  }

  const validationResult = isValidGherkin({
    gherkinString: content,
  });

  if (!validationResult.isValid) {
    return reflectOnGherkinScenarios({
      openai,
      componentDescriptions,
      previousOutput: content,
      devDescription,
      considerations: 'Fix errors given in <ERROR>',
      error: validationResult.error,
    });
  }

  return content;
};
