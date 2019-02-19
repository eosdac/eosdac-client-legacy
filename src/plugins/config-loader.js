// import configFile from '../statics/config.json'
// leave the export, even if you don't use it


class configLoader {

  constructor(store, networkname){

    this.configFile = require(`../statics/config.${networkname}.json`);
    store.commit('global/setConfig', this.configFile);
    
  }

  get(configquery){

    switch (configquery) {
      case 'tokencontract':
        return this.configFile.contracts.token.name;
        break;
      case 'custodianmemo':
        return this.configFile.contracts.custodian.memo;
        break;
      case 'custodiancontract':
        return this.configFile.contracts.custodian.name;
        break;
      case 'dactokensymbol':
        return this.configFile.contracts.token.symbol;
        break;
      case 'systemtokensymbol':
        return 'EOS';
        break;
      case 'systemmsigcontract':
        return this.configFile.contracts.system_msig.name;
        break;
      case 'dacmsigcontract':
        return this.configFile.contracts.dac_msig.name;
        break;
      case 'botcontract':
        return this.configFile.contracts.bot.name;
        break;
      case 'explorer':
        return this.configFile.external.explorer;
        return
      case 'memberclientapi':
        return this.configFile.api.memberclient;
        return
      case 'external':
        return this.configFile.external;
        return
      default:
        return `***${configquery} not yet subscribed in config-loader***`
        break;
    }
  }


}

export default ({
  Vue,
  store
}) => {

  let networkname = store.getters['global/getActiveNetworkName'];

  // const configFile =  require(`../statics/config.${networkname}.json`);
  
  // store.commit('global/setConfig', configFile);

  // Vue.prototype.$configFile = configFile;

  Vue.prototype.$configFile = new configLoader(store, networkname)
}

export {configFile}
