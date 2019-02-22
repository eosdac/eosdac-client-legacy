
class configLoader {

  constructor( networkname){

    this.configFile = require(`../statics/config.${networkname}.json`);
    // store.commit('global/setConfig', this.configFile);
    
  }

  get(configquery){

    switch (configquery) {
      case 'tokencontract':
        return this.configFile.contracts.token.name;
      case 'custodianmemo':
        return this.configFile.contracts.custodian.memo;
      case 'custodiancontract':
        return this.configFile.contracts.custodian.name;
      case 'dactokensymbol':
        return this.configFile.contracts.token.symbol;
      case 'systemtokensymbol':
        return 'EOS';
      case 'systemtokencontract':
        return 'eosio.token';
      case 'systemmsigcontract':
        return this.configFile.contracts.system_msig.name;
      case 'dacmsigcontract':
        return this.configFile.contracts.dac_msig.name;
      case 'botcontract':
        return this.configFile.contracts.bot.name;
      case 'explorer':
        return this.configFile.external.explorer;
      case 'memberclientapi':
        return this.configFile.api.memberclient;
      case 'external':
        return this.configFile.external;
      case 'authaccount':
        return this.configFile.authAccount;
      default:
        return `***${configquery} not yet subscribed in config-loader***`
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
