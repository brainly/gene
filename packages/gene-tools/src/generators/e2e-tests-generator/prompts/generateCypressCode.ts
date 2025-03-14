import type { OpenAIApi } from 'openai';
// import {validateCypressCode} from '../utils/validateCypressCode';

const getCypressCodeReflectionPrompt = (
  output: string,
  gherkinScenarios: string,
  dictionaryOfElements: string,
  cypressExamples: string,
  storybookData: string,
  considerations?: string,
  error?: string,
) => `
Your task is to reflect on the <OUTPUT> according to <ORIGINAL PROMPT>.
Return improved <OUTPUT> according to <ORIGINAL PROMPT> instruction and <CONSIDERATIONS>.

${
  error
    ? `<ERROR>
${error}`
    : ''
}

<CONSIDERATIONS>
${considerations}
<OUTPUT>
${output}

<ORIGINAL PROMPT>
${getCypressCodePrompt(
  gherkinScenarios,
  dictionaryOfElements,
  cypressExamples,
  storybookData,
)}
`;

const getCypressCodePrompt = (
  gherkinScenarios: string,
  dictionaryOfElements: string,
  cypressExamples: string,
  storybookData: string,
) => `
<ROLE>: You are an expert in quality assurance and you are working on writing E2E test in Cypress based on given Gherkin Scenarios.

<COMMAND>: Your task is to based on <GHERKIN SCENARIOS> create E2E Cypress tests in typescript file using only the elements from <DICTIONARY OF ELEMENTS>. Assume your <ROLE>. Prepare E2E typescript file using <GHERKIN SCENARIOS> as source of truth and as an output try following <EXAMPLES>  and return it according to <OUTPUT FORMAT> and <STORYBOOK LINKS>. During creating a code remember to not repeat the same steps, but create reusable steps with dynamic parameters using Cypress functions.

<GHERKIN SCENARIOS>
${gherkinScenarios}

<STORYBOOK LINKS>
${storybookData}

<DICTIONARY OF ELEMENTS>: The structure of dictionary elements consists of:
- Scenario name
- Component Name
- Data Test ID
- User Interaction
- Element

${dictionaryOfElements}

<OUTPUT FORMAT>:
Do not disclose explanations. Do not disclose notes.
Prepare <DATA> according to <OUTPUT FORMAT>.
Do not disclose in your answer anything except output according to EXAMPLE OUTPUT.
It's required to generate output format as Typescript file with Cypress commands structured in the way that test is based step by step having for example:
- "Given('I visit create class flow story', () => {
  cy.visit('/iframe.html?id=classcreationmodule--core-create-class-flow');
});"
- "When('I select subject {string} and grade {string}', (subject, grade) => {
  cy.findByTestId('class_creation_subject_field').click();
  cy.findByText(subject).click();
  cy.findByTestId('class_creation_grade_field').click();
  cy.findByText(grade).click();
})";
- "Then('{string} appears as classname value', (value: string) => {
  cy.findByTestId('class_creation_classname_field').should(
    'contain.value',
    value
  );
});"

<EXAMPLES>: That's the example of the Typescript file with Cypress command based on Gherkin Scenarios. Each example have structure:
- INPUT
- OUTPUT

${cypressExamples}
`;

const cypressExamples = `
INPUT
Scenario: Display proper elements for ClassCreation
    Given I visit create class flow story
    Then I can see all required elements, header, description, subject, grade, classname, createClassButton"

OUTPUT:
import {Given, Then, And, When} from 'cypress-cucumber-preprocessor/steps';

Given('I visit create class flow story', () => {
  cy.visit('/iframe.html?id=classcreationmodule--core-create-class-flow');
});

Then(
  'I can see all required elements, header, description, subject, grade, classname, createClassButton',
  () => {
    cy.findByTestId('classroom-form-header').should('be.visible');
    cy.findByTestId('classroom-form-description').should('be.visible');
    cy.findByTestId('class_creation_subject_field').should('be.visible');
    cy.findByTestId('class_creation_grade_field').should('be.visible');
    cy.findByTestId('class_creation_classname_field').should('be.visible');
    cy.findByTestId('class_creation_base_form_submit').should('be.visible');
  }
);

INPUT
Scenario: Error when subject is not provided
    Given I visit create class flow story
    And subject input is empty, grade and classname is filled
    When I click Create class button
    Then "Please select the subject." error message is displayed"

OUTPUT
import {Given, Then, And, When} from 'cypress-cucumber-preprocessor/steps';

Given('I visit create class flow story', () => {
  cy.visit('/iframe.html?id=classcreationmodule--core-create-class-flow');
});

And('subject input is empty, grade and classname is filled', () => {
  cy.findByTestId('class_creation_grade_field').click();
  cy.findByText('College').click();
  cy.findByTestId('class_creation_classname_field').type('My classname');
});

When('I click Create class button', () => {
  cy.findByTestId('class_creation_base_form_submit').click();
});

And('{string} error message is displayed', message => {
  cy.findByText(message).should('be.visible');
});

INPUT
Scenario: Classname is autofilled based on subject and grade
    Given I visit create class flow story
    When I select subject "History" and grade "College"
    Then "History College" appears as classname value"

OUTPUT
import {Given, Then, And, When} from 'cypress-cucumber-preprocessor/steps';

Given('I visit create class flow story', () => {
  cy.visit('/iframe.html?id=classcreationmodule--core-create-class-flow');
});

When('I select subject {string} and grade {string}', (subject, grade) => {
  cy.findByTestId('class_creation_subject_field').click();
  cy.findByText(subject).click();
  cy.findByTestId('class_creation_grade_field').click();
  cy.findByText(grade).click();
});When('I click Create class button', () => {
  cy.findByTestId('class_creation_base_form_submit').click();
});

Then('{string} appears as classname value', (value: string) => {
  cy.findByTestId('class_creation_classname_field').should(
    'contain.value',
    value
  );
});`;

const generateCypressCode = async (
  openai: OpenAIApi,
  gherkinScenarios: string,
  dictionaryOfElements: string,
  storybookData: string,
): Promise<string> => {
  const completion = await openai.createChatCompletion({
    model: 'gpt-4-0613',
    messages: [
      {
        role: 'user',
        content: getCypressCodePrompt(
          gherkinScenarios,
          dictionaryOfElements,
          cypressExamples,
          storybookData,
        ),
      },
    ],
    temperature: 0.1,
  });

  const content = completion.data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No content');
  }

  // const {isValid, errors} = await validateCypressCode(content);

  // if (!isValid) {
  //   return reflectOnCypressCode(
  //     openai,
  //     gherkinScenarios,
  //     dictionaryOfElements,
  //     content,
  //     'Fix errors given in <ERROR>',
  //     errors
  //   );
  // }

  return content;
};

const reflectOnCypressCode = async (
  openai: OpenAIApi,
  gherkinScenarios: string,
  dictionaryOfElements: string,
  previousContent: string,
  storybookData: string,
  considerations?: string,
  errors?: string,
): Promise<string> => {
  const reflectionCompletion = await openai.createChatCompletion({
    model: 'gpt-4-0613',
    messages: [
      {
        role: 'user',
        content: getCypressCodePrompt(
          gherkinScenarios,
          dictionaryOfElements,
          cypressExamples,
          storybookData,
        ),
      },
      { role: 'assistant', content: previousContent },
      {
        role: 'user',
        content: getCypressCodeReflectionPrompt(
          previousContent,
          gherkinScenarios,
          dictionaryOfElements,
          cypressExamples,
          storybookData,
          considerations,
          errors,
        ),
      },
    ],
    temperature: 0.1,
  });

  const content = reflectionCompletion.data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No content');
  }

  return content;
};

export { generateCypressCode, reflectOnCypressCode };
