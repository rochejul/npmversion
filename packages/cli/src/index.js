import { versioning, configRetriever } from '@npmversion/core';
import { versionOptionsAnalyzer } from './cli.js';

export async function cli() {
  const argv = process.argv.slice(2);

  return versioning(
    argv?.length > 0
      ? versionOptionsAnalyzer(argv, configRetriever().toJSON())
      : null,
    process.cwd(),
  );
}
