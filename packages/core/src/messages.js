import { readFile } from '@npmversion/util';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function loadFileContent(fileName) {
  return readFile(resolve(join(__dirname, `../resources/${fileName}.txt`)));
}

export const GIT_COMMIT_MESSAGE = 'Release version: %s';
export const GIT_BRANCH_MESSAGE = 'release/%s';
export const GIT_TAG_MESSAGE = 'v%s';
export const HELP_TEXT = await loadFileContent('help');
export const IGNORED_JSON_FILE = await loadFileContent('ignored-json-file');
export const NOT_FOUND_PACKAGE_JSON_FILE = await loadFileContent(
  'not-found-package-json-file',
);
export const NO_REMOTE_GIT = await loadFileContent('no-remote-git');
export const MULTIPLE_REMOTE_GIT = await loadFileContent('multiple-remote-git');
export const GIT_NOT_INSTALLED = await loadFileContent('git-not-installed');
export const NOT_INTO_GIT_PROJECT = await loadFileContent(
  'not-into-git-project',
);
