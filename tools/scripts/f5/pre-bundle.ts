#!/usr/bin/env ts-node-script

import { App } from './interface';
import { firebase } from './firebase';
import { 
  environment, writeEnv, writeJson
} from './util';
const readdirsr =  require('recursive-readdir');

import * as nunjucks from 'nunjucks';

nunjucks.configure({
  autoescape: false,
}); 

export const preBundle = async (appNames = []) => {
  const env = environment();
  const collection = `${env}.parm.f5.apps`;

  const e = await firebase()
    .firestore()
    .collection(collection)
    .get();
    
  const workspace = require('../../../workspace.json');
  const f5 = workspace.projects.f5;
  const buildTarget = f5.architect.build;
  const bundleTarget = f5.architect.bundle;
  const serveTarget = f5.architect.serve;

  const files: string[] = await new Promise((res, rej) => 
    readdirsr('./apps/f5/src/', (err, files) => {
      if (err)
        rej(err);
      res(files);
    })
  );
  
  const apps: App[] = e.docs.map(d => d.data() as App);
  apps
    .filter(app => appNames.some(name => app.app === name))
    .forEach(app => {
      console.log(`pre-bundling ${app.app}...`);
      // save the app config in the source dir
      const fp = `./apps/f5/src/environments/${app.app}.ts`;
      writeEnv({ fp, data: app });

      // dynamically replace any files
      // that include the name of the app
      // as a suffix, eg ./file.parm.ts
      // will overwrite the default ./file.ts
      const suffix = `.${app.app}.ts`;
      const replacements = files
        .filter(f => f.includes(suffix))
        .map(f => ({
          replace: f.replace(suffix, '.ts'),
          with: f, 
        }));

      const configuration = {
        "outputPath": `dist/apps/${app.app}`,
        "fileReplacements": [
          {
            "replace": "apps/f5/src/environments/environment.ts",
            "with": fp,
          },
          ...replacements,
        ]
      };

    // right now, callously overwrite any existing 
    // config for 'app'

    // instruct build  and bundle target for 'app' to 
    // use the new env file
    buildTarget.configurations = {
      ...buildTarget.configurations,
      [app.app]: {...configuration},
    };
    bundleTarget.configurations = {
      ...bundleTarget.configurations,
      [app.app]: {...configuration},
    }; 
    // add a serve target for our new 
    // build target
    serveTarget.configurations = {
      ...serveTarget.configurations,
      [app.app]: { buildTarget: `f5:build:${app.app}` },
    };

    writeJson({
      fp: './workspace.json',
      data: workspace,
    });
  }); 
}