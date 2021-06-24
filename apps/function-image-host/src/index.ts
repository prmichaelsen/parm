import * as admin from 'firebase-admin';
(global as any).XMLHttpRequest = require("xhr2");
const stream = require('stream')
import secrets from './secrets';

const firebaseSecretsPath = './apps/function-image-host/src/parm-names-not-numbers.json';
const firebaseDatabaseUrl = 'databaseURL: "https://parm-names-not-numbers.firebaseio.com';
const config = {
  firebaseSecretsPath,
  firebaseDatabaseUrl,
}

admin.initializeApp({
  credential: admin.credential.cert(secrets as any),
  databaseURL: config.firebaseDatabaseUrl,
});

export const functionImageHost = async (req: any, res?: any) => {

  const fp = req.url.split('/');
  const end = fp[fp.length - 1];
  const name = end.split('.')[0];

  const app = 'parm';
  const ImagesStore = `${app}/images`;
  const bucket = 'parm-names-not-numbers.appspot.com';
  const image = await admin.storage().bucket(bucket).file(`${ImagesStore}/${name}`);
  await image.makePublic();
  const r = image.createReadStream();
  const ps = new stream.PassThrough() // <---- this makes a trick with stream error handling
  console.log(image.metadata);
  stream.pipeline(
   r,
   ps, // <---- this makes a trick with stream error handling
   (err) => {
    if (err) {
      console.log(err) // No such file or any other kind of error
      return res.sendStatus(400); 
    }
  })
  ps.pipe(res) // <---- this makes a trick with stream error handling
};
