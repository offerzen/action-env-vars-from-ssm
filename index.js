const core = require('@actions/core');

try {
  const path = core.getInput('path');
  console.log(`Hello ${path}!`);
}
catch (error) {
  core.setFailed(error.message);
}
