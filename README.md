<p>
  <a href="https://www.npmjs.com/package/npmversion">
    <img src="https://img.shields.io/npm/v/npmversion" alt="npm version">
  </a>

  <a href="https://github.com/rochejul/npmversionblob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/npmversion.svg" alt="license">
  </a>

  <a href="https://codeclimate.com/github/rochejul/npmversion">
    <img src="https://codeclimate.com/github/rochejul/npmversion/badges/gpa.svg" alt="Code Climate">
  </a>

  <a href="https://snyk.io/test/github/rochejul/npmversion">
    <img src="https://snyk.io/test/github/rochejul/npmversion/badge.svg?targetFile=package.json" alt="Known Vulnerabilities">
  </a>

  <a href="https://github.com/rochejul/npmversion/actions/workflows/node.js.yml">
    <img src="https://github.com/rochejul/npmversion/actions/workflows/node.js.yml/badge.svg" alt="Node.js Unit Test">
  </a>
</p>

# npmversion

A command line node module to deal with "bumping" and "npm version"

The "version" command will:

- change the package version of the `package.json` file and in the `package-lock.json` file if this one exists
- update also the packages of your workspace and the inter-dependencies
- deal with the prenumber and the preid flag
- create git commits and tags
- push the git commits and tags

## Breaking changes with 1.X

- No more pre/post npm run scripts
- No more json files modifications (except from NPM's ecosystem)
- Deal with NPM packages
- Split in packages
  - [@npmversion/cli](./packages/cli/README.md): the new cli tool (we keep `npmversion` for posterity)
  - [@npmversion/core](./packages/core/README.md): the core logic of the tool
  - [@npmversion/workspace](./packages/workspace/README.md): the tool logic to deal with npm packages, dependencies order, etc...

## Possible options

    --help
        Print the help around the command

    -i --increment [<level>]
        Increment a version by the specified level.  Level can
        be one of: major, minor, patch, premajor, preminor,
        prepatch, or prerelease.  Default level is 'patch'.
        Only one version may be specified. A Git commit and
        tag will be created.
        Nota Bene: it will use the "npm version" command if the option
        "read-only" is not activated.

        -p --preid <identifier>
            Identifier to be used to prefix premajor, preminor,
            prepatch or prerelease version increments. It could
            be 'snapshot', 'beta' or 'alpha' for example.

        --force-preid
            If specified, we force to add if needed the specified preid

        --read-only
                Print only the future version. Don't modify the package.json file,
                nor the npm-shrinkwrap.json file, don't create a commit and don't
                create a git tag

        --nogit-commit
            No git commit

        --nogit-tag
            No git tag

        --git-push
            Push the commit and the tags if needed

    -u  --unpreid
        Remove the prefix. The increment and preid option will be ignored.
        Only a Git commit will be created

        --read-only
               Print only the future version. Don't modify the package.json file,
               nor the npm-shrinkwrap.json file, don't create a commit and don't
               create a git tag

       --nogit-commit
           No git commit

       --nogit-tag
           No git tag

       --git-push
           Push the commit and the tags if needed

## How to import it ?

Type the command "npm install --save-dev --save-exact npmversion

```json
{
  "name": "my-app",
  "version": "1.2.0",
  "devDependencies": {
    "npmversion": "latest"
  }
}
```

## Possible NPM-RUN configuration

```json
{
  "name": "my-app",
  "version": "0.0.1",
  "scripts": {
    "test": "node ./node_modules/mocha/bin/mocha --recursive --ui bdd --colors ./test",

    "bump-release": "npm run test && npmversion --unpreid --git-push",

    "bump-major": "npm run test && npmversion --increment major --git-push",
    "bump-minor": "npm run test && npmversion --increment minor --git-push",
    "bump-patch": "npm run test && npmversion --increment patch --git-push",

    "bump-major-beta": "npmversion --increment major --preid beta --nogit-tag --git-push",
    "bump-minor-beta": "npmversion --increment minor --preid beta --nogit-tag --git-push",
    "bump-patch-beta": "npmversion --increment patch --preid beta --nogit-tag --git-push"
  }
}
```

## Possible .npmversionrc configuration

```json
{
  "force-preid": true,
  "nogit-commit": false,
  "nogit-tag": true,
  "git-push": false,
  "git-create-branch": false,
  "git-branch-message": "release/%s",
  "git-commit-message": "Release version: %s",
  "git-tag-message": "v%s",
  "increment": "minor",
  "git-remote-name": null
}
```

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

- `npm run dev:check`: Run tests and styling over packages
- `npm run dev:format`: Format files over packages
- `npm run dev:format:check`: Check files format over packages
- `npm run dev:linting`: Lint files over packages
- `npm run dev:styling`: Format and lint files over packages
- `npm run dev:publish`: Publish all the packages on npm registry
- `npm test`: Run tests over packages
- `npm run test:coverage`: Run tests over packages and see coverage reports

## Contributing

- [Guidelines](./docs/GUIDELINES.md)
- [Contributing](./docs/CONTRIBUTING.md)
- [Code of conducts](./docs/CODE_OF_CONDUCTS.md)
