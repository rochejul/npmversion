import { DepGraph } from 'dependency-graph';
import { mapToWorkspacePackageDependency } from './util.js';

/** @import semver from 'semver' */
/** @import { WorkspacePackage } from './workspace-package.js' */
/** @import { WorkspacePackageDependency } from './workspace-package-dependency.js' */

/**
 * @module @npmversion/workspace
 * @class
 */
export class Workspace {
  /**
   * @type {string}
   */
  #name;

  /**
   * @type {string | semver}
   */
  #version;

  /**
   * @type {WorkspacePackage[]}
   */
  #workspacePackages;

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
   * @type {DepGraph}
   */
  #graph;

  /**
   * @constructor
   * @param {{ name: string, version: string | semver, workspacePackages: WorkspacePackage[] = [], dependencies: Object = {}, devDependencies: Object = {}, peerDependencies: Object = {}, optionalDependencies: Object = {} }} param
   */
  constructor({
    name,
    version,
    workspacePackages = [],
    dependencies = {},
    devDependencies = {},
    peerDependencies = {},
    optionalDependencies = {},
  }) {
    this.#name = name;
    this.#version = version;
    this.#workspacePackages = Object.freeze(workspacePackages);
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

    this.#graph = new DepGraph();

    const packages = this.#workspacePackages.map(({ name }) => name);

    for (const workspacePackage of this.#workspacePackages) {
      if (!this.#graph.hasNode(workspacePackage.name)) {
        this.#graph.addNode(workspacePackage.name);
      }

      for (const dependency of [
        ...workspacePackage.dependencies,
        ...workspacePackage.devDependencies,
        ...workspacePackage.peerDependencies,
        ...workspacePackage.optionalDependencies,
      ]) {
        if (!packages.includes(dependency.name)) {
          continue;
        }

        if (!this.#graph.hasNode(dependency.name)) {
          this.#graph.addNode(dependency.name);
        }

        this.#graph.addDependency(workspacePackage.name, dependency.name);
      }
    }
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
   * @returns {WorkspacePackage[]}
   */
  get workspacePackages() {
    return this.#workspacePackages;
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
   * @type {string[]}
   */
  dependenciesOrder() {
    return this.#graph.overallOrder();
  }

  getWorkspacePackage(packageName) {
    return this.#workspacePackages.find(({ name }) => name === packageName);
  }

  /**
   * @returns {boolean}
   */
  isLeaf() {
    return this.#workspacePackages.length === 0;
  }

  /**
   * @async
   * @param {string} packageVersion
   */
  async updateInterWorkspaceDependencies(packageVersion) {
    const dependenciesOrder = this.dependenciesOrder();
    const packageNames = this.workspacePackages.map(({ name }) => name);

    for (const workspaceName of dependenciesOrder) {
      const workspacePackage = this.getWorkspacePackage(workspaceName);
      const packageJson = await workspacePackage.loadPackageJson();
      let changed = false;

      for (const workspacePackageDependency of workspacePackage.peerDependencies) {
        if (
          !packageNames.includes(workspacePackageDependency.name) ||
          workspacePackageDependency.satisfies(packageVersion)
        ) {
          continue;
        }

        changed = true;
        packageJson.update({
          peerDependencies: {
            ...packageJson.content.peerDependencies,
            [workspacePackageDependency.name]: packageVersion,
          },
        });
      }

      for (const workspacePackageDependency of workspacePackage.optionalDependencies) {
        if (
          !packageNames.includes(workspacePackageDependency.name) ||
          workspacePackageDependency.satisfies(packageVersion)
        ) {
          continue;
        }

        changed = true;
        packageJson.update({
          optionalDependencies: {
            ...packageJson.content.optionalDependencies,
            [workspacePackageDependency.name]: packageVersion,
          },
        });
      }

      for (const workspacePackageDependency of workspacePackage.devDependencies) {
        if (
          !packageNames.includes(workspacePackageDependency.name) ||
          workspacePackageDependency.satisfies(packageVersion)
        ) {
          continue;
        }

        changed = true;
        packageJson.update({
          devDependencies: {
            ...packageJson.content.devDependencies,
            [workspacePackageDependency.name]: packageVersion,
          },
        });
      }

      for (const workspacePackageDependency of workspacePackage.dependencies) {
        if (
          !packageNames.includes(workspacePackageDependency.name) ||
          workspacePackageDependency.satisfies(packageVersion)
        ) {
          continue;
        }

        changed = true;
        packageJson.update({
          dependencies: {
            ...packageJson.content.dependencies,
            [workspacePackageDependency.name]: packageVersion,
          },
        });
      }

      if (changed) {
        await packageJson.save();
      }
    }
  }

  toJSON() {
    return Object.freeze({
      name: this.name,
      version: this.version,
      workspacePackages: this.workspacePackages,
      dependencies: this.dependencies,
      devDependencies: this.devDependencies,
      peerDependencies: this.peerDependencies,
      optionalDependencies: this.optionalDependencies,
    });
  }
}
