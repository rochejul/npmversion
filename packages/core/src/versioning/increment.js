import semver from 'semver';
import { LEVEL_ENUM } from './level.js';

const PREFIX_SEPARATOR = '-';
const PRE_LEVEL_SUFFIX = 'pre';

const NUMBER_REGEXP = /^\d+$/;

/**
 * Remove the prefix of the package version
 * @param {string} packageVersion
 * @returns {string}
 */
export function unpreidPackageVersion(packageVersion) {
  if (packageVersion.indexOf(PREFIX_SEPARATOR) >= 0) {
    return packageVersion.split(PREFIX_SEPARATOR)[0];
  }

  return packageVersion;
}

/**
 * change the package version
 * @param {string} packageVersion
 * @param {string} level
 * @param {string} [preid]
 * @param {boolean} [forceAddPreid=false]
 * @returns {string}
 *
 * Examples of classical output:
 * > semver 1.2.3 --increment patch                             1.2.4
 * > semver 1.2.3 --increment minor                             1.3.0
 * > semver 1.2.3 --increment major                             2.0.0
 * > semver 1.2.3 --increment prerelease                        1.2.4-0
 * > semver 1.2.3 --increment prepatch                          1.2.4-0
 * > semver 1.2.3 --increment preminor                          1.3.0-0
 * > semver 1.2.3 --increment premajor                          2.0.0-0
 *
 * > semver 1.2.3-0 --increment patch                           1.2.3
 * > semver 1.2.3-0 --increment minor                           1.3.0
 * > semver 1.2.3-0 --increment major                           2.0.0
 * > semver 1.2.3-0 --increment prerelease                      1.2.3-1
 * > semver 1.2.3-0 --increment prepatch                        1.2.4-0
 * > semver 1.2.3-0 --increment preminor                        1.3.0-0
 * > semver 1.2.3-0 --increment premajor                        2.0.0-0
 *
 * > semver 1.2.3-beta --increment patch                        1.2.4
 * > semver 1.2.3-beta --increment minor                        1.3.0
 * > semver 1.2.3-beta --increment major                        2.0.0
 * > semver 1.2.3-beta --increment prerelease                   1.2.3-beta.0
 * > semver 1.2.3-beta --increment prepatch                     1.2.4-0
 * > semver 1.2.3-beta --increment preminor                     1.3.0-0
 * > semver 1.2.3-beta --increment premajor                     2.0.0-0
 *
 * > semver 1.2.3-beta.0 --increment patch                      1.2.4
 * > semver 1.2.3-beta.0 --increment minor                      1.3.0
 * > semver 1.2.3-beta.0 --increment major                      2.0.0
 * > semver 1.2.3-beta.0 --increment prerelease                 1.2.3-beta.1
 * > semver 1.2.3-beta.0 --increment prepatch                   1.2.4-0
 * > semver 1.2.3-beta.0 --increment preminor                   1.3.0-0
 * > semver 1.2.3-beta.0 --increment premajor                   2.0.0-0
 *
 * > semver 1.2.3 --preid beta --increment patch                 1.2.4
 * > semver 1.2.3 --preid beta --increment minor                 1.3.0
 * > semver 1.2.3 --preid beta --increment major                 2.0.0
 * > semver 1.2.3 --preid beta --increment prerelease            1.2.4-beta.0
 * > semver 1.2.3 --preid beta --increment prepatch              1.2.4-beta.0
 * > semver 1.2.3 --preid beta --increment preminor              1.3.0-beta.0
 * > semver 1.2.3 --preid beta --increment premajor              2.0.0-beta.0
 *
 * > semver 1.2.3-0 --preid beta --increment patch               1.2.4
 * > semver 1.2.3-0 --preid beta --increment minor               1.3.0
 * > semver 1.2.3-0 --preid beta --increment major               2.0.0
 * > semver 1.2.3-0 --preid beta --increment prerelease          1.2.3-beta.0
 * > semver 1.2.3-0 --preid beta --increment prepatch            1.2.4-beta.0
 * > semver 1.2.3-0 --preid beta --increment preminor            1.3.0-beta.0
 * > semver 1.2.3-0 --preid beta --increment premajor            2.0.0-beta.0
 *
 * > semver 1.2.3-beta --preid beta --increment patch            1.2.4
 * > semver 1.2.3-beta --preid beta --increment minor            1.3.0
 * > semver 1.2.3-beta --preid beta --increment major            2.0.0
 * > semver 1.2.3-beta --preid beta --increment prerelease       1.2.3-beta.0
 * > semver 1.2.3-beta --preid beta --increment prepatch         1.2.4-beta.0
 * > semver 1.2.3-beta --preid beta --increment preminor         1.3.0-beta.0
 * > semver 1.2.3-beta --preid beta --increment premajor         2.0.0-beta.0
 *
 * > semver 1.2.3-beta.0 --preid beta --increment patch          1.2.4
 * > semver 1.2.3-beta.0 --preid beta --increment minor          1.3.0
 * > semver 1.2.3-beta.0 --preid beta --increment major          2.0.0
 * > semver 1.2.3-beta.0 --preid beta --increment prerelease     1.2.3-beta.1
 * > semver 1.2.3-beta.0 --preid beta --increment prepatch       1.2.4-beta.0
 * > semver 1.2.3-beta.0 --preid beta --increment preminor       1.3.0-beta.0
 * > semver 1.2.3-beta.0 --preid beta --increment premajor       2.0.0-beta.0
 *
 *
 *
 * With forceAddPreid to true:
 * > semver 1.2.3 --increment patch                             1.2.4
 * > semver 1.2.3 --increment minor                             1.3.0
 * > semver 1.2.3 --increment major                             2.0.0
 * > semver 1.2.3 --increment prerelease                        1.2.4-0
 * > semver 1.2.3 --increment prepatch                          1.2.4-0
 * > semver 1.2.3 --increment preminor                          1.3.0-0
 * > semver 1.2.3 --increment premajor                          2.0.0-0
 *
 * > semver 1.2.3-0 --increment patch                           1.2.3
 * > semver 1.2.3-0 --increment minor                           1.3.0
 * > semver 1.2.3-0 --increment major                           2.0.0
 * > semver 1.2.3-0 --increment prerelease                      1.2.3-1
 * > semver 1.2.3-0 --increment prepatch                        1.2.4-0
 * > semver 1.2.3-0 --increment preminor                        1.3.0-0
 * > semver 1.2.3-0 --increment premajor                        2.0.0-0
 *
 * > semver 1.2.3-beta --increment patch                        1.2.4
 * > semver 1.2.3-beta --increment minor                        1.3.0
 * > semver 1.2.3-beta --increment major                        2.0.0
 * > semver 1.2.3-beta --increment prerelease                   1.2.3-beta.0
 * > semver 1.2.3-beta --increment prepatch                     1.2.4-0
 * > semver 1.2.3-beta --increment preminor                     1.3.0-0
 * > semver 1.2.3-beta --increment premajor                     2.0.0-0
 *
 * > semver 1.2.3-beta.0 --increment patch                      1.2.4
 * > semver 1.2.3-beta.0 --increment minor                      1.3.0
 * > semver 1.2.3-beta.0 --increment major                      2.0.0
 * > semver 1.2.3-beta.0 --increment prerelease                 1.2.3-beta.1
 * > semver 1.2.3-beta.0 --increment prepatch                   1.2.4-0
 * > semver 1.2.3-beta.0 --increment preminor                   1.3.0-0
 * > semver 1.2.3-beta.0 --increment premajor                   2.0.0-0
 *
 * > semver 1.2.3 --preid beta --increment patch                 1.2.4-beta
 * > semver 1.2.3 --preid beta --increment minor                 1.3.0-beta
 * > semver 1.2.3 --preid beta --increment major                 2.0.0-beta
 * > semver 1.2.3 --preid beta --increment prerelease            1.2.4-beta.0
 * > semver 1.2.3 --preid beta --increment prepatch              1.2.4-beta.0
 * > semver 1.2.3 --preid beta --increment preminor              1.3.0-beta.0
 * > semver 1.2.3 --preid beta --increment premajor              2.0.0-beta.0
 *
 * > semver 1.2.3-0 --preid beta --increment patch               1.2.3-beta
 * > semver 1.2.3-0 --preid beta --increment minor               1.3.0-beta
 * > semver 1.2.3-0 --preid beta --increment major               2.0.0-beta
 * > semver 1.2.3-0 --preid beta --increment prerelease          1.2.3-beta.0
 * > semver 1.2.3-0 --preid beta --increment prepatch            1.2.4-beta.0
 * > semver 1.2.3-0 --preid beta --increment preminor            1.3.0-beta.0
 * > semver 1.2.3-0 --preid beta --increment premajor            2.0.0-beta.0
 *
 * > semver 1.2.3-beta --preid beta --increment patch            1.2.4-beta
 * > semver 1.2.3-beta --preid beta --increment minor            1.3.0-beta
 * > semver 1.2.3-beta --preid beta --increment major            2.0.0-beta
 * > semver 1.2.3-beta --preid beta --increment prerelease       1.2.3-beta.0
 * > semver 1.2.3-beta --preid beta --increment prepatch         1.2.4-beta.0
 * > semver 1.2.3-beta --preid beta --increment preminor         1.3.0-beta.0
 * > semver 1.2.3-beta --preid beta --increment premajor         2.0.0-beta.0
 *
 * > semver 1.2.3-beta.0 --preid beta --increment patch          1.2.4-beta
 * > semver 1.2.3-beta.0 --preid beta --increment minor          1.3.0-beta
 * > semver 1.2.3-beta.0 --preid beta --increment major          2.0.0-beta
 * > semver 1.2.3-beta.0 --preid beta --increment prerelease     1.2.3-beta.1
 * > semver 1.2.3-beta.0 --preid beta --increment prepatch       1.2.4-beta.0
 * > semver 1.2.3-beta.0 --preid beta --increment preminor       1.3.0-beta.0
 * > semver 1.2.3-beta.0 --preid beta --increment premajor       2.0.0-beta.0
 */
export function incrementPackageVersion(
  packageVersion,
  level,
  preid,
  forceAddPreid = false,
) {
  if (forceAddPreid) {
    if (preid && !level.startsWith(PRE_LEVEL_SUFFIX)) {
      let versionToUse = packageVersion;

      if (level === LEVEL_ENUM.patch && packageVersion) {
        const splitting = packageVersion.split(PREFIX_SEPARATOR);
        const currentVersion = splitting[0];
        const currentPre = splitting[1];

        if (currentPre && !currentPre.match(NUMBER_REGEXP)) {
          // We have a package version like 1.2.3-beta
          versionToUse = currentVersion;
        }
      }

      const version = semver.inc(versionToUse, level);
      return `${version}${PREFIX_SEPARATOR}${preid}`;
    }
  }

  return semver.inc(packageVersion, level, preid);
}
