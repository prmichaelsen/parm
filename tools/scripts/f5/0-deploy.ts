#!/usr/bin/env ts-node-script
import { preBundle } from './pre-bundle';
import { deploy } from './deploy';
import { postBundle } from './post-bundle';
import { bundle } from './bundle';
import { preDeploy } from './pre-deploy';
import { fetch } from './apps';

const help = 
`
Deploy all applications. Provide comma delimited app names
to deploy specific applications only.
`
const argPositionsByName = {
  2: 'appNames',
}
const [ 
  appNames = []
] = Object.keys(argPositionsByName)
  .map(key => process.argv[key]);

const main = async () => {
  const apps = appNames.length === 0 ? 
    (await fetch.apps()).map(app => app.app) : appNames.split(',');
  await preBundle(apps);
  await bundle(apps);
  await postBundle(apps);
  await preDeploy(apps);
  await deploy(apps);
};

main();