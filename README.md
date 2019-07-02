# eosDAC Client

![image](https://user-images.githubusercontent.com/44613132/55268864-1dc82380-528e-11e9-9715-454457b8506e.png)

## Purpose
This is the member client where the DAC members will interface with the deployed smart contract code. The code is written in javascript using Vue.js and [Quasar Framework](https://quasar.dev).

## Pre-Requisites
You want to be able to read javascript code and have a basic understanding of frontend web development. If you want to simply change the assets to your DAC's messaging, branding, and images then the process is not too difficult.

[Original Design document](https://docs.google.com/document/d/1C4yzFNpK0Iz0Ru0gz28HeLJic5vZWBmVl3wV8czhVS4/edit#).

## Install

[yarn](https://yarnpkg.com) is required to install

```bash
$ git clone https://github.com/eosdac/eosdac-client.git
$ cd eosdac-client
$ yarn
```

## Customize the eosdac-client

Visit https://github.com/eosdac/boilerplate-client-extension for more info.

Add custom colors, pages, routes and vuex stores. It's recommended to extend and customize the eosDAC client in the extensions folder so you can pull in future updates without losing your customizations. The boilerplate extension already contains a mandatatory home screen (eosDAC) and a custom example page with dedicated vuex store. You'll also find a component to extend the main menu. In production you might want to manage the contents of the extention folder as a git submodule. The command below will simply clone the remote repo in the src/extensions folder.

```bash
cd eosdac-client
yarn add_extensions https://github.com/eosdac/boilerplate-client-extension.git extensions
```
If you want a tighter coupling between the main repo and your extensions repo you can create a git submodule.
```bash
cd eosdac-client
git submodule add https://github.com/your_repo/your_dac-client-extension.git src/extensions
```


## Quickstart

Opens browser window automatically [http://localhost:8080](http://localhost:8080)

```bash
yarn dev
```

## Deployment

Build the project for deployment.

```bash
yarn build
```

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

If you want to build and run specifically for the jungle tesnet, you can run `DEFAULT_NETWORK=jungle quasar build` 

![image](https://user-images.githubusercontent.com/44613132/55268765-5b787c80-528d-11e9-8d6c-24f75526888b.png)

![image](https://user-images.githubusercontent.com/44613132/55268803-aa261680-528d-11e9-97bb-8d492bc5b3f1.png)

![image](https://user-images.githubusercontent.com/44613132/55268811-c75ae500-528d-11e9-8332-fd71ff648dc0.png)

![image](https://user-images.githubusercontent.com/44613132/59903601-ab389100-9401-11e9-942e-7bb437708416.png)

![image](https://user-images.githubusercontent.com/44613132/59903659-db802f80-9401-11e9-874f-6ba7c44fb000.png)

![image](https://user-images.githubusercontent.com/44613132/59903752-12564580-9402-11e9-8dd9-e225286b74c9.png)


