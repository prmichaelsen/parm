import * as path from 'path';
import * as fs from 'fs';
const execa = require('execa');
import * as nunjucks from 'nunjucks';
import firebase from 'firebase-admin';

nunjucks.configure({
  autoescape: false,
});

/** resolve relative or absolute paths easily */
export const resolve = t => {
  if (!path.isAbsolute(t)) {
    return path.resolve(process.cwd(), t);
  }
  return path.resolve(__dirname, t);
}

/** check file exists */
export const exists = t => fs.existsSync(resolve(t));

/** write json to disk with 2-space-indent */
export const writeJson = ({ fp, data }) => {
  const json = JSON.stringify(data, null, 2);
  const wt = resolve(fp);
  fs.writeFileSync(wt, json, 'utf8');
}

/** write data disk using the environment template */
export const writeEnv = ({ fp, data }) => {
  const json = JSON.stringify(data, null, 2);
  const wt = resolve(fp);
  const file = nunjucks.render('./templates/environment.njk', { json });
  fs.writeFileSync(wt, file, 'utf8');
}

/** get current env */
export const environment = () => {
  const env = process.env.NODE_ENV || 'production';
  switch (env) {
    case 'production':
      return 'prod';
    case 'qa':
      return 'qa';
    case 'development':
      return 'dev';
    case 'test':
      return 'test';
    default:
      return 'prod';
  }
}

export const run = (
  cmd: string,
  args?: string[],
  print: boolean = true,
) => new Promise((resolve, reject) => {
  const _args = args || [];
  console.log([cmd, _args]
    .filter(a => a !== undefined)
    .join(' '));
    const child = execa(cmd, _args, { 
      stdio: print ? 'inherit' : 'pipe',
    });
    child.on('data', msg => console.log(msg));
    child.on('data', msg => console.error(msg));
    child.on('exit', code => resolve(code));
});


export const adminDb = () => {
  const fbConf = {
    firebaseSecretsPath: './env/parm-app.json',
    firebaseDatabaseUrl: 'https://parm-app.firebaseio.com',
  }
  let finalConfigLocation = resolve(fbConf.firebaseSecretsPath);
  firebase.initializeApp({
    credential: firebase.credential.cert(finalConfigLocation),
    databaseURL: fbConf.firebaseDatabaseUrl,
  });
  const db = firebase.firestore();
  return db;
}