import {
  GIT_COMMIT_MESSAGE,
  GIT_BRANCH_MESSAGE,
  GIT_TAG_MESSAGE,
} from '../messages';

import { LEVEL_ENUM } from '../versioning/level';

export const DEFAULT_OPTIONS = {
  'force-preid': false,
  'nogit-commit': false,
  'nogit-tag': false,
  'git-push': false,
  'git-create-branch': false,
  'git-commit-message': GIT_COMMIT_MESSAGE,
  'git-branch-message': GIT_BRANCH_MESSAGE,
  'git-tag-message': GIT_TAG_MESSAGE,
  'git-remote-name': null,
  increment: LEVEL_ENUM.patch,
};
