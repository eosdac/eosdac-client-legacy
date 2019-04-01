
export function setScatter (state, payload) {
    state.scatter = payload;
}

export function setEosApi (state, payload) {
    state.eosApi = payload;
}

export function setEosScatter (state, payload) {
    state.eosScatter = payload;
}

export function setActiveNetwork (state, payload) {
    state.active_network = payload;
}

export function setDapp_version (state, payload){
    state.dapp_version = payload;
}
export function setLocal_storage_version (state, payload){
    state.local_storage_version = payload;
}


export function setNode (state, nodeurl){

    let [protocol, host, port] = nodeurl.split(':');

    let parts = {
        protocol : protocol,
        host: host.replace(/\//g, ''),
        port : port || (protocol === 'https' ? '443' : '80')
    }

    //set new node to the active network
    let n = state.networks.find(n => n.name == state.active_network);
    Object.assign(n, parts);

    //delete our apis
    state.eosApi = state.eosScatter = null;

}




