import chalk from 'chalk';

export function enableLogging() {
  process.on('log', (level, ...args) => {
    if (level === 'silent' || level === 'resume') {
      return;
    }

    if (level === 'error') {
      console.log(chalk.red(level), ...args);
    }
    if (level === 'info') {
      console.log(chalk.yellow(level), ...args);
    } else {
      console.log(chalk.blue(level), ...args);
    }
  });
}
