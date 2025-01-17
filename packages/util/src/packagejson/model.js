/** @import semver from 'semver' */
/** @import PackageJSON from '@npm/types' */

export class PackageJson {
  /**
   * @type {string}
   */
  #name;

  /**
   * @type {string}
   */
  #description;

  /**
   * @type {string | semver}
   */
  #version;

  /**
   * @type {string[]}
   */
  #workspaces;

  /**
   * @type {Object }
   */
  #dependencies;

  /**
   * @type {Object}
   */
  #devDependencies;

  /**
   * @type {Object}
   */
  #peerDependencies;

  /**
   * @type {Object}
   */
  #optionalDependencies;

  /**
   * @param {PackageJSON} packageJSONContent
   */
  constructor({
    version,
    name,
    description,
    workspaces = [],
    dependencies = {},
    devDependencies = {},
    peerDependencies = {},
    optionalDependencies = {},
  }) {
    this.#version = version;
    this.#name = name;
    this.#description = description;
    this.#workspaces = workspaces;
    this.#dependencies = dependencies;
    this.#devDependencies = devDependencies;
    this.#peerDependencies = peerDependencies;
    this.#optionalDependencies = optionalDependencies;
  }

  /**
   * @type {string}
   */
  get name() {
    return this.#name;
  }

  /**
   * @type {string}
   */
  get description() {
    return this.#description;
  }

  /**
   * @type {string | semver}
   */
  get version() {
    return this.#version;
  }

  /**
   * @returns {string[]}
   */
  get workspaces() {
    return this.isLeaf() ? this.#workspaces : Object.freeze(this.#workspaces);
  }

  /**
   * @returns {Object}
   */
  get dependencies() {
    return this.#dependencies;
  }

  /**
   * @returns {Object}
   */
  get devDependencies() {
    return this.#devDependencies;
  }

  /**
   * @returns {Object}
   */
  get peerDependencies() {
    return this.#peerDependencies;
  }

  /**
   * @returns {Object}
   */
  get optionalDependencies() {
    return this.#optionalDependencies;
  }

  /**
   * @returns {boolean}
   */
  isLeaf() {
    return !Array.isArray(this.#workspaces);
  }

  toJSON() {
    return Object.freeze({
      name: this.name,
      description: this.description,
      version: this.version,
      workspaces: this.workspaces,
      dependencies: this.dependencies,
      devDependencies: this.devDependencies,
      peerDependencies: this.peerDependencies,
      optionalDependencies: this.optionalDependencies,
    });
  }
}
