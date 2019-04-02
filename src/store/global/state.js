export default {
  //
  networks: require("../../statics/networks.json"),
  dapp_version: null,
  local_storage_version: null,
  active_network: process.env.DEFAULT_NETWORK || 'mainnet',
  scatter: null,
  eosApi: false,
  eosScatter: false
};
