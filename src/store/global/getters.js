
export function getScatter (state) {
    return state.scatter;
}

export function getAccountName (state) {
    return state.accountName;
}

export function getActiveNetwork (state) {
    return state.networks.find(n => n.name == state.active_network);
}

export function getActiveNetworkName (state) {
    return state.active_network;
}

export function getConfig (state) {
    return state.config;
}

export function getDapp_version (state){
    return state.dapp_version
}
