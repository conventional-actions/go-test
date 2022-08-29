# go-test

A GitHub Action for testing Go code.

## Usage

To use the GitHub Action, add the following to your job:

```yaml
- uses: conventional-actions/go-test@v1
```

### Inputs

| Name        | Default         | Description                                                                                               |
|-------------|-----------------|-----------------------------------------------------------------------------------------------------------|
| `package`   | `./...`         | the package to scan                                                                                       |
| `platforms` | native platform | comma-separated list of platforms to test                                                                 |
| `tags`      | N/A             | comma-separated list of build tags to pass to go compiler                                                 |
| `args`      | N/A             | arguments to pass to the test                                                                             |
| `match`     | N/A             | regular expression of tests to run                                                                        |
| `parallel`  | `0`             | allow parallel execution of test functions that call `t.Parallel`                                         |
| `failfast`  | `false`         | do not start new tests after the first test failure                                                       |
| `cover`     | `off`           | set the mode for coverage analysis for the package being tested. Options are "off, set, count, automatic" |

### Outputs

No outputs.

### Example

```yaml
on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: conventional-actions/go-test@v1
```

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).

