
class configLoader {

  constructor( networkname){

    this.configFile = require(`../statics/config.${networkname}.json`);
    // store.commit('global/setConfig', this.configFile);
    
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
      case 'systemtokencontract':
        return 'eosio.token';
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
        break;
      case 'memberclientapi':
        return this.configFile.api.memberclient;
        break;
      case 'external':
        return this.configFile.external;
        break;
      default:
        return `***${configquery} not yet subscribed in config-loader***`
        break;
    }
  }
  
  setConfig(conf){
    this.configFile = conf;
  }

}

export default ({
  Vue,
  store
}) => {

  let networkname = store.getters['global/getActiveNetworkName'];

  Vue.prototype.$configFile = new configLoader(networkname);
}

// export {configFile}
