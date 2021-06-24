#!/usr/bin/env ts-node 
// rewrites the remote secrets using the 
// local lib/util/env/secrets.
// useful if you're creating a new app
// or you accidentally clobbered the
// remote secrets.
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

  const secretsJson = require(resolvePath('./libs/util/env'));

  const result = await db
    .collection(env)
    .doc('secrets')
    .set(secretsJson);
}
main();