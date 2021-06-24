import * as admin from 'firebase-admin';
(global as any).XMLHttpRequest = require("xhr2");
const stream = require('stream')
import { firebaseAdminSdk } from '@parm/util';

const firebaseProjectId = 'parm-names-not-numbers';
const firebaseDatabaseUrl = 'databaseURL: "https://parm-names-not-numbers.firebaseio.com';

admin.initializeApp({
  credential: admin.credential.cert(firebaseAdminSdk[firebaseProjectId] as any),
  databaseURL: firebaseDatabaseUrl,
});

export const functionImageHost = async (req: any, res?: any) => {

  // break out url to get the image-path.jpg portion
  const fp = req.url.split('/');
  const end = fp[fp.length - 1];
  const name = end.split('.')[0];

  const app = 'parm';
  const ImagesStore = `${app}/images`;
  const filePath = `${ImagesStore}/${name}`;
  const bucketName = 'parm-names-not-numbers.appspot.com';
  const bucket = admin.storage().bucket(bucketName);
  const image = bucket.file(filePath);
  const [exists] = await image.exists();
  if (!exists)
    return res.sendStatus(404);
  await image.makePublic();
  const r = image.createReadStream();
  const ps = new stream.PassThrough() // <---- this makes a trick with stream error handling
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
