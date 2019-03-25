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
## add language strings
Add the default language strings to the project. You can use your own repo too.
```bash
yarn add_i18n https://github.com/eosdac/memberclient_i18n.git .
```

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
