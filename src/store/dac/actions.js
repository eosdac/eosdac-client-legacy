
export async function initRoutine ({state, commit, dispatch}, vm ) {
    commit('setIsLoaded', false);
    const api = await dispatch('global/getEosApi', false, {root : true} );

    //requests to get dac info, doesn't require user to be logged in
    const memberterms = await api.getMemberTerms();
    const custodians = await api.getCustodians();
    const custconfig = await api.getContractConfig('custodian');

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

    const custodians = await api.getCustodians();
    console.log('custodians',custodians)
    if (custodians) {
        commit('setCustodians', custodians);
        return custodians;
    } else {
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

    const candidate_names = candidates.map(c => c.candidate_name);
    const profiles = await this._vm.$profiles.getProfiles(candidate_names);
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
    const url = this._vm.$configFile.get('memberclientapi');
    return this._vm.$axios.post(url+'/msigproposals', payload).then(r => {
        // console.log(r.data)
        return r.data;
      }).catch(e => {
        console.log('could not load msig proposals from db');
        return [];});
}

export async function fetchApprovalsFromProposal({dispatch}, payload){
    const api = await dispatch('global/getEosApi', false, {root : true} );
    const res = await api.getApprovalsFromProposal(payload);
    return res;
}

export async function fetchControlledAccounts({dispatch}){
    const api = await dispatch('global/getEosApi', false, {root : true} );
    const ctrl = await api.getControlledAccounts('dacauthority');
    console.log(ctrl)
}

export async function fetchCustodianContractState({commit, dispatch, state}){
    const api = await dispatch('global/getEosApi', false, {root : true} );
    const xstate = await api.getCustodianContractState();
    if (xstate){
        commit('setCustodianState', xstate)
    }
}

export async function fetchWorkerProposals({rootState}, payload={}){

    const url = this._vm.$configFile.get('memberclientstateapi');
    return this._vm.$axios.get(url+'/get_proposals?state=0&limit=10&skip=0', payload).then(r => {
        // console.log(r.data)
        return r.data;
      }).catch(e => {
        console.log('could not load worker proposals from api');
        return [];});
}

