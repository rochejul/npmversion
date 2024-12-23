import { DepGraph } from 'dependency-graph';
import { WorkspacePackage } from './workspace-package.js';

/** @import semver from 'semver' */

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
   * @type {DepGraph}
   */
  #graph;

  /**
   * @constructor
   * @param {{ name: string, version: string | semver, workspacePackages: WorkspacePackage[] = [] }} param
   */
  constructor({ name, version, workspacePackages = [] }) {
    this.#name = name;
    this.#version = version;
    this.#workspacePackages = Object.freeze(workspacePackages);

    this.#graph = new DepGraph();

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
   * @type {string[]}
   */
  dependenciesOrder() {
    return this.#graph.overallOrder();
  }

  toJSON() {
    return Object.freeze({
      name: this.name,
      version: this.version,
      workspacePackages: this.workspacePackages,
    });
  }
}
