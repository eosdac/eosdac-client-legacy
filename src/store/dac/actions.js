
export async function initRoutine ({state, commit, dispatch}, vm ) {
    commit('setIsLoaded', false);
    const api = await dispatch('global/getEosApi', false, {root : true} );
    console.log('init app store');

    //requests to get dac info, doesn't require user to be logged in
    let requests = [
        api.getMemberTerms(),
        api.getCustodians(),
        api.getContractConfig('custodian')
    ]

    let [memberterms, custodians, custconfig] = await Promise.all(requests);
    commit('setMemberTerms', memberterms);
    commit('setCustodians', custodians);
    commit('setCustodianConfig', custconfig);
    commit('setIsLoaded', true);
    //load in background
    dispatch('fetchActiveCandidates');
}

/////////////////////////////////////////////////////////////////////////////////////////////////

export async function fetchCustodians ({state, commit, dispatch} ) {

    const api = await dispatch('global/getEosApi', false, {root : true} );

    let requests = [
        api.getCustodians(),
    ]

    let [custodians] = await Promise.all(requests);
    console.log('custodians',custodians)
    if(custodians){
        commit('setCustodians', custodians);
        return custodians;
    }
    else{
        return [];
    }
}

export async function fetchActiveCandidates ({state, commit, dispatch} ) {

    const api = await dispatch('global/getEosApi', false, {root : true} );
    
    let candidates = (await api.getCandidates()).filter(c=> c.is_active);

    candidates.sort(function(a, b) {
        let t = b.total_votes - a.total_votes;
        return t;
    });

    candidates = candidates.map((c, i)=>{c.rank = i+1; c.selected = false; return c})

    let candidate_names = candidates.map(c => c.candidate_name);
    let profiles = await this._vm.$profiles.getProfiles(candidate_names);
    candidates.forEach(c =>{
        let cand_profile = profiles.find(p => p._id == c.candidate_name);
        if(cand_profile){
            c.profile = cand_profile.profile;
        }
        else{
            c.profile = false;
        }
    });
    console.log('active candidates with profile', candidates);
    commit('setCandidates', candidates);
    return candidates;

}

export async function fetchMsigProposals({rootState}, payload={status:1}){
    //status 1: active; 2: executed; 0: cancelled
    let url = this._vm.$configFile.get('memberclientapi');
    return this._vm.$axios.post(url+'/msigproposals', payload).then(r => {
        // console.log(r.data)
        return r.data;
      }).catch(e => {
        console.log('could not load msig proposals from db');
        return [];});
}

export async function fetchApprovalsFromProposal({dispatch}, payload){
    const api = await dispatch('global/getEosApi', false, {root : true} );
    let res = await api.getApprovalsFromProposal(payload);
    return res;
}

export async function fetchControlledAccounts({dispatch}){
    const api = await dispatch('global/getEosApi', false, {root : true} );
    let ctrl = await api.getControlledAccounts('dacauthority');
    console.log(ctrl)

}

