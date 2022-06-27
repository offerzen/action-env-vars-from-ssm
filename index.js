const core = require('@actions/core');
const AWS = require('aws-sdk');

try {
  const path = core.getInput('path');
  console.log(`Hello ${path}!`);

  const ssm = new AWS.SSM();
  const params =
    {
      Path: path,
      Recursive: true,
      WithDecryption: true
    };

  const result = await ssm.getParametersByPath(params).promise();
  console.log(`result: ${JSON.stringify(result)}`)
}
catch (error) {
  core.setFailed(error.message);
}
