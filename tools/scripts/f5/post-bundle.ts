import { App } from './interface';
import { 
  environment, writeJson, resolve
} from './util';

import * as fs from 'fs';
import * as nunjucks from 'nunjucks';
import * as mkdirp from 'mkdirp';
import { firebase } from './firebase';

nunjucks.configure({
  autoescape: false,
});

export const postBundle = async (appNames = []) => {
  const env = environment();
  const collection = `${env}.parm.f5.apps`;

  const e = await firebase()
    .firestore()
    .collection(collection)
    .get();

  const apps: App[] = e.docs.map(d => d.data() as App);
  apps
    .filter(app => appNames.some(name => app.app === name))
    .forEach(async app => {
      console.log(`post-bundling ${app.app}...`);
      const dist = resolve(`./dist/apps/${app.app}`);
      mkdirp.sync(dist);

      // write index.html
      (() => {
        const wt = resolve(dist + `/index.html`);
        const file = nunjucks.render('./templates/index.njk', app);
        fs.writeFileSync(wt, file, 'utf8');
      })();

      // write favicon.ico
      const options = {
        destination: resolve(dist + `/favicon.ico`),
      };
      // const bucket = (`app-${app.app}`);
      const bucket = 'parm-app.appspot.com';
      // await firebase
      await firebase()
        .storage()
        .bucket(bucket)
        .file('f5/favicon.ico')
        .download(options)
        ;
      // update the firebase.json
      (() => {
        const fb = require('../../../firebase.json');
        const hostConfig = fb.hosting.find(c => c.target === app.app);
        if (!hostConfig) {
          fb.hosting.push({
            target: app.app,
            public: `dist/apps/${app.app}`,
            ignore: [
              "firebase.json",
              "**/.*",
              "**/node_modules/**"
            ],
            rewrites: [
              {
                "source": "**",
                "destination": "/index.html"
              }
            ]
          });
        }
        const fp = resolve(`./firebase.json`);
        writeJson({ fp, data: fb });
      })(); 

  }); 
}