
class configLoader {

  constructor( networkname){

    this.configFile = require(`../statics/config.${networkname}.json`);
    // store.commit('global/setConfig', this.configFile);
    
  }

  get(configquery){

    switch (configquery) {
      case 'defaultnode':
        return this.configFile.api.default_eos_node;
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
      case 'bpnodeapi':
        return this.configFile.api.bpnodes;
      case 'firehoseapi':
        return this.configFile.api.firehose;
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
  let config = new configLoader(networkname);
  store.commit('global/setNode', config.get('defaultnode') );
  Vue.prototype.$configFile = config;
}

// export {configFile}
