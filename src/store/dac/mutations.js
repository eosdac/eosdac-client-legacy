//dac store
export function setIsLoaded(state, payload) {
  state.isLoaded = payload;
}

export function setMemberTerms(state, memberterms) {
  memberterms = memberterms.rows.sort(function(a, b) {
    return a.version - b.version;
  });

  state.memberTerms = memberterms;
}

export function setCustodians(state, payload) {
  state.custodians = payload;
}

export function setDacAdmins(state, payload) {
  state.dacAdmins = payload;
}

export function setCustodianConfig(state, payload) {
  state.custodianConfig = payload;
}

export function setWpConfig(state, payload) {
  state.wpConfig = payload;
}

export function setCandidates(state, payload) {
  state.candidates = payload;
}

export function setCandidateVote(state, payload) {
  let candidate_name = payload.candidate_name;
  let vote_amount = payload.total_votes;
  if (state.candidates) {
    let cand = state.candidates.find(c => c.candidate_name == candidate_name);
    cand.total_votes = vote_amount;
  }
}

export function setCustodianState(state, payload) {
  state.custodianState = payload;
}
