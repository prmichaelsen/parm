#!/usr/bin/env node 
const fs = require('fs');
const path = require('path');
const firebase = require('firebase-admin');
const nunjucks = require('nunjucks');

nunjucks.configure({
  autoescape: false,
});

const main = async () => { 
  const env = process.env.NODE_ENV || 'production';
  const config = {
    firebaseSecretsPath: './env/parm-app.json',
    firebaseDatabaseUrl: 'https://parm-app.firebaseio.com',
  }

  let finalConfigLocation = config.firebaseSecretsPath;
  if (!path.isAbsolute(config.firebaseSecretsPath)) {
    finalConfigLocation = path.resolve(process.cwd(), config.firebaseSecretsPath);
  }
  firebase.initializeApp({
    credential: firebase.credential.cert(finalConfigLocation),
    databaseURL: config.firebaseDatabaseUrl,
  });
  const db = firebase.firestore();

  const doc = await db
    .collection(env)
    .doc('secrets')
    .get();
  const secrets = doc.data();

  const resolve = t => path.resolve(__dirname, t);
  const writeJson = ({ fp, data, name }) => {
    const json = JSON.stringify(data, null, 2);
    const wt = resolve(fp);
    const file = nunjucks.render('./templates/secret.njk', {
      name,
      json,
    });
    fs.writeFileSync(wt, file, 'utf8');
  }

  const location = 'libs';
  const packageName = 'util';
  Object.keys(secrets).forEach(secret => {
    const fp = `../${location}/${packageName}/env/secrets/${secret}.ts`;
    writeJson({ fp, data: secrets[secret], name: secret });
  });
}
main();