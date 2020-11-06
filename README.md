# Parm

This project was generated using [Nx](https://nx.dev).

To get the most out of Nx, consider the Nx console vs code plugin.
This helps you generate commands. You can see a list of commands,
which schematics are installed, and what options are available along with their descriptions. The tool generates the preview terminal commands in the
console while you edit the options via the gui.

## Development
To get started, install nx via `npm i -g @nrwl/cli`, set the required Firebase admin secrets in `./env/parm-app.json` and then run `nx serve your-app` or `nx run react:storybook` to start a development server. You can attach the debugger via vs code's debug tools.

React storybooks in the `libs/react` directory will be dynamically included simply by using the `.stories.tsx` postfix.

To see the live storybook:
```sh
nx run react:storybook
```

## Roadmap
* Twitch connection
* Discord connection
* Reddit connection

## Library selection
[awesome-nodejs] is a curated list of useful node libraries.

## Add metadata to your website
This is for the stuff that shows up in link previews and all that.

Here's a resource on that: https://medium.com/slack-developer-blog/everything-you-ever-wanted-to-know-about-unfurling-but-were-afraid-to-ask-or-how-to-make-your-e64b4bb9254

## Quick start

* `ng test`: run all tests
* `ng e2e`: run all e2e tests
* `ng run react:storybook`: start and watch the storybook
* `ng run react:e2e:dev`: start and watch the e2e tests
* `ng run react:e2e:update`: update the image snapshot tests

Check `package.json` and `angular.json` for more options.

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/nx-logo.png" width="450"></p>

🔎 **Nx is a set of Extensible Dev Tools for Monorepos.**

## Quick Start & Documentation

[Nx Documentation](https://nx.dev/angular)

[10-minute video showing all Nx features](https://nx.dev/angular/getting-started/what-is-nx)

[Interactive Tutorial](https://nx.dev/angular/tutorial/01-create-application)

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are some plugins which you can add to your workspace:

- [Angular](https://angular.io)
  - `ng add @nrwl/angular`
- [React](https://reactjs.org)
  - `ng add @nrwl/react`
- Web (no framework frontends)
  - `ng add @nrwl/web`
- [Nest](https://nestjs.com)
  - `ng add @nrwl/nest`
- [Express](https://expressjs.com)
  - `ng add @nrwl/express`
- [Node](https://nodejs.org)
  - `ng add @nrwl/node`

## Generate an application

Run `ng g @nrwl/angular:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `ng g @nrwl/angular:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

### Generate a new react library
> Nov 1 2020

Use this whenever you create a new react shared component or hook.

It will create the component in its _own_ library. This is following
my principle of one component per lib.

Additionally, you will get storybooks for free. Just create a `.stories.tsx`.

```sh
nx generate @nrwl/react:library --name=date-add --directory=react --no-interactive --dry-run
nx generate @nrwl/react:component --name=DateSubtracter --project=react-date-subtracter --export --no-interactive --dry-run 
```

Libraries are sharable across libraries and applications. They can be imported from `@parm/mylib`.

## Development server

Run `ng serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng g component my-component --project=my-app` to generate a new component.

## Build

Run `ng build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev/angular) to learn more.

## How to publish to NPM
This package publishes to NPM following the steps of [this guide](https://blog.nrwl.io/publishing-react-libraries-made-easy-d5b3d013deba).

## How to setup Cypress for visual regression testing
https://medium.com/norwich-node-user-group/visual-regression-testing-with-cypress-io-and-cypress-image-snapshot-99c520ccc595

## Generate a nest component
```sh
ng g @nestjs/schematics:provider events --sourceRoot=apps/greenroom-rest-api/src --path=app 
```

## To run a production build
```sh
npm run nx run greenroom-ui:build:production
```
and to serve in prod
```
~/node_modules/bin/ng serve greenroom-ui --allowed-hosts www.greenroomfinder.app
```

### How to setup Jenkins
Configure jenkins to push build statuses to GitHub: [jenkins-github]

## Add swagger
`nestjs` provides guide for adding [Swagger] to your nestjs app. However, we need to make some modifications in order to get it to work with `nx`.

We will extend the `webpack.config` for the project we wish to add swagger to. For specific implementation details, see the [parm/swagger], the commit that adds swagger to this project.

You can now navigate to http://localhost:3333/api to see the explorer and http://localhost:3333/api-json to see the generated json.

## Help with PM2
Check out [PM2 devhints](https://devhints.io/pm2). 

## Firebase hosting
Followed this guide to set up firebase hosting.

https://www.youtube.com/watch?v=NrkFBmBFA6k

## Create a firebase google cloud function
```sh
nx generate @joelcode/gcp-function:http function-name
```
Don't put it in a sub dir because that somehow breaks stuff.

See [gcp-function] for more info.

Secrets management:
* https://cloud.google.com/functions/docs/env-var

```
gcloud functions deploy FUNCTION_NAME --set-env-vars FOO=bar
```

### Stripe
I followed this guide to start with stripe.

https://stripe.com/docs/development/quickstart

### Random images
Will provide a random image
https://picsum.photos/280/320?random=4

### References
* [jenkins-github]
* [Swagger]
* [react and nx]
* [parm/swagger] - the commit that adds swagger
* [awesome-nodejs] - curated list of useful nodejs libraries
* [openapi-generator] - generate api clients from oas3
* [gcp-function] - generate google cloud functions

 <!-- References -->
[jenkins-github]: https://stackoverflow.com/questions/14274293/show-current-state-of-jenkins-build-on-github-repo/16246831#16246831
[Swagger]: https://docs.nestjs.com/recipes/swagger
[react and nx]: https://blog.nrwl.io/powering-up-react-development-with-nx-cf0a9385dbec
[parm/swagger]: https://github.com/prmichaelsen/parm/tree/swagger
[awesome-nodejs]: https://github.com/sindresorhus/awesome-nodejs
[openapi-generator]: https://github.com/OpenAPITools/openapi-generator
[gcp-function]: https://github.com/JoelCode/gcp-function
