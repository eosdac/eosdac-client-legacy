export async function initRoutine({ state, commit, dispatch }, vm) {
  commit("setIsLoaded", false);
  const api = await dispatch("global/getDacApi", false, { root: true });

  let custodianconfig = await api.getContractConfig("custodian");
  console.log("custodian config", custodianconfig);
  //requests to get dac info, doesn't require user to be logged in
  let requests = [
    api.getMemberTerms(),
    api.getCustodians(custodianconfig.numelected),
    api.getTokenStats()
  ];

  let [memberterms, custodians, tokenstats] = await Promise.all(requests);
  commit("setMemberTerms", memberterms);
  commit("setTokenStats", tokenstats);
  commit("setCustodians", custodians);
  commit("setCustodianConfig", custodianconfig);
  commit("setIsLoaded", true);
  //load in background
  dispatch("fetchActiveCandidates");
  dispatch("fetchDacAdmins");
}

/////////////////////////////////////////////////////////////////////////////////////////////////

export async function fetchCustodians({ state, commit, dispatch }) {
  const api = await dispatch("global/getDacApi", false, { root: true });

  let requests = [api.getCustodians()];

  let [custodians] = await Promise.all(requests);
  console.log("custodians", custodians);
  if (custodians) {
    commit("setCustodians", custodians);
    return custodians;
  } else {
    return [];
  }
}

export async function fetchActiveCandidates({ state, commit, dispatch }) {
  const api = await dispatch("global/getDacApi", false, { root: true });

  let candidates = await api.getCandidates();

  if (candidates) {
    candidates = candidates.filter(c => c.is_active);
  } else {
    return [];
  }

  candidates.sort(function(a, b) {
    let t = b.total_votes - a.total_votes;
    return t;
  });

  for (let i = 0; i < candidates.length; i++) {
    candidates[i].rank = i + 1;
    candidates[i].selected = false;
  }

  let candidate_names = candidates.map(c => c.candidate_name);
  let profiles = await this._vm.$profiles.getProfiles(candidate_names);
  candidates.forEach(c => {
    let cand_profile = profiles.find(p => p.account == c.candidate_name);
    if (cand_profile) {
      c.profile = cand_profile.profile;
    } else {
      c.profile = false;
    }
  });
  console.log("active candidates with profile", candidates);
  commit("setCandidates", candidates);
  return candidates;
}

export async function fetchDacAdmins({ commit, dispatch }) {
  const api = await dispatch("global/getDacApi", false, { root: true });
  let res = await api.getAccount(this._vm.$configFile.get("authaccount"));
  if (res && res.permissions) {
    let admins = res.permissions.find(p => p.perm_name == "admin");
    if (!admins) return;
    admins = admins.required_auth.accounts.map(a => a.permission.actor);

    if (admins && admins.length) {
      console.log("Dac Admins", admins);
      commit("setDacAdmins", admins);
    }
  }
}

export async function fetchAccount({ commit, dispatch }, payload) {
  const api = await dispatch("global/getDacApi", false, { root: true });
  let res = await api.getAccount(payload.accountname);
  if (res && res.account_name) {
    return res;
  }
}

export async function fetchApprovalsFromProposal({ dispatch }, payload) {
  const api = await dispatch("global/getDacApi", false, { root: true });
  let res = await api.getApprovalsFromProposal(payload);
  return res;
}

export async function fetchControlledAccounts({ dispatch }) {
  const api = await dispatch("global/getDacApi", false, { root: true });
  let ctrl = await api.getControlledAccounts(
    this._vm.$configFile.get("authaccount")
  );
  console.log(ctrl);
}

export async function fetchTokenStats({ commit, dispatch, state }) {
  const api = await dispatch("global/getDacApi", false, { root: true });
  let stats = await api.getTokenStats();
  if (stats) {
    debugger;
    commit("setTokenStats", stats);
    console.log("stats", stats);
    return stats;
  }
}

export async function fetchCustodianContractState({ commit, dispatch, state }) {
  const api = await dispatch("global/getDacApi", false, { root: true });
  let xstate = await api.getCustodianContractState();
  if (xstate) {
    console.log("custodianState", xstate);
    commit("setCustodianState", xstate);
    return xstate;
  }
}

export async function fetchWpConfig({ commit, dispatch, state }) {
  const api = await dispatch("global/getDacApi", false, { root: true });
  let conf = await api.getContractConfig("wp");
  if (conf) {
    commit("setWpConfig", conf);
  }
}

export async function fetchCustodianPermissions({
  commit,
  dispatch,
  state,
  rootState
}) {
  const api = await dispatch("global/getDacApi", false, { root: true });
  let custom_cand_permissions = await api.getCandidatePermissions();
  console.log("custom cand permissions", custom_cand_permissions);

  let requested = rootState.dac.candidates
    .slice(0, rootState.dac.custodianConfig.numelected * 2)
    .map(c => {
      let permission = "active"; //default
      let custom = custom_cand_permissions.find(
        ccp => ccp.cand == c.candidate_name
      );
      if (custom) {
        permission = custom.permission;
      }
      return { actor: c.candidate_name, permission: permission };
    });
  commit("setCustodianPermissions", requested);
  return requested;
}

export async function fetchWorkerProposals({}, payload = {}) {
  let url = this._vm.$configFile.get("memberclientstateapi");
  const header = {
    "X-DAC-Name": this._vm.$configFile.get("dacscope")
  };
  return this._vm
    .$axios({
      method: "get",
      url: `${url}/proposals`,
      params: payload,
      headers: header
    })
    .then(r => {
      // console.log(r.data)
      return r.data;
    })
    .catch(e => {
      console.log("could not load worker proposals from api");
      return [];
    });
}

export async function fetchWorkerProposalsInbox({}, payload = {}) {
  let url = this._vm.$configFile.get("memberclientstateapi");
  const header = {
    "X-DAC-Name": this._vm.$configFile.get("dacscope")
  };
  return this._vm
    .$axios({
      method: "get",
      url: `${url}/proposals_inbox`,
      params: payload,
      headers: header
    })
    .then(r => {
      // console.log(r.data)
      return r.data;
    })
    .catch(e => {
      console.log("could not load worker proposals from api");
      return [];
    });
}

//canceltoken to fix glitch when multiple requests are made fast
var call;
export async function fetchMsigProposals({}, payload = {}) {
  // {status: 1, limit:0, skip: 1}
  if (call) {
    call.cancel();
  }
  call = this._vm.$axios.CancelToken.source();
  let url = this._vm.$configFile.get("memberclientstateapi");
  const header = {
    "X-DAC-Name": this._vm.$configFile.get("dacscope")
  };
  return this._vm
    .$axios({
      method: "get",
      url: `${url}/msig_proposals`,
      params: payload,
      headers: header,
      cancelToken: call.token
    })
    .then(r => {
      // console.log(r.data)
      return r.data;
    })
    .catch(e => {
      console.log("could not load worker proposals from api");
      // return [];
    });
}

export async function fetchTokenTimeLine({}, payload = {}) {
  // {account: 'piecesnbitss', contract:'kasdactokens', symbol:'KASDAC', start_block:10000000, end_block:17000000}
  let url = this._vm.$configFile.get("memberclientstateapi");
  const header = {
    "X-DAC-Name": this._vm.$configFile.get("dacscope")
  };
  return this._vm
    .$axios({
      method: "get",
      url: `${url}/balance_timeline`,
      params: payload,
      headers: header
    })
    .then(r => {
      // console.log(r.data)
      return r.data;
    })
    .catch(e => {
      console.log("could not load token timeline from api");
      return [];
    });
}

export async function fetchDACTokenTransfers({}, payload = {}) {
  let url = this._vm.$configFile.get("memberclientstateapi");
  const header = {
    "X-DAC-Name": this._vm.$configFile.get("dacscope")
  };
  return this._vm
    .$axios({
      method: "get",
      url: `${url}/transfers`,
      params: payload,
      headers: header
    })
    .then(r => {
      // console.log(r.data)
      return r.data;
    })
    .catch(e => {
      console.log("could not load transfers from api");
      return [];
    });
}

export async function fetchMemberCounts({}, payload = {}) {
  let url = this._vm.$configFile.get("memberclientstateapi");
  const header = {
    "X-DAC-Name": this._vm.$configFile.get("dacscope")
  };
  return this._vm
    .$axios({
      method: "get",
      url: `${url}/member_counts`,
      params: payload,
      headers: header
    })
    .then(r => {
      console.log(r.data);
      return r.data;
    })
    .catch(e => {
      console.log("could not load membercounts from api");
      return [];
    });
}

export async function fetchVotesTimeline({}, payload = {}) {
  let url = this._vm.$configFile.get("memberclientstateapi");
  const header = {
    "X-DAC-Name": this._vm.$configFile.get("dacscope")
  };
  return this._vm
    .$axios({
      method: "get",
      url: `${url}/votes_timeline`,
      params: payload,
      headers: header
    })
    .then(r => {
      console.log(r.data);
      return r.data;
    })
    .catch(e => {
      console.log("could not load votes_timeline from api");
      return [];
    });
}

export async function fetchTokenMarketData({}, payload = {}) {
  let url = this._vm.$configFile.get("marketapi");
  console.log("marketdata", url);
  if (url) {
    let market = await this._vm.$axios
      .get(url)
      .then(m => m.data.market_data)
      .catch(e => false);
    console.log(market);
    return market;
  } else {
    return false;
  }
}

export async function fetchTokenHistoryPrice({}, payload = {}) {
  let url =
    "https://api.coingecko.com/api/v3/coins/eosdac/market_chart?vs_currency=usd&days=7";
  console.log(url);
  if (url) {
    let history = await this._vm.$axios
      .get(url)
      .then(m => m.data.prices)
      .catch(e => false);
    console.log(history);
    return history;
  } else {
    return false;
  }
}
