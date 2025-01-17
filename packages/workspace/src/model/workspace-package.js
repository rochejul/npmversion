import NPMCliPackageJson from '@npmcli/package-json';
import { mapToWorkspacePackageDependency } from './util.js';
import PackageJsonLib from '@npmcli/package-json';

/** @import semver from 'semver' */
/** @import { WorkspacePackageDependency } from './workspace-package-dependency.js' */

/**
 * @module @npmversion/workspace
 * @class
 */
export class WorkspacePackage {
  /**
   * @type {string}
   */
  #rootDir;

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
   * @param {{ rootDir: string, name: string, version: string | semver, dependencies: Object = {}, devDependencies: Object = {}, peerDependencies: Object = {}, optionalDependencies: Object = {} }} param
   */
  constructor({
    rootDir,
    name,
    version,
    dependencies = {},
    devDependencies = {},
    peerDependencies = {},
    optionalDependencies = {},
  }) {
    this.#rootDir = rootDir;
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
  get rootDir() {
    return this.#rootDir;
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

  /**
   * @async
   * @returns {NPMCliPackageJson}
   */
  async loadPackageJson() {
    return PackageJsonLib.load(this.rootDir);
  }

  toJSON() {
    return Object.freeze({
      rootDir: this.rootDir,
      name: this.name,
      version: this.version,
      dependencies: this.dependencies,
      devDependencies: this.devDependencies,
      peerDependencies: this.peerDependencies,
      optionalDependencies: this.optionalDependencies,
    });
  }
}
