export function getNodeInfo(state, payload) {
  return state.nodeInfo;
}
export function getScatter(state) {
  return state.scatter;
}

export function getDacApi(state) {
  return state.eosApi;
}

export function getAccountName(state) {
  return state.accountName;
}

export function getActiveNetwork(state) {
  return state.networks.find(n => n.name == state.active_network);
}

export function getNetworks(state) {
  return state.networks;
}

export function getActiveNetworkName(state) {
  return state.active_network;
}

export function getDapp_version(state) {
  return state.dapp_version;
}

export function getLocal_storage_version(state) {
  return state.local_storage_version;
}

export function getChainId(state) {
  return state.chainId;
}
