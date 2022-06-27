const core = require('@actions/core');

try {
  const path = core.getInput('path');
  console.log(`Hello ${path}!`);
  console.log(`AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID}`)
}
catch (error) {
  core.setFailed(error.message);
}
