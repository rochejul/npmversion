<p>
    <a href="https://www.npmjs.com/package/@json-walker/core">
    <img src="https://img.shields.io/npm/v/@json-walker/core" alt="npm version">
  </a>

  <a href="https://packagephobia.now.sh/result?p=@json-walker/core">
    <img src="https://packagephobia.now.sh/badge?p=@json-walker/core" alt="install size">
  </a>

  <a href="https://snyk.io/test/github/rochejul/json-walker">
    <img src="https://snyk.io/test/github/rochejul/json-walker/badge.svg?targetFile=packages/core/package.json" alt="Known Vulnerabilities">
  </a>

  <a href="https://github.com/rochejul/json-walker/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@json-walker/core.svg" alt="license">
  </a>
</p>

# @json-walker/core

Core implementation of the walker

## Usage

### Walker usage

```js
function grabProperties(value) {
  const properties = [];
  const walker = new Walker(value);
  let optionalWalkerMetadata;

  do {
    optionalWalkerMetadata = walker.nextStep();

    if (optionalWalkerMetadata.isSome()) {
      properties.push({
        path: optionalWalkerMetadata.value.propertyPath.toString(),
        type: optionalWalkerMetadata.value.propertyType,
        value: optionalWalkerMetadata.value.propertyValue,
      });
    }
  } while (optionalWalkerMetadata.isSome());

  return properties;
}

const secondLevel = { label: 'foo' };
const array = [secondLevel];
const firstLevel = { records: array };
const actual = grabProperties(firstLevel);

/* actual content:
 * [
    {
      path: 'records',
      type: 'array',
      value: [{ label: 'foo' }],
    },
    {
      path: 'records[0]',
      type: 'object',
      value: { label: 'foo' },
    },
    {
      path: 'records[0].label',
      type: 'string',
      value: 'foo',
    },
  ]
 */
```

### IterableWalker usage

```js
function grabProperties(value) {
  const properties = [];
  const walker = new IterableWalker(value);

  for (const value of walker) {
    properties.push({
      path: value.propertyPath.toString(),
      type: value.propertyType,
      value: value.propertyValue,
    });
  }

  return properties;
}

const secondLevel = { label: 'foo' };
const array = [secondLevel];
const firstLevel = { records: array };
const actual = grabProperties(firstLevel);

/* actual content:
 * [
    {
      path: 'records',
      type: 'array',
      value: [{ label: 'foo' }],
    },
    {
      path: 'records[0]',
      type: 'object',
      value: { label: 'foo' },
    },
    {
      path: 'records[0].label',
      type: 'string',
      value: 'foo',
    },
  ]
 */
```

## Commands

- `npm run dev:linting`: Lint files
- `npm test`: Run tests
- `npm run test:coverage`: Run tests and see coverage reports

## Contributing

- [Guidelines](../../docs/GUIDELINES.md)
- [Contributing](../../docs/CONTRIBUTING.md)
- [Code of conducts](../../docs/CODE_OF_CONDUCTS.md)
