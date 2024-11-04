# Pull Request Guidelines

Thank you for contributing to our project! To help streamline the review process, please ensure that your pull request adheres to the following guidelines.

## PR Title Format

All pull requests must follow the Conventional Commits format. This is crucial for automated changelog generation and semantic versioning. Your PR title should look like one of the following:

- `feat(scope): description` for new features.
- `fix(scope): description` for bug fixes.
- `docs(scope): description` for documentation changes.
- `style(scope): description` for code style changes (formatting, missing semicolons, etc.).
- `refactor(scope): description` for code changes that neither fix a bug nor add a feature.
- `perf(scope): description` for performance improvements.
- `test(scope): description` for adding missing tests or correcting existing tests.
- `build(scope): description` for changes that affect the build system or external dependencies.
- `ci(scope): description` for changes to our CI configuration files and scripts.
- `chore(scope): description` for other changes that don't modify src or test files.
- `revert(scope): description` for reverting a previous commit.

### Scope

The `scope` should be the package or area of the project affected by the change, enclosed in parentheses. For changes affecting the entire project or where the scope is not applicable, you may omit the scope.

### Description

The `description` should be a concise explanation of the changes. Start with a lowercase letter and do not end with a period.

## Example PR Titles

- `feat(authentication): implement JWT authentication`
- `fix(database): resolve connection timeout issue`
- `docs(readme): update installation instructions`

## Additional Information

- Include any additional details about your PR in this section.
- If your PR includes multiple commits, consider squashing them into a single commit that follows the Conventional Commits format.
- Attach any relevant issue numbers or references.

Thank you for helping us improve our project!
