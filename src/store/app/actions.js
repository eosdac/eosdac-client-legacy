

export async function initRoutine ({state, commit, dispatch} ) {

    const api = await dispatch('global/getEosApi', false, {root : true} );
    console.log('init app store')
    //requests to get dac info, doesn't require user to be logged in
    let requests = [
        api.getMemberTerms(),
    ]

    let [memberterms] = await Promise.all(requests);

    console.log(memberterms)
}
