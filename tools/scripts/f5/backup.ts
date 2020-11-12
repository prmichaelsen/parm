#!/usr/bin/env ts-node-script

import { 
  resolve, writeEnv, writeJson
} from './util';

// run this script by entering this into the terminal: 
// ./tools/f5/backup.ts
const firestoreService = require('firestore-export-import');
// this line will throw an error, but this is a backup
// script one-off, so it's not worth it to me to
// fix it.
import { firebase } from  '../../../libs/util/env/secrets/firebase';

const serviceAccount = require('../../../env/parm-names-not-numbers.json');
 
// Initiate Firebase App
firestoreService.initializeApp(serviceAccount, firebase.databaseURL);
 
// Start exporting your data
firestoreService
  .backups()
  .then((data) => {
    writeJson({ fp: 'tmp/firestore-backup.json', data });
  });