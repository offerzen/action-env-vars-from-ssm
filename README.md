# Hello Secret javascript action

This action prints "Hello Secret" or "Hello" + the parameter value.

## Inputs

## `ssm_param_name`

**Required** The name of the parameter to query.

## Outputs

## `ssm_param_value`

The value of the parameter.

## Example usage

uses: offerzen/export_environment_variables-action@v1.1
with:
  ssm_param_name: 'some/param/name'
