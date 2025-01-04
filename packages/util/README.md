<p>
    <a href="https://www.npmjs.com/package/@npmversion/util">
    <img src="https://img.shields.io/npm/v/@npmversion/util" alt="npm version">
  </a>

  <a href="https://packagephobia.now.sh/result?p=@npmversion/util">
    <img src="https://packagephobia.now.sh/badge?p=@npmversion/util" alt="install size">
  </a>

  <a href="https://snyk.io/test/github/rochejul/npmversion">
    <img src="https://snyk.io/test/github/rochejul/npmversion/badge.svg?targetFile=packages/core/package.json" alt="Known Vulnerabilities">
  </a>

  <a href="https://github.com/rochejul/npmversion/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@npmversion/util.svg" alt="license">
  </a>
</p>

# @npmversion/util

Some utilities methods for the side packages

## Usage

### Method `loadPackageJson`

It will load the `package.json` file of the current context and exposes important information from the [PackageJson model](./src/config/model.js)
It allows one parameter:

- cwd (`string`): optional parameter. Otherwise it uses `process.cwd()`

### Method `readFile`

A simple method to load the content of a file

- filePath (`string`): required parameter.

### Method `promisedExec`

It executes the provided command in a shell

- command (`string`): required parameter.
- silent (`boolean`): optional parameter. If true it display in the console output the results of the command
- cwd (`string`): optional parameter. Otherwise it uses `process.cwd()`

## Commands

- `npm run dev:linting`: Lint files
- `npm test`: Run tests
- `npm run test:coverage`: Run tests and see coverage reports

## Contributing

- [Guidelines](../../docs/GUIDELINES.md)
- [Contributing](../../docs/CONTRIBUTING.md)
- [Code of conducts](../../docs/CODE_OF_CONDUCTS.md)
