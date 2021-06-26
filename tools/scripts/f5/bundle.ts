import { run } from './util';
import { fetch } from './apps';

export const bundle = async (appNames = []) => {
  const apps = await fetch.apps()
  const promises = apps
    .filter(app => appNames.some(name => app.app === name))
    .map(app => new Promise(r => {
      console.log(`building ${app.app}...`);
      run('nx', [
        'run',
        `f5:build:${app.app}`,
      ]).then(r);
    }));
  await Promise.all(promises);
}