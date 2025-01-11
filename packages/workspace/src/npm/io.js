import { spawn as nodeSpawn } from 'node:child_process';

const MAX_BUFFER = 1000 * 1000 * 20; // 20 Mo

/**
 * @async
 * @param {string} command
 * @param {string[]} [args=[]]
 * @param {string} [cwd=process.cwd()]
 * @returns {Promise<string} Output of the command
 */
export async function spawn(command, args, cwd = process.cwd()) {
  return new Promise(function (resolve, reject) {
    let stdout = '';
    let instance = nodeSpawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true,
      maxBuffer: MAX_BUFFER,
    });

    instance.on('data', function (data) {
      stdout += data;
      console.log(data);
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
