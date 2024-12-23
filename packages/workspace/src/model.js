export class WorkspacePackage {
  #name;
  #version;
  #dependencies;
  #devDependencies;
  #peerDependencies;
  #optionalDependencies;

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
    this.#dependencies = Object.keys(dependencies);
    this.#devDependencies = Object.keys(devDependencies);
    this.#peerDependencies = Object.keys(peerDependencies);
    this.#optionalDependencies = Object.keys(optionalDependencies);
  }

  get name() {
    return this.#name;
  }

  get version() {
    return this.#version;
  }

  get dependencies() {
    return Object.freeze(this.#dependencies);
  }

  get devDependencies() {
    return Object.freeze(this.#devDependencies);
  }

  get peerDependencies() {
    return Object.freeze(this.#peerDependencies);
  }

  get optionalDependencies() {
    return Object.freeze(this.#optionalDependencies);
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

export class Workspace {
  #name;
  #version;
  #workspacePackages;

  constructor({ name, version, workspacePackages = [] }) {
    this.#name = name;
    this.#version = version;
    this.#workspacePackages = workspacePackages;
  }

  get name() {
    return this.#name;
  }

  get version() {
    return this.#version;
  }

  get workspacePackages() {
    return Object.freeze(this.#workspacePackages);
  }

  toJSON() {
    return Object.freeze({
      name: this.name,
      version: this.version,
      workspacePackages: this.workspacePackages,
    });
  }
}
