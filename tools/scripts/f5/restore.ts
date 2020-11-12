#!/usr/bin/env ts-node-script

// run this script by entering this into the terminal: 
// ./tools/f5/backup.ts
const firestoreService = require('firestore-export-import');

const serviceAccount = require('../../../env/com-f5-parm-firebase.json');
 
// Initiate Firebase App
firestoreService.initializeApp(serviceAccount, 'https://com-f5-parm.firebaseio.com');

const options = {
  autoParseDates: true,
};
 
// Start importing your data
firestoreService.restore('tmp/firestore-backup.json', options);