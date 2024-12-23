import { describe, test, expect } from '@jest/globals';
import '@npmversion/jest-utils';
import * as messages from '../src/messages.js';

describe('@npmversion/core - messages', () => {
  test('we should have loaded the messages', () => {
    expect(messages).toMatchPlainObject({
      GIT_BRANCH_MESSAGE: 'release/%s',
      GIT_COMMIT_MESSAGE: 'Release version: %s',
      GIT_NOT_INSTALLED: 'Git seems not be installed\n',
      GIT_TAG_MESSAGE: 'v%s',
      HELP_TEXT:
        "Node-Version %s\n\n%s\nIt should be execute into a folder with a package.json file\n\nUsage: version [options]\n\nOptions:\n    --help\n        Print the help around the command\n\n    -i --increment [<level>]\n        Increment a version by the specified level.  Level can\n        be one of: major, minor, patch, premajor, preminor,\n        prepatch, or prerelease.  Default level is 'patch'.\n        Only one version may be specified. A Git commit and\n        tag will be created.\n        Nota Bene: it will use the \"npm version\" command if the option\n        \"read-only\" is not activated.\n\n        -p --preid <identifier>\n            Identifier to be used to prefix premajor, preminor,\n            prepatch or prerelease version increments. It could\n            be 'snapshot', 'beta' or 'alpha' for example.\n\n        --force-preid\n            If specified, we force to add if needed the specified preid\n\n        --read-only\n                Print only the future version. Don't modify the package.json file,\n                nor the npm-shrinkwrap.json file, don't create a commit and don't\n                create a git tag\n\n        --nogit-commit\n            No git commit\n\n        --nogit-tag\n            No git tag\n\n        --git-create-branch\n            Create a new branch. Does not work if a preid is generated.\n\n        --git-push\n            Push the commit, the branch and the tags if needed\n\n    -u  --unpreid\n        Remove the prefix. The increment and preid option will be ignored.\n        Only a Git commit will be created\n\n        --read-only\n               Print only the future version. Don't modify the package.json file,\n               nor the npm-shrinkwrap.json file, don't create a commit and don't\n               create a git tag\n\n       --nogit-commit\n           No git commit\n\n       --nogit-tag\n           No git tag\n\n        --git-create-branch\n            Create a new branch. Does not work if a preid is generated.\n\n        --git-push\n            Push the commit, the branch and the tags if needed\n",
      IGNORED_JSON_FILE:
        'The following json file is ignored (because it was not found or bad formatted or insufficient privilege to modify it): %s\n',
      MULTIPLE_REMOTE_GIT:
        'Multiple Git remote were found. Please specify one with the parameter "git-remote-name"\n\nYou can specify it into the configuration file through "git-remote-name"\n',
      NOT_FOUND_PACKAGE_JSON_FILE:
        "No package.json file was found into the current folder\n\nPlease check where have you launch the command and / or read\nthe documentation. For that, please do 'version --help'\n",
      NOT_INTO_GIT_PROJECT: 'We are not into a Git project\n',
      NO_REMOTE_GIT: 'No Git remote was found.\n',
    });
  });
});
