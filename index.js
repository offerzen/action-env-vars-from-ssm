const core = require('@actions/core');
const AWS = require('aws-sdk');

async function run_action() {
  try {
    // const path = core.getInput('path');

    // New
    const path = '/shared/'
    const decryption = true
    const prefix = 'REACT_APP_'
    const role_arn = process.env.AWS_ROLE_ARN

    try {
      const parameters = await fetchParameters(path, decryption, role_arn)
      SetEnvironmentVariables(parameters, prefix)
    }
    catch (e) {
      core.setFailed(e.message);
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

const fetchParameters = async (path, decryption, role_arn) => {
  const assume_role_credentials = await getAssumeRoleCredentials(role_arn);
  const ssm = new AWS.SSM(assume_role_credentials);

  const params =
    {
      Path: path,
      Recursive: true,
      WithDecryption: decryption
    };

  const result = await ssm.getParametersByPath(params).promise();
  return result.Parameters
}

function SetEnvironmentVariables(parameters, prefix) {
  for (const i in parameters) {
    const parameter = parameters[i];
    const name = formatName(parameter.Name, prefix)
    const value = parameter.Value
    const secret = parameter.Type === 'SecureString'

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
