const core = require('@actions/core');

try {
  const ssmParamName = core.getInput('ssm_param_name');
  console.log(`Hello ${ssmParamName}!`);
  const value = "someValueFromAwsSDK";
  core.setOutput("parameterValue", value);
} catch (error) {
  core.setFailed(error.message);
}
