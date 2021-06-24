#!/usr/bin/env ts-node 
const path = require('path');
import firebase from 'firebase-admin';
import { exit } from 'process';
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
  appName - If this is a firebase-admin-sdk secret, then the app name is the
    name of project as defined in firebase cloud console, e.g. 'parm-names-not-numbers' or 'parm-app'.
    If this is any other secret, then appName is a field in the collection 'prod.f5.apps', 
    e.g. 'parm', 'one-word-story', or 'default';
  secretType - the type of secret, e.g. firebase, firebase-admin-sdk, reddit
  secretsJsonPath - the path to the actual secrets .json file you are pushing
`;
const argPositionsByName = {
  2: 'appName',
  3: 'secretType',
  4: 'secretsJsonPath',
}

const errors = Object.keys(argPositionsByName)
  .map(key => ({
    name: argPositionsByName[key],
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
  appName, secretType, secretsJsonPath,
] = Object.keys(argPositionsByName)
  .map(key => process.argv[key]);

const main = async () => { 
  const env = process.env.NODE_ENV || 'production';
  const config = {
    firebaseSecretsPath: './env/parm-app.json',
    firebaseDatabaseUrl: 'https://parm-app.firebaseio.com',
  }

  let finalConfigLocation = resolvePath(config.firebaseSecretsPath);
  firebase.initializeApp({
    credential: firebase.credential.cert(finalConfigLocation),
    databaseURL: config.firebaseDatabaseUrl,
  });
  const db = firebase.firestore();

  const secretsJson = require(resolvePath(secretsJsonPath));
  const secrets = {
    [secretType]: {
      [appName]: secretsJson
    }
  }

  const result = await db
    .collection(env)
    .doc('secrets')
    .set(secrets, { merge: true });
}
main();