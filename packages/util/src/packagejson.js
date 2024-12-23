import JSON5 from 'json5';
import { resolve, join } from 'node:path';
import { readFile } from './io.js';

/** @import semver from 'semver' */

export class PackageJson {
  /**
   * @type {string}
   */
  #name;

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

  constructor({
    version,
    name,
    workspaces = [],
    dependencies = {},
    devDependencies = {},
    peerDependencies = {},
    optionalDependencies = {},
  }) {
    this.#version = version;
    this.#name = name;
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
      name: this.#name,
      version: this.#version,
      workspaces: this.#workspaces,
      dependencies: this.dependencies,
      devDependencies: this.devDependencies,
      peerDependencies: this.peerDependencies,
      optionalDependencies: this.optionalDependencies,
    });
  }
}

export async function loadPackageJson(cwd = process.cwd()) {
  const packageJsonPath = resolve(join(cwd, 'package.json'));
  const packageJsonContent = await readFile(packageJsonPath);
  const packageJson = JSON5.parse(packageJsonContent);

  return new PackageJson(packageJson);
}
