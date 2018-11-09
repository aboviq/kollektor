# Contribution Guidelines

**Thank you for considering contributing to our project!**

Please note that this project is released with a [Contributor Code of Conduct](code-of-conduct.md). By participating in this project you agree to abide by its terms.

By following these guidelines we help eachother getting the most out of our time as possible. We want to make the process of contributing as smooth as possible which is why we automate as much as possible and have strict guidelines for code style, testing and commit messages.

## How can I contribute?

### Submit issues

No matter if you think you've found a bug, there's a typo in the documentation, you want to improve something or add a new feature to the project - submit an issue!

An issue is a good platform for discussing the current and future state of the project. Giving feedback on existing issues is a great way to contribute to the project!

#### When submitting issues

- Search existing issues for similar issues to avoid duplicates
- Use as descriptive titles and descriptions as possible
- Provide as much information as you can: steps to reproduce, expected and actual behaviour, error messages, versions (Node.js, OS, this project, etc.)
- If you can, please provide a failing test proving the issue

### Submitting a pull request

For small changes, like typos or documentation improvements, it's ok to create a PR directly. For everything else it's best to first create an issue ([see above](#submit-issues)) to ease discussions and prevent unnecessary work.

#### When submitting pull requests

- For big features it's a good practice to submit a PR before the work is complete and prepend the title with `[WIP]`, this way you get faster feedback and avoid having to rework large pieces of code
- Any [changes to a PR should be made to the existing one](https://github.com/RichardLitt/knowledge/blob/master/github/amending-a-commit-guide.md), there's no need to create a new one
- Always add tests and documentation for new features
- Don't do too much in one PR, i.e. don't change things unrelated to your PR
- Use [conventional commit messages](https://github.com/conventional-changelog-archived-repos/conventional-changelog-angular/blob/master/convention.md)
- Lint and test your code with: `npm test`
- Use decriptive title and description for your PR, describing _what_ and _why_ you made it and its _use-cases_
- Write code supported in the latest LTS version of Node.js
