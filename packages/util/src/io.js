import * as fs from 'node:fs/promises';
import { exec } from 'node:child_process';

const MAX_BUFFER = 1000 * 1000 * 20; // 20 Mo

/**
 * @param {string} command
 * @param {boolean} [silent=false]
 * @param {string} [cwd]
 * @returns {Promise.<string>}
 */
export async function promisedExec(command, silent, cwd) {
  // https://stackoverflow.com/questions/10232192/exec-display-stdout-live
  // https://nodejs.org/api/process.html#processstdout
  // https://github.com/nodejs/help/issues/4119
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
 * @param {string} filePath
 * @returns {Promise}
 */
export async function readFile(filePath) {
  const content = await fs.readFile(filePath);
  return content.toString();
}
