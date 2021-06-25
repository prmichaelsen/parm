import { run } from './util';

export const deploy = async (appNames = []) => {
  const promises = appNames.map(name => async function() {
    await run('firebase', [
      'deploy',
      '--only',
      `hosting:${name}`,
    ]);
  });
  await Promise.all(promises);
}