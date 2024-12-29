import { versioning, configRetriever } from '@npmversion/core';
import { versionOptionsAnalyzer } from './cli';

export async function cli() {
  const argv = process.argv.slice(2);

  return versioning(
    argv?.length > 0 ? versionOptionsAnalyzer(argv, configRetriever()) : null,
    process.cwd(),
  );
}
