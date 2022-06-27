# GitHub Action - Export environment variables

This GitHub action reads params from AWS Parameter Store and sets them as environment variables.

## Features

For a given path, reads parameters in an AWS account. Each parameter is exported with an optional specified prefix as Github Action environment variables that can be used in subsequent jobs.

Example: *Plain text* param called `ORG_NAME` is exported with `REACT_APP_` prefix:
```
  env:
    REACT_APP_ORG_NAME: OfferZen
``` 
Example: *Encrypted* param called `SOME_SECRET` is exported with `REACT_APP_` prefix with the value being redacted:
```
  env:
    REACT_APP_SOME_SECRET: ***
``` 

## How To Use

The action expects a few input parameters which are defined below.

- **path:** _(required)_ Path of environment variables to set.
- **decryption:** _(optional)_ Whether to decrypt secrets or not. Defaults to `true`.
- **prefix:** _(optional)_ Prefix to add to exported environment variables.

The following environment variables need to be set:

- **AWS_ACCESS_KEY_ID:** _(required)_ AWS access key ID.
- **AWS_SECRET_ACCESS_KEY:** _(required)_ AWS secret access key.
- **AWS_DEFAULT_REGION:** _(required)_ AWS region.
- **AWS_ROLE_ARN:** _(required)_ ARN of the AWS role to assume.

Here's an example workflow that uses this action.

```yaml
jobs:
  export-environment-variables:
    runs-on: ubuntu-latest
    name: Example
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Run action
        uses: offerzen/export_environment_variables@v1.2
        with:
          path: '/shared/'
          prefix: 'REACT_APP_'
        env:
          AWS_ACCESS_KEY_ID: '<AWS_ACCESS_KEY_ID>'
          AWS_SECRET_ACCESS_KEY: '<AWS_SECRET_ACCESS_KEY>'
          AWS_DEFAULT_REGION: 'eu-west-1'
          AWS_ROLE_ARN: '<my role>'
      - name: Do something that requires env vars
        run: echo "Expand the job config to see the environment variables."
```

## Versions

Go to [Releases](https://github.com/offerzen/export_environment_variables/releases) to see the release versions.
