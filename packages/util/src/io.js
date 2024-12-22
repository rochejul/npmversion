import * as fs from 'node:fs/promises';
import { exec, spawn } from 'node:child_process';

const MAX_BUFFER = 1000 * 1000 * 20; // 20 Mo

/**
 * @param {string} command
 * @param {boolean} [silent=false]
 * @param {string} [cwd]
 * @returns {Promise.<string>}
 */
export async function promisedExec(command, silent, cwd) {
  return new Promise(function (resolve, reject) {
    let instance = exec(
      command,
      { cwd: cwd ? cwd : process.cwd(), maxBuffer: MAX_BUFFER },
      (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      },
    );

    if (!silent) {
      instance.stdout.on('data', function (data) {
        console.log(data);
      });

      instance.stderr.on('data', function (data) {
        console.error(data);
      });
    }
  });
}

/**
 * @param {string} command
 * @param {string[]} [args=[]]
 * @param {boolean} [silent=false]
 * @param {string} [cwd]
 * @returns {Promise.<string>}
 */
export async function promisedSpawn(command, args, silent, cwd) {
  return new Promise(function (resolve, reject) {
    let stdout = '';
    let instance = spawn(command, args ? args : [], {
      cwd: cwd ? cwd : process.cwd(),
      stdio: 'inherit',
      shell: true,
      maxBuffer: MAX_BUFFER,
    });

    instance.on('data', function (data) {
      stdout += data;

      if (!silent) {
        console.log(data);
      }
    });
    instance.on('error', reject);
    instance.on('close', (code) => {
      if (code) {
        reject(code);
      } else {
        resolve(stdout);
      }
    });
  });
}

/**
 * @param {string} filePath
 * @returns {Promise}
 */
export async function readFile(filePath) {
  const content = await fs.readFile(filePath);
  return content.toString();
}

/**
 * @param {string} filePath
 * @returns {Promise}
 */
export async function writeFile(filePath, content) {
  return fs.writeFile(filePath, content);
}
