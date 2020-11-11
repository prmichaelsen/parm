### Importing and Exporting Firestore Data
Backing up and restoring firestore.

#### Using gcloud CLI
Easiest, but requires enabling billing and upgrading to blaze plan. This kills the 
free quota and moves you to pay per use.


https://firebase.google.com/docs/firestore/manage-data/export-import

#### Using an npm package
A little more work, but this should let us do it without having to change
the billing plans of the backup or restore target.


https://itnext.io/how-to-backup-and-restore-cloud-firestore-d16537374640