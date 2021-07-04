#!/usr/bin/env ts-node 
const path = require('path');
import firebase from 'firebase-admin';
import { exit } from 'process';
import { adminDb, resolve } from './util';
const nunjucks = require('nunjucks');

nunjucks.configure({
  autoescape: false,
});

const resolvePath = (pth: string) => {
  if (!path.isAbsolute(pth)) {
    return path.resolve(process.cwd(), pth);
  }
  return pth;
}

const help = `Required args:
  appName - 
    appName is a field in the collection 'prod.f5.apps', 
    e.g. 'parm', 'one-word-story', or 'default';
  stage -
    the environment, eg 'prod.parm.f5.apps'. default prod.f5.apps
  appConfigPath - 
    the path to the actual environment.ts file you are pushing. should match
    match apps/f5/src/environments/<app-name>.ts
    default apps/f5/src/environments/<app-name>.ts
`;
const argPositionsToName = {
  2: 'appName',
  3: 'stage',
  4: 'appConfigPath',
}

const provideDefault = (argName: string, value: string) => {
  const argPos = Object.keys(argPositionsToName)
    .find(i => argPositionsToName[i] === argName)[0];
  process.argv[argPos] = process.argv[argPos] ?
    process.argv[argPos] : value;
}

provideDefault(
  'appConfigPath', 
  `./apps/f5/src/environments/${process.argv[4] || process.argv[2]}.ts`
);
provideDefault('stage', 'prod.parm.f5.apps');

const errors = Object.keys(argPositionsToName)
  .map(key => ({
    name: argPositionsToName[key],
    position: key,
    value: process.argv[key],
  }))
  .filter(arg => arg.value === undefined 
    || arg.value === null 
    || arg.value.trim() === '')
  .map((arg, i) => 
    `[ERROR] Missing argument '${arg.name}' at position '${arg.position}'`
  );
if (errors.length > 0) {
  errors.forEach((e) => console.log(e));
  console.log(help);
  exit();
}
const [ 
  appName, stage, appConfigPath
] = Object.keys(argPositionsToName)
  .map(key => process.argv[key]);

const main = async () => { 

  const db = adminDb();
  const appConfig = require(resolve(appConfigPath));

  const result = await db
    .collection(stage)
    .doc(appName)
    .set(appConfig.environment, { merge: true });
  console.log(`wrote on ${result.writeTime.toDate()}`);
}
main();