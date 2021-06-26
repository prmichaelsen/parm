import { run } from './util';

export const deploy = async (appNames = []) => {
  const promises = appNames.map(name => new Promise(async function(res) {
    console.log(`deploying ${name}...`);
    run('firebase', [
      'deploy',
      '--only',
      `hosting:${name}`,
    ]).then(res);
  }));
  await Promise.all(promises);
}