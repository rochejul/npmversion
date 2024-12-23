import { WorkspacePackageDependency } from './workspace-package-dependency';

/** @import semver from 'semver' */

/**
 *
 * @param {Map<string, string>} deps
 * @returns {WorkspacePackageDependency[]}
 */
function mapToWorkspacePackageDependency(deps) {
  return Array.from(deps.keys()).reduce(
    (acc, depName) => [
      ...acc,
      new WorkspacePackageDependency({
        name: depName,
        range: deps.get(depName),
      }),
    ],
    [],
  );
}

/**
 * @module @npmversion/workspace
 * @class
 */
export class WorkspacePackage {
  /**
   * @type {string}
   */
  #name;

  /**
   * @type {string | semver}
   */
  #version;

  /**
   * @type {WorkspacePackageDependency[]}
   */
  #dependencies;

  /**
   * @type {WorkspacePackageDependency[]}
   */
  #devDependencies;

  /**
   * @type {WorkspacePackageDependency[]}
   */
  #peerDependencies;

  /**
   * @type {WorkspacePackageDependency[]}
   */
  #optionalDependencies;

  /**
   * @constructor
   * @param {{ name: string, version: string | semver, dependencies: Object = {}, devDependencies: Object = {}, peerDependencies: Object = {}, optionalDependencies: Object = {} }} param
   */
  constructor({
    name,
    version,
    dependencies = {},
    devDependencies = {},
    peerDependencies = {},
    optionalDependencies = {},
  }) {
    this.#name = name;
    this.#version = version;
    this.#dependencies = Object.freeze(
      mapToWorkspacePackageDependency(new Map(Object.entries(dependencies))),
    );
    this.#devDependencies = Object.freeze(
      mapToWorkspacePackageDependency(new Map(Object.entries(devDependencies))),
    );
    this.#peerDependencies = Object.freeze(
      mapToWorkspacePackageDependency(
        new Map(Object.entries(peerDependencies)),
      ),
    );
    this.#optionalDependencies = Object.freeze(
      mapToWorkspacePackageDependency(
        new Map(Object.entries(optionalDependencies)),
      ),
    );
  }

  /**
   * @returns {string}
   */
  get name() {
    return this.#name;
  }

  /**
   * @returns {string | semver}
   */
  get version() {
    return this.#version;
  }

  /**
   * @returns {WorkspacePackageDependency[]}
   */
  get dependencies() {
    return this.#dependencies;
  }

  /**
   * @returns {WorkspacePackageDependency[]}
   */
  get devDependencies() {
    return this.#devDependencies;
  }

  /**
   * @returns {WorkspacePackageDependency[]}
   */
  get peerDependencies() {
    return this.#peerDependencies;
  }

  /**
   * @returns {WorkspacePackageDependency[]}
   */
  get optionalDependencies() {
    return this.#optionalDependencies;
  }

  toJSON() {
    return Object.freeze({
      name: this.name,
      version: this.version,
      dependencies: this.dependencies,
      devDependencies: this.devDependencies,
      peerDependencies: this.peerDependencies,
      optionalDependencies: this.optionalDependencies,
    });
  }
}
