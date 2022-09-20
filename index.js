const core = require('@actions/core');
const AWS = require('aws-sdk');

async function run_action() {
  try {
    const path = core.getInput('path', {required: true});
    const decryption = core.getInput('decryption') === 'true';
    const prefix = core.getInput('prefix');

    try {
      core.info('Fetching parameters from AWS...')
      const result = await fetchParameters(path, decryption)
      const parameters = result.Parameters
      core.info(`Fetched ${parameters.length} parameters.`)
      SetEnvironmentVariables(parameters, prefix)
    } catch (e) {
      core.setFailed(e.message);
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

const fetchParameters = async (path, withDecryption = true, params = [], nextToken = undefined) => {
  const role_arn = process.env.AWS_ROLE_ARN;
  const assume_role_credentials = await getAssumeRoleCredentials(role_arn);
  const ssm = new AWS.SSM(assume_role_credentials);

  return ssm
    .getParametersByPath({ Path: path, Recursive: true, WithDecryption: withDecryption, NextToken: nextToken, MaxResults: 10 })
    .promise()
    .then(({ Parameters, NextToken }) => {
      const moreParams = params.concat(Parameters);
      return NextToken ? fetchParameters(path, withDecryption, moreParams, NextToken) : moreParams;
    });
}

function SetEnvironmentVariables(parameters, prefix) {
  for (const i in parameters) {
    const parameter = parameters[i];
    const name = formatName(parameter.Name, prefix)
    const value = parameter.Value
    const secret = parameter.Type === 'SecureString'

    core.info(`Setting environment variable from parameter ${name}.`)
    setEnvironmentVar(name, value, secret)
  }
}

function formatName(name, prefix) {
  const split = name.split('/');
  return prefix + split[split.length - 1];
}

function setEnvironmentVar(key, value, secret) {
  core.exportVariable(key, value);

  if (secret) {
    core.setSecret(value);
  }
}

const getAssumeRoleCredentials = async (role_arn) => {
  const sts = new AWS.STS();

  return new Promise((resolve, reject) => {
    const timestamp = (new Date()).getTime();
    const params = {
      RoleArn: role_arn,
      RoleSessionName: `Session-${timestamp}`
    };

    sts.assumeRole(params, (err, data) => {
      if (err) reject(err);
      else {
        resolve({
          accessKeyId: data.Credentials.AccessKeyId,
          secretAccessKey: data.Credentials.SecretAccessKey,
          sessionToken: data.Credentials.SessionToken,
          region: process.env.AWS_DEFAULT_REGION
        });
      }
    });
  });
}

run_action();
