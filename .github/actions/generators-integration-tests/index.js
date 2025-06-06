const core = require('@actions/core');
const { spawn } = require('child_process');

async function run() {
  try {
    const packageCommand = core.getInput('packageCommand', { required: true });
    const successRegexp = core.getInput('successRegexp', { required: true });
    let timeoutId;

    const child = spawn(packageCommand, {
      shell: true,
    });

    console.log('###', successRegexp);
    child.stdout.on('data', (data) => {
      console.log(data.toString());
      if (data.toString().includes(successRegexp)) {
        clearTimeout(timeoutId);
        child.kill('SIGTERM');
        core.setOutput('result', 'Success');
      }
    });

    child.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    timeoutId = setTimeout(() => {
      child.kill('SIGTERM');
      core.setFailed('Command timeout');
    }, 8 * 60 * 1000); // 8 minutes
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
