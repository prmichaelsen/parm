import { run } from './util';

export const deploy = async () => {
  await run('firebase', [
    'deploy',
    '--only',
    'hosting',
  ]);
}