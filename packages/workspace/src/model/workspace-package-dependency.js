import semver from 'semver';

/**
 * @module @npmversion/workspace
 * @class
 */
export class WorkspacePackageDependency {
  /**
   * @type {string | semver}
   */
  #name;

  /**
   * @type {string | Range}
   */
  #range;

  /**
   * @constructor
   * @param {{ name: string | semver, range: string | Range }} param
   */
  constructor({ name, range }) {
    this.#name = name;
    this.#range = range;
  }

  /**
   * @returns {string}
   */
  get name() {
    return this.#name;
  }

  /**
   * @returns {string | Range}
   */
  get range() {
    return this.#range;
  }

  /**
   * @param {string | semver} version
   * @returns {boolean}
   */
  satisfies(version) {
    return semver.satisfies(version, this.range);
  }

  toJSON() {
    return Object.freeze({
      name: this.name,
      range: this.range,
    });
  }
}
