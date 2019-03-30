# eosdactoolkit

## Purpose
This is the member client where the DAC members will interface with the deployed smart contract code. The code is written in javascript using Vue.js and Quasar-framework.js.

## Pre-Requisites
You want to be able to read javascript code and have a basic understanding of frontend web development. If you want to simply change the assets to your DAC's messaging, branding, and images then the process is not too difficult.

[Original Design document](https://docs.google.com/document/d/1C4yzFNpK0Iz0Ru0gz28HeLJic5vZWBmVl3wV8czhVS4/edit#).

## Install

[yarn](https://yarnpkg.com) is required to install

```bash
$ git clone https://github.com/eosdac/memberclient.git
$ cd memberclient
$ yarn
```

## Extend memberclient
Add custom pages, routes and vuex stores. It's recommended to extend and customize the memberclient in the extensions folder so you can pull in future updates without losing your customizations. The eosDAC branded extension repo will already contain a mandatatory home screen (eosDAC) and a custom example page with dedicated vuex store. You'll also find a component to extend the main menu. In production you might want to manage the contents of the extention folder as a git submodule. The command below will simply clone the remote repo in the src/extensions folder.

eosDAC the DAC is branded and customized with the following repo https://github.com/eosdac/memberclient_extension. Feel free to fork this repo to get started. In fact it's recommended to fork the repo if you plan to customize the memberclient.

```bash
yarn add_extensions https://github.com/eosdac/memberclient_extension.git extensions
```
If you want a tighter coupling between the main repo and your extensions repo you can create a git submodule.
```bash
git submodule add https://github.com/your_repo/your_extension.git src/extensions
```

## Add or change language strings
Use the extensions/i18n folder to add your custom strings or overwrite existing keys


## Quickstart

Opens browser window automatically [http://localhost:8080](http://localhost:8080)

```bash
$ npm start
```

## Deployment

You can run the deploy script to checkout the correct release tag and copy the dist/spa-mat files to a dist/deploy folder which you can then make the root folder of your nginx website.

Example:

```bash
$ deploy.sh v0.3.1 true
```

That will run tag v0.3.1 locally.

```bash
$ deploy.sh v0.3.1
```

That will build v0.3.1 and copy the results to the dist/deploy folder.
