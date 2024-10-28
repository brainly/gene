# [Beta] E2E Tests Generator

This generator adds E2E Scenario + Typescript Cypress corresponding code for given module based on its code and user input. Uses Open AI GPT 4.0 under the hood.

**This generator require your own OpenAI Access Token in this stage. This generator will be improved in undisclosed future.**

## Usage

### Example run:

```
OPENAI_TOKEN=<your-openai-token> yarn nx workspace-generator e2e-tests-generator

Welcome to E2E Tests Generator!
? Which module library do you want to generate e2e tests for?

Type to search header-navigation-sso-box-module
? Please describe in few words what this module is doing (e.g. "This module is for adding classes, then user is redirected to class view, adding can fail - this force
for displaying error message."). This will makes scenarios closer to the real life. this module displays buttons to authenticate via facebook/google/apple and after th
is authentication, registration/login form is being opened
Analyzing components inside lib/core/NavigationSsoBoxModule.tsx
Generating Gherkin Scenarios
--------- Your Gherkin Scenarios ---------

Feature: User Authentication and Registration

  Scenario: User navigates the Single Sign-On Box
    Given I am on the Navigation Single Sign-On Box component
    When I click on the Bubble element
    Then I see the Single Sign-On options displayed

  Scenario: User navigates the Mobile Single Sign-On Box
    Given I am on the Navigation Mobile Single Sign-On Box component
    When I click on the Dialog element
    Then I see the Single Sign-On options displayed on mobile

  Scenario: User views the Registration Disclaimer
    Given I am on the Registration Disclaimer component
    Then I see the disclaimer text displayed

  Scenario: User authenticates via Facebook
    Given I am on the Facebook Single Sign-On component
    When I click on the Button element
    Then I see the Facebook authentication process initiated

  Scenario: User authenticates via Apple
    Given I am on the Apple Single Sign-On component
    When I click on the Button element
    Then I see the Apple authentication process initiated

  Scenario: User authenticates via Google
    Given I am on the Google Single Sign-On component
    When I click on the div element
    Then I see the Google authentication process initiated

--------- ---------------------- ---------

? Is there anything you want to change about the results? Yes
? What would you like to change? please remove first 3 scenarios, in google scenario in second step you should click google button element. In all scenarios first step should be I
 see NavigationSsoBoxModule
--------- Your Gherkin Scenarios ---------

Feature: User Authentication and Registration

  Scenario: User authenticates via Facebook
    Given I see the Navigation Single Sign-On Box component
    When I click on the Facebook Button element
    Then I see the Facebook authentication process initiated

  Scenario: User authenticates via Apple
    Given I see the Navigation Single Sign-On Box component
    When I click on the Apple Button element
    Then I see the Apple authentication process initiated

  Scenario: User authenticates via Google
    Given I see the Navigation Single Sign-On Box component
    When I click on the Google Button element
    Then I see the Google authentication process initiated

--------- ---------------------- ---------

? Is there anything you want to change about the results? No
Generating Cypress code
--------- Your Cypress Code ---------

import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

const visitNavigationSSOBox = () => {
  cy.findByTestId('navigation_ssobox').should('be.visible');
};

Given('I see the Navigation Single Sign-On Box component', visitNavigationSSOBox);

When('I click on the Facebook Button element', () => {
  cy.findByTestId('facebook_social_provider_button').click();
});
...
```
