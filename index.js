const core = require('@actions/core');
const AWS = require('aws-sdk');

async function run_action() {
  try {
    // const path = core.getInput('path');
    const path = '/'
    console.log(`Hello ${path}!`);

    AWS.config.update({region: process.env.AWS_DEFAULT_REGION});
    const sts = new AWS.STS();
    sts.getCallerIdentity({}, function (err, data) {
      if (err) console.log(err, err.stack);
      else console.log(data);
    });

  } catch (error) {
    core.setFailed(error.message);
  }
}

run_action();
