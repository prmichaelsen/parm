#!/usr/bin/env ts-node-script
import { preBundle } from './pre-bundle';
import { deploy } from './deploy';
import { postBundle } from './post-bundle';
import { bundle } from './bundle';
import { preDeploy } from './pre-deploy';
import { fetch } from './apps';

const help = 
`
Provide comma delimited app names
to deploy specific applications.
`
const argPositionsByName = {
  2: 'appNames',
}
const [ 
  appNames,
] = Object.keys(argPositionsByName)
  .map(key => process.argv[key]);

const main = async () => {
  const appNamesArr = (appNames + '').split(',');
  const allApps = (await fetch.apps()).map(conf => conf.app);
  const apps = 
    allApps.filter(app => appNamesArr.some(m => m === app));
  if (allApps.length === 0) {
    console.log(`not a valid application ${appNames}`);
    return;
  }
  await preBundle(apps);
  await bundle(apps);
  await postBundle(apps);
  await preDeploy(apps);
  await deploy(apps);
};

main();