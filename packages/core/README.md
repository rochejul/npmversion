<p>
    <a href="https://www.npmjs.com/package/@npmversion/core">
    <img src="https://img.shields.io/npm/v/@npmversion/core" alt="npm version">
  </a>

  <a href="https://packagephobia.now.sh/result?p=@npmversion/core">
    <img src="https://packagephobia.now.sh/badge?p=@npmversion/core" alt="install size">
  </a>

  <a href="https://snyk.io/test/github/rochejul/npmversion">
    <img src="https://snyk.io/test/github/rochejul/npmversion/badge.svg?targetFile=packages/core/package.json" alt="Known Vulnerabilities">
  </a>

  <a href="https://github.com/rochejul/npmversion/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@npmversion/core.svg" alt="license">
  </a>
</p>

# @npmversion/core

Core implementation of the tool

## Usage

### Class `VersionOptions`

This a [model](./src/config/model.js) which contains all the possible options for the tool with default values.

### Method `configRetriever`

This method will search all files with the name ` .npmversionrc` in the hierarchy to load the possible configuration

### Method `versioning`

It will apply the versioning logic.
It allows two parameters:

- options (`VersionOptions` | `object` | `null`): optional parameter with the configuration to apply. Otherwise it uses the default values declared in the [model](./src/config/model.js).
- cwd (`string`): optional parameter. Otherwise it uses `process.cwd()`

## Possible outputs

### In a classical way

```
> semver 1.2.3 --increment patch                             1.2.4
> semver 1.2.3 --increment minor                             1.3.0
> semver 1.2.3 --increment major                             2.0.0
> semver 1.2.3 --increment prerelease                        1.2.4-0
> semver 1.2.3 --increment prepatch                          1.2.4-0
> semver 1.2.3 --increment preminor                          1.3.0-0
> semver 1.2.3 --increment premajor                          2.0.0-0

> semver 1.2.3-0 --increment patch                           1.2.3
> semver 1.2.3-0 --increment minor                           1.3.0
> semver 1.2.3-0 --increment major                           2.0.0
> semver 1.2.3-0 --increment prerelease                      1.2.3-1
> semver 1.2.3-0 --increment prepatch                        1.2.4-0
> semver 1.2.3-0 --increment preminor                        1.3.0-0
> semver 1.2.3-0 --increment premajor                        2.0.0-0

> semver 1.2.3-beta --increment patch                        1.2.4
> semver 1.2.3-beta --increment minor                        1.3.0
> semver 1.2.3-beta --increment major                        2.0.0
> semver 1.2.3-beta --increment prerelease                   1.2.3-beta.0
> semver 1.2.3-beta --increment prepatch                     1.2.4-0
> semver 1.2.3-beta --increment preminor                     1.3.0-0
> semver 1.2.3-beta --increment premajor                     2.0.0-0

> semver 1.2.3-beta.0 --increment patch                      1.2.4
> semver 1.2.3-beta.0 --increment minor                      1.3.0
> semver 1.2.3-beta.0 --increment major                      2.0.0
> semver 1.2.3-beta.0 --increment prerelease                 1.2.3-beta.1
> semver 1.2.3-beta.0 --increment prepatch                   1.2.4-0
> semver 1.2.3-beta.0 --increment preminor                   1.3.0-0
> semver 1.2.3-beta.0 --increment premajor                   2.0.0-0

> semver 1.2.3 --preid beta --increment patch                 1.2.4
> semver 1.2.3 --preid beta --increment minor                 1.3.0
> semver 1.2.3 --preid beta --increment major                 2.0.0
> semver 1.2.3 --preid beta --increment prerelease            1.2.4-beta.0
> semver 1.2.3 --preid beta --increment prepatch              1.2.4-beta.0
> semver 1.2.3 --preid beta --increment preminor              1.3.0-beta.0
> semver 1.2.3 --preid beta --increment premajor              2.0.0-beta.0

> semver 1.2.3-0 --preid beta --increment patch               1.2.4
> semver 1.2.3-0 --preid beta --increment minor               1.3.0
> semver 1.2.3-0 --preid beta --increment major               2.0.0
> semver 1.2.3-0 --preid beta --increment prerelease          1.2.3-beta.0
> semver 1.2.3-0 --preid beta --increment prepatch            1.2.4-beta.0
> semver 1.2.3-0 --preid beta --increment preminor            1.3.0-beta.0
> semver 1.2.3-0 --preid beta --increment premajor            2.0.0-beta.0

> semver 1.2.3-beta --preid beta --increment patch            1.2.4
> semver 1.2.3-beta --preid beta --increment minor            1.3.0
> semver 1.2.3-beta --preid beta --increment major            2.0.0
> semver 1.2.3-beta --preid beta --increment prerelease       1.2.3-beta.0
> semver 1.2.3-beta --preid beta --increment prepatch         1.2.4-beta.0
> semver 1.2.3-beta --preid beta --increment preminor         1.3.0-beta.0
> semver 1.2.3-beta --preid beta --increment premajor         2.0.0-beta.0

> semver 1.2.3-beta.0 --preid beta --increment patch          1.2.4
> semver 1.2.3-beta.0 --preid beta --increment minor          1.3.0
> semver 1.2.3-beta.0 --preid beta --increment major          2.0.0
> semver 1.2.3-beta.0 --preid beta --increment prerelease     1.2.3-beta.1
> semver 1.2.3-beta.0 --preid beta --increment prepatch       1.2.4-beta.0
> semver 1.2.3-beta.0 --preid beta --increment preminor       1.3.0-beta.0
> semver 1.2.3-beta.0 --preid beta --increment premajor       2.0.0-beta.0

```

### With the force-preid option

```
> semver 1.2.3 --increment patch                             1.2.4
> semver 1.2.3 --increment minor                             1.3.0
> semver 1.2.3 --increment major                             2.0.0
> semver 1.2.3 --increment prerelease                        1.2.4-0
> semver 1.2.3 --increment prepatch                          1.2.4-0
> semver 1.2.3 --increment preminor                          1.3.0-0
> semver 1.2.3 --increment premajor                          2.0.0-0

> semver 1.2.3-0 --increment patch                           1.2.3
> semver 1.2.3-0 --increment minor                           1.3.0
> semver 1.2.3-0 --increment major                           2.0.0
> semver 1.2.3-0 --increment prerelease                      1.2.3-1
> semver 1.2.3-0 --increment prepatch                        1.2.4-0
> semver 1.2.3-0 --increment preminor                        1.3.0-0
> semver 1.2.3-0 --increment premajor                        2.0.0-0

> semver 1.2.3-beta --increment patch                        1.2.4
> semver 1.2.3-beta --increment minor                        1.3.0
> semver 1.2.3-beta --increment major                        2.0.0
> semver 1.2.3-beta --increment prerelease                   1.2.3-beta.0
> semver 1.2.3-beta --increment prepatch                     1.2.4-0
> semver 1.2.3-beta --increment preminor                     1.3.0-0
> semver 1.2.3-beta --increment premajor                     2.0.0-0

> semver 1.2.3-beta.0 --increment patch                      1.2.4
> semver 1.2.3-beta.0 --increment minor                      1.3.0
> semver 1.2.3-beta.0 --increment major                      2.0.0
> semver 1.2.3-beta.0 --increment prerelease                 1.2.3-beta.1
> semver 1.2.3-beta.0 --increment prepatch                   1.2.4-0
> semver 1.2.3-beta.0 --increment preminor                   1.3.0-0
> semver 1.2.3-beta.0 --increment premajor                   2.0.0-0

> semver 1.2.3 --preid beta --increment patch                 1.2.4-beta
> semver 1.2.3 --preid beta --increment minor                 1.3.0-beta
> semver 1.2.3 --preid beta --increment major                 2.0.0-beta
> semver 1.2.3 --preid beta --increment prerelease            1.2.4-beta.0
> semver 1.2.3 --preid beta --increment prepatch              1.2.4-beta.0
> semver 1.2.3 --preid beta --increment preminor              1.3.0-beta.0
> semver 1.2.3 --preid beta --increment premajor              2.0.0-beta.0

> semver 1.2.3-0 --preid beta --increment patch               1.2.3-beta
> semver 1.2.3-0 --preid beta --increment minor               1.3.0-beta
> semver 1.2.3-0 --preid beta --increment major               2.0.0-beta
> semver 1.2.3-0 --preid beta --increment prerelease          1.2.3-beta.0
> semver 1.2.3-0 --preid beta --increment prepatch            1.2.4-beta.0
> semver 1.2.3-0 --preid beta --increment preminor            1.3.0-beta.0
> semver 1.2.3-0 --preid beta --increment premajor            2.0.0-beta.0

> semver 1.2.3-beta --preid beta --increment patch            1.2.4-beta
> semver 1.2.3-beta --preid beta --increment minor            1.3.0-beta
> semver 1.2.3-beta --preid beta --increment major            2.0.0-beta
> semver 1.2.3-beta --preid beta --increment prerelease       1.2.3-beta.0
> semver 1.2.3-beta --preid beta --increment prepatch         1.2.4-beta.0
> semver 1.2.3-beta --preid beta --increment preminor         1.3.0-beta.0
> semver 1.2.3-beta --preid beta --increment premajor         2.0.0-beta.0

> semver 1.2.3-beta.0 --preid beta --increment patch          1.2.4-beta
> semver 1.2.3-beta.0 --preid beta --increment minor          1.3.0-beta
> semver 1.2.3-beta.0 --preid beta --increment major          2.0.0-beta
> semver 1.2.3-beta.0 --preid beta --increment prerelease     1.2.3-beta.1
> semver 1.2.3-beta.0 --preid beta --increment prepatch       1.2.4-beta.0
> semver 1.2.3-beta.0 --preid beta --increment preminor       1.3.0-beta.0
> semver 1.2.3-beta.0 --preid beta --increment premajor       2.0.0-beta.0
```

## Commands

- `npm run dev:linting`: Lint files
- `npm test`: Run tests
- `npm run test:coverage`: Run tests and see coverage reports

## Contributing

- [Guidelines](../../docs/GUIDELINES.md)
- [Contributing](../../docs/CONTRIBUTING.md)
- [Code of conducts](../../docs/CODE_OF_CONDUCTS.md)
