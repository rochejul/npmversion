<p>
    <a href="https://www.npmjs.com/package/@npmversion/cli">
    <img src="https://img.shields.io/npm/v/@npmversion/cli" alt="npm version">
  </a>

  <a href="https://packagephobia.now.sh/result?p=@npmversion/cli">
    <img src="https://packagephobia.now.sh/badge?p=@npmversion/cli" alt="install size">
  </a>

  <a href="https://snyk.io/test/github/rochejul/npmversion">
    <img src="https://snyk.io/test/github/rochejul/npmversion/badge.svg?targetFile=packages/core/package.json" alt="Known Vulnerabilities">
  </a>

  <a href="https://github.com/rochejul/npmversion/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@npmversion/cli.svg" alt="license">
  </a>
</p>

# @npmversion/cli

Cli module over ` @npmversion/core`

## Usage

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

### How to import it ?

Type the command "npm install --save-dev --save-exact @npmversion/cli

```json
{
  "name": "my-app",
  "version": "1.2.0",
  "devDependencies": {
    "@npmversion/cli": "latest"
  }
}
```

### Possible NPM-RUN configuration

```json
{
  "name": "my-app",
  "version": "0.0.1",
  "scripts": {
    "test": "node ./node_modules/mocha/bin/mocha --recursive --ui bdd --colors ./test",

    "bump-release": "npm run test && npmversioncli --unpreid --git-push",

    "bump-major": "npm run test && npmversioncli --increment major --git-push",
    "bump-minor": "npm run test && npmversioncli --increment minor --git-push",
    "bump-patch": "npm run test && npmversioncli --increment patch --git-push",

    "bump-major-beta": "npmversioncli --increment major --preid beta --nogit-tag --git-push",
    "bump-minor-beta": "npmversioncli --increment minor --preid beta --nogit-tag --git-push",
    "bump-patch-beta": "npmversioncli --increment patch --preid beta --nogit-tag --git-push"
  }
}
```

### Possible .npmversionrc configuration

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

## Commands

- `npm run dev:linting`: Lint files

## Contributing

- [Guidelines](../../docs/GUIDELINES.md)
- [Contributing](../../docs/CONTRIBUTING.md)
- [Code of conducts](../../docs/CODE_OF_CONDUCTS.md)
