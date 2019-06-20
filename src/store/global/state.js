export default {
  //
  nodeInfo: null,
  networks: require("../../extensions/statics/config/networks.json"),
  dapp_version: null,
  local_storage_version: null,
  active_network: process.env.DEFAULT_NETWORK || "mainnet",
  chainId: null,
  scatter: null,
  eosApi: false,
  eosScatter: false
};
