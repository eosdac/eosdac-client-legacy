
//dac store
export function setIsLoaded (state, payload) {
    state.isLoaded = payload;
}

export function setMemberTerms (state, memberterms) {
    memberterms = memberterms.rows.sort(function(a, b) {
        return a.version - b.version;
    });
      
    state.memberTerms = memberterms;
}

export function setCustodians (state, payload) {

    state.custodians = payload;  
}

export function setCustodianConfig(state, payload){
    state.custodianConfig = payload
}

export function setCandidates (state, payload) {

    state.candidates = payload;  
}