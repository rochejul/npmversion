<p>
    <a href="https://www.npmjs.com/package/@npmversion/workspace">
    <img src="https://img.shields.io/npm/v/@npmversion/workspace" alt="npm version">
  </a>

  <a href="https://packagephobia.now.sh/result?p=@npmversion/workspace">
    <img src="https://packagephobia.now.sh/badge?p=@npmversion/workspace" alt="install size">
  </a>

  <a href="https://snyk.io/test/github/rochejul/npmversion">
    <img src="https://snyk.io/test/github/rochejul/npmversion/badge.svg?targetFile=packages/core/package.json" alt="Known Vulnerabilities">
  </a>

  <a href="https://github.com/rochejul/npmversion/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@npmversion/workspace.svg" alt="license">
  </a>
</p>

# @npmversion/workspace

This package deals with NPM packages for the tool

## Usage

### Method `updatePackageVersion`

It will update the package version in the `package.json` from the current context.
It will also update the NPM packages declared in the `package.json`.

It allows the following parameters:

- packageVersion (`string`): required parameter.
- cwd (`string`): optional parameter. Otherwise it uses `process.cwd()`

### Method `computeWorkspace`

It will read the NPM packages declared in the `package.json` and returns an appropriate [Workspace model](./src/model/workspace.js)

It allows the following parameters:

- cwd (`string`): optional parameter. Otherwise it uses `process.cwd()`

## Commands

- `npm run dev:linting`: Lint files
- `npm test`: Run tests
- `npm run test:coverage`: Run tests and see coverage reports

## Contributing

- [Guidelines](../../docs/GUIDELINES.md)
- [Contributing](../../docs/CONTRIBUTING.md)
- [Code of conducts](../../docs/CODE_OF_CONDUCTS.md)
