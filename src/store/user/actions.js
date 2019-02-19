import { Notify } from 'quasar'
import {openURL} from 'quasar'

export async function loggedOutRoutine ({commit} ) {
    commit('setIsLoaded', false );

    commit('setAccountName', null );
    commit('setDacBalance', null);
    commit('setAgreedTermsVersion', null);
    commit('setAccount', null);
    commit('global/setEosApi', null, {root: true});
    commit('global/setEosScatter', null, {root: true});
    commit('setProfilePicture', null);
    commit('setIsCandidate', null);

    

}

export async function loggedInRoutine ({state, commit, dispatch}, accountname) {

    commit('setAccountName', accountname );
    commit('setIsLoaded', false );

    this._vm.$profiles.getAvatars([accountname]).then(a => {
        commit('setProfilePicture', a[0].image);
    })

    const api = await dispatch('global/getEosApi', false, {root : true} );

    //requests for setting up the logged in user
    let requests = [
        // api.getAccount(accountname),
        api.getBalance(accountname),
        api.getAgreedTermsVersion(accountname),
        api.isCandidate(accountname)
        
    ]

    let [ balance, termsversion, isCandidate] = await Promise.all(requests);
    console.log('is canddate:', isCandidate)
    commit('setDacBalance', balance);
    commit('setAgreedTermsVersion', termsversion);
    // commit('setAccount', account);
    commit('setIsCandidate', isCandidate);

    commit('setIsLoaded', true );

    api.getBalance(accountname, 'eosio.token' , 'EOS').then(x =>{
        commit('setSystemBalance', x);
    }).catch(e=>console.log(e));

}

export async function fetchIsCandidate ({state, commit, dispatch}, accountname=false) {
    const accountN = accountname || state.accountName;
    const api = await dispatch('global/getEosApi', false, {root : true} );
    let isCandidate = await api.isCandidate(accountN);
    if(!accountname){
        commit('setIsCandidate', isCandidate);
    }
    else{
        return isCandidate;
    }
}

export async function fetchDacVotes ({state, commit, dispatch}, accountname=false) {
    const accountN = accountname || state.accountName;
    const api = await dispatch('global/getEosApi', false, {root : true} );
    let votes = await api.getVotes(accountN);
    if(!accountname){
        commit('setDacVotes', votes);
    }
    else{
        return votes;
    }
}

export async function fetchBalances ({state, commit, dispatch}, accountname=false) {
    const accountN = accountname || state.accountName;
    const api = await dispatch('global/getEosApi', false, {root : true} );
    let requests = [
        api.getBalance(accountN),
        api.getBalance(accountN, 'eosio.token' , 'EOS')
        
    ]
    let [dacbalance, systembalance] = await Promise.all(requests);
    if(!accountname){
        commit('setDacBalance', dacbalance);
        commit('setSystemBalance', systembalance);
    }
    else{
        return [dacbalance, systembalance];
    }
}



export async function transact ({state, rootState, commit, dispatch, getters}, payload) {


    let actions =payload.actions;

    //if not logged in
    if(!state.accountName){
        console.log('please login first');

        if(getters['getSettingByName']('notify_info_msg').value){
            Notify.create({
                message: `Please Login`,
                timeout: 5000, // in milliseconds; 0 means no timeout
                type: 'info',
                detail: 'You need to login before doing actions',
                position: 'bottom-right', // 'top', 'left', 'bottom-left' etc.
                actions: [
                    {
                      label: 'login',
                      icon: 'lock', // optional
                      handler: () => {
                        dispatch('global/login', null, {root: true});
                      }
                    }
                ],
            });
        }
        
        return;
    }

    console.log('loading scatter');
    commit('ui/setShowTransactionOverlay', 'loading', {root: true});

    let account = (await rootState.global.scatter.login()).accounts[0]; //same as getIdentity

    if((account.name !== state.accountName) ){
        console.log('Yooo stop messing with scatter!');
        commit('setAccountName', account.name );
    }

    actions = actions.map(action =>{
        if(!action.authorization){
            action.authorization = [{actor: account.name, permission: account.authority} ];
        }
        return action;
    });

    
    try {
        let [eos] = await dispatch('global/getEosScatter', null, {root: true});
        setTimeout(()=>{commit('ui/setShowTransactionOverlay', 'sign', {root: true}); }, 1500);
        const result = await eos.transact({actions: actions}, {blocksBehind: 3, expireSeconds: 30} );
        commit('ui/setShowTransactionOverlay', 'success', {root: true});
        commit('setLastTransaction', result);
        
        
        if(getters['getSettingByName']('notify_success_msg').value){
            Notify.create({
                message:  this._vm.i18n.t('transaction.transaction_successful'),
                timeout: 7000, // in milliseconds; 0 means no timeout
                type: 'positive',
                detail: actions.map(a=> `${a.account} > ${a.name}`).join(', '),
                position: 'bottom-right', // 'top', 'left', 'bottom-left' etc.
                // closeBtn: true, // or string as button message e.g. 'dismiss'
                actions: [
                    {
                      label: 'Explorer',
                      icon: 'link', // optional
                      handler: () => {
                        openURL(`https://jungle.bloks.io/transaction/${result.transaction_id}`)
                      }
                    }
                ],
            });
        }

        return true;
    } catch(e){
        let message ='unknown_error';
        console.log('error', e);


        if(e.type=='signature_rejected'){
            message = 'transaction.signature_rejected';
            commit('ui/setShowTransactionOverlay', 'cancelled', {root: true});
        }
        else{
            // console.log(JSON.stringify(e.json, null, 2) );
            message = e.json.error.details[0].message;
            commit('ui/setShowTransactionOverlay', 'error', {root: true});
        }

        if(getters['getSettingByName']('notify_error_msg').value){
            Notify.create({
                message: `Transaction Error`,
                timeout: 7000, // in milliseconds; 0 means no timeout
                type: 'negative',
                detail: this._vm.i18n.t(message),
                position: 'bottom-right', // 'top', 'left', 'bottom-left' etc.
                closeBtn: true, // or string as button message e.g. 'dismiss'
            });
        }
        return false;


    }
}
