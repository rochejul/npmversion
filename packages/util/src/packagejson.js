import JSON5 from 'json5';
import { resolve, join } from 'node:path';
import { readFile } from './io.js';

export class PackageJson {
  #version;
  #name;
  #workspaces;

  constructor({ version, name, workspaces }) {
    this.#version = version;
    this.#name = name;
    this.#workspaces = workspaces;
  }

  get name() {
    return this.#name;
  }

  get version() {
    return this.#version;
  }

  get workspaces() {
    return this.isLeaf() ? this.#workspaces : Object.freeze(this.#workspaces);
  }

  isLeaf() {
    return !Array.isArray(this.#workspaces);
  }

  toJSON() {
    return Object.freeze({
      name: this.#name,
      version: this.#version,
      workspaces: this.#workspaces,
    });
  }
}

export async function loadPackageJson(cwd = process.cwd()) {
  const packageJsonPath = resolve(join(cwd, 'package.json'));
  const packageJsonContent = await readFile(packageJsonPath);
  const packageJson = JSON5.parse(packageJsonContent);

  return new PackageJson(packageJson);
}
