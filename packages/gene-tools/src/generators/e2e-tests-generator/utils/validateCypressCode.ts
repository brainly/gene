import { ESLint } from 'eslint';

export const validateCypressCode = async (code: string) => {
  const eslint = new ESLint({
    overrideConfig: {
      extends: ['plugin:cypress/recommended'],
      rules: {
        'babel/new-cap': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
      env: {
        'cypress/globals': true,
      },
    },
  });

  const results = await eslint.lintText(code, { filePath: 'fakepath.ts' });

  if (results && results.length > 0) {
    const errors = results[0]?.messages.map(
      (msg) => `${msg.line}:${msg.column} - ${msg.message} (${msg.ruleId})`,
    );
    return { isValid: false, errors: JSON.stringify(errors) };
  } else {
    return { isValid: true, errors: '' };
  }
};
