# function-google-me HTTP Google Cloud Function
**Describe your awesome function here!**

<div align="center">
  <img src="https://github.com/JoelCode/gcp-function/blob/master/http-function-structure.png?raw=true" width="300">
  <p>HTTP Function Structure</p>
</div>

<details>
<summary>What is @joelcode/gcp-function plugin?</summary>
@joelcode/gcp-function plugin is a set of extensible dev tools for Google Cloud Function within an Nx workspace.
* Create : `nx generate @joelcode/gcp-function:http functionName`
* Serve  : `nx serve functionName`
* Test   : `nx test functionName`
* Deploy : `nx deploy functionName`
</details>

<details>
<summary>What is a Google Cloud Functions?</summary>
Cloud Functions is a serverless execution environment for building and
connecting cloud services. With Cloud Functions you write simple, single-purpose
functions that are attached to events emitted from your cloud infrastructure and
services. Your function is triggered when an event being watched is fired.

* [Documentation](https://cloud.google.com/functions/docs)
* [Learn how to write a function from scratch.](https://cloud.google.com/functions/docs/first-nodejs)
</details>

<details>
<summary>What is NX?</summary>
Nx is a set of extensible dev tools for monorepo, which helps you develop like Google, Facebook, and Microsoft.
It has first-class support for many frontend and backend technologies, so its documentation comes in multiple flavours.

* [Documentation](https://nx.dev/angular/getting-started/why-nx)
</details>

## Setup

### Before you begin
1. Install [Node.js version 10 or greater](https://nodejs.org/)

1. Obtain authentication credentials.
    Create local credentials by running the following command and following the
    oauth2 flow (read more about the command [here](https://cloud.google.com/sdk/gcloud/reference/beta/auth/application-default/login)):

        gcloud auth application-default login

    Read more about [Google Cloud Platform Authentication](https://cloud.google.com/docs/authentication#projects_and_resources).

## Test the function
    nx serve function-google-me
    nx test function-google-me

## Deploy the function
    nx build function-google-me
    nx deploy function-google-me

> The 'build' option bundle all your internal dependencies in main.js & create a new package.json with your external dependencies (version number from root/package.json.)

## Others
### Reporting Errors to [Stackdriver Error Reporting](https://cloud.google.com/error-reporting/docs)

    // These WILL be reported to Stackdriver Error Reporting
    console.error(new Error('I failed you'));
    console.error('I failed you', new Error('I failed you too'));
    throw new Error('I failed you'); // Will cause a cold start if not caught

    // These will NOT be reported to Stackdriver Error Reporting
    console.info(new Error('I failed you')); // Logging an Error object at the info level
    console.error('I failed you'); // Logging something other than an Error object
    throw 1; // Throwing something other than an Error object
    callback('I failed you');
    res.status(500).send('I failed you');
### Nx Commands
    nx lint function-google-me
    nx format:write function-google-me
    nx format:write  function-google-me
    nx format:check  function-google-me
    nx affected --target=build
    nx build function-google-me --with-deps

### Google Cloud Commands
    gcloud functions deploy functionGoogleMe --set-env-vars foo=bar, zoo=lop
    gcloud functions functionGoogleMe --update-env-vars foo=bar, zoo=lop
    gcloud functions deploy functionGoogleMe --service-account emailOfServiceAccount
    gcloud functions deploy functionGoogleMe --max-instances maxInstancesCount
    gcloud functions deploy functionGoogleMe --clear-max-instances
    gcloud functions logs read functionGoogleMe
