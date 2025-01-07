# Guidelines

## Tooling

### Volta

This project uses [Volta](https://volta.sh/) to ensure that all the contributors share the same version of `Node` and `Npm` for development. If you are considering making frequent contributions to this project, we recommend installing this tool as well. Otherwise, check the `volta` field in `package.json` to see which versions to use.

### Ide: Vscode

The project was provided with [Vscode](https://code.visualstudio.com/) and then contains some configuration to deal with [NPM's workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces).

We could find some configuration to run the Vscode's [jest plugin](https://github.com/jest-community/vscode-jest) and [jest-runner plugin](https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner), [eslint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [typescript](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next), to use their debugger mode, coverage, build, etc...

Ensure to have these plugins and you will have for free the same env with everything configured

## Workspaces

The project uses the [NPM's workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces).
It means you have to use the NPM's command to deal with workspaces

### New package

If you need to create the new package, run the following command at the rood of the project:

```bash
npm init -w ./packages/a
```

The new package will be declared with the same project's version, will be declared in the ` package-lock.json` file, etc...

If this package needs ` jest`, ensure in the ` vscode.settings.json` to update the config:

```json
"jest.virtualFolders": [{ "name": "core", "rootPath": "packages/core" }]
```

### Remove package

if you need to remove package, here the process:

- First, remove the folder, e.g. `rm -rf packages/b`
- Second, cleanup if needed vscode files
- Next, run `npm install`
- Then update the ` package-lock.json` file to remove your package

For the last, it seems there is [an issue](https://github.com/npm/cli/issues/5463) when we remove a package and the lock seems to be cleaned. There is a pending [PR](https://github.com/npm/cli/pull/5478) but notyet approved.

### Add a dependency between packages

If you need to add a common dependency, please on the root of the project:

```bash
npm install --save-dev mydep
```

### Link a package on another package

#### Public package

If you need a public package on another one, please run on the root of the project:

```bash
npm install --save @npmversion/core --workspace=packages/cli
```

#### Private package

If you need a private package on another one, please edit in the target package's `package.json` file the `peerDependencies` like so:

```json
"peerDependencies": {
    "@npmversion/jest-utils": "*"
},
"peerDependenciesMeta": {
    "@npmversion/jest-utils": {
        "optional": true
    }
}
```
