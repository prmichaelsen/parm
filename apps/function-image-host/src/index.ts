import * as admin from 'firebase-admin';
import { firebaseAdminSdk } from '@parm/util';

var current = new Date();
const stamp = (marker) => {
  var date2 = new Date(); // 5:00 PM

  // the following is to handle cases where the times are on the opposite side of
  // midnight e.g. when you want to get the difference between 9:00 PM and 5:00 AM

  if (date2 < current) {
    date2.setDate(date2.getDate() + 1);
  }

  var diff = (date2 as any) - (current as any);
  console.log(marker, diff);
  current = date2;
}

const firebaseProjectId = 'com-f5-parm';
const firebaseDatabaseUrl = 'databaseURL: "https://com-f5-parm.firebaseio.com';

stamp('pre init');
admin.initializeApp({
  credential: admin.credential.cert(firebaseAdminSdk[firebaseProjectId] as any),
  databaseURL: firebaseDatabaseUrl,
});
stamp('init');

const app = 'parm';
const ImagesStore = `${app}/images`;
const bucketName = `${firebaseProjectId}.appspot.com`;
const bucket = admin.storage().bucket(bucketName);
bucket.makePublic();
stamp('fetch bucket');

export const functionImageHost = async (req: any, res?: any) => {

  // break out url to get the image-path.jpg portion
  const fp = req.url.split('/');
  const end = fp[fp.length - 1];
  const name = end.split('.')[0];
  if (!name)
    return res.sendStatus(404);

  return res.redirect(`https://storage.googleapis.com/${bucketName}/${ImagesStore}/${name}`);
};
