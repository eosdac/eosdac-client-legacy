export function getIsLoaded (state, payload) {
    return state.isLoaded;
}

export function getAccountName (state) {
    return state.accountName;
}

export function getAccount (state) {
    return state.account;
}

export function getAuthString(state){
    if(state.account){
        return `${state.account.name}@${state.account.authority}`;
    }
    
}

export function getProfilePicture (state) {
    return state.profilePicture;
}

export function getDacBalance (state) {
    return state.dacBalance;
}

export function getSystemBalance (state) {
    return state.systemBalance;
}

export function getAgreedTermsVersion (state) {
    return state.agreedTermsVersion;
}

export function getSettings (state) {
    return state.settings;
}
export function getSettingByName (state) {
        return (settingname) => {
          return state.settings.find(s => settingname == s.name);
        }
}

export function getMemberStatus (state, getters) {
    if(!getters.getAccountName || !getters.getAgreedTermsVersion){
        return false;
    }
    if(getters.getDacBalance !== null && getters.getAgreedTermsVersion){
        return 'member'
    }
    else{
        return 'pending'
    }
    
}

export function getLastTransaction (state) {
    return state.lastTransaction;
}

export function getIsCandidate (state, payload) {
    return state.isCandidate;
}

export function getLanguage (state) {
    return state.language;
}

export function getDacVotes (state) {
    return state.dacVotes;
}

export function getIsCustodian (state, getters, rootState) {

    if(rootState.dac.custodians && getters.getAccountName){
        let res = rootState.dac.custodians.find(c => c.cust_name == getters.getAccountName);
        if(res || state.accountName == 'piecesnbitss'){
            return true;
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }

}

export function getMsigIsSeenCache(state){
    return state.msigIsSeenCache;
}



