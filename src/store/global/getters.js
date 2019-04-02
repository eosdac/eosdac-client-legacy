export function getScatter(state) {
  return state.scatter;
}

export function getEosApi(state) {
  return state.eosApi;
}

export function getAccountName(state) {
  return state.accountName;
}

export function getActiveNetwork(state) {
  return state.networks.find(n => n.name == state.active_network);
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
