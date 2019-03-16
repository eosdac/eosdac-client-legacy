//dac store
export function getIsLoaded (state) {
    return state.isLoaded;
}

export function getMemberTerms (state) {
    if(!state.memberTerms){
        console.log('memberterms not loaded yet');
        return state.memberTerms;
    }
    return state.memberTerms;
}

export function getLatestMemberTerm (state) {
    if(!state.memberTerms){
        console.log('memberterms not loaded yet');
        return {};
    }
    return state.memberTerms.slice(-1)[0];
}

export function getlatestTermsUrl (state) {
    return state.latestTermsUrl;
}

export function getCustodians (state) {
    if(!state.custodians){
        console.log('custodians not loaded yet');
        return [];
    }
    return state.custodians;
}

export function getCustodianConfig(state, payload){
    return state.custodianConfig;
}

export function getCandidates (state, payload) {

    return state.candidates;
}

export function getCustodianState (state, payload) {
    return state.custodianState;
}
