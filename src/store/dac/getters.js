//dac store
export function getIsLoaded(state) {
  return state.isLoaded;
}

export function getMemberTerms(state) {
  if (!state.memberTerms) {
    console.log("memberterms not loaded yet");
    return state.memberTerms;
  }
  return state.memberTerms;
}

export function getLatestMemberTerm(state) {
  if (!state.memberTerms) {
    console.log("memberterms not loaded yet");
    return {};
  }
  return state.memberTerms.slice(-1)[0];
}

export function getDacAdmins(state) {
  return state.dacAdmins;
}

export function getCustodianPermissions(state) {
  return state.custodianPermissions;
}

export function getAuthAccountPermLevel(state, getters, rootState) {
  let level = "one";
  if (state.dacAdmins.includes(rootState.user.accountName)) {
    level = "admin";
  }
  return level;
}

export function getlatestTermsUrl(state) {
  return state.latestTermsUrl;
}

export function getCustodians(state) {
  if (!state.custodians) {
    console.log("custodians not loaded yet");
    return [];
  }
  return state.custodians;
}

export function getCustodianConfig(state) {
  return state.custodianConfig;
}

export function getEnableCustPayments(state) {
  if (
    state.custodianConfig.requested_pay_max === null ||
    state.custodianConfig.requested_pay_max.contract === undefined
  ) {
    return false;
  }
  let req_pay_max_value = Number(
    state.custodianConfig.requested_pay_max.quantity.split(" ")[0]
  );
  if (req_pay_max_value <= 0) {
    return false;
  } else {
    return true;
  }
}

export function getWpConfig(state) {
  return state.wpConfig;
}

export function getCandidates(state) {
  return state.candidates;
}

export function getCustodianState(state) {
  return state.custodianState;
}

export function getWpCategories(state) {
  return state.wpCategories;
}
