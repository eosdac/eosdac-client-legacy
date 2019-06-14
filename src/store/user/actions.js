import { Notify, openURL } from "quasar";

export async function loggedOutRoutine({ commit }) {
  commit("setIsLoaded", false);

  commit("setAccount", null);
  commit("setAccountName", null);
  commit("setDacBalance", null);
  commit("setAgreedTermsVersion", null);
  commit("global/setDacApi", null, { root: true });
  commit("global/setScatter", null, { root: true });
  commit("global/setEosScatter", null, { root: true });
  commit("setProfilePicture", null);
  commit("setIsCandidate", null);
  commit("setDacVotes", null);
  commit("dac/setCustodianPermissions", null, { root: true });
}

export async function loggedInRoutine({ state, commit, dispatch }, account) {
  let accountname = account.accounts[0].name;
  commit("setAccount", account.accounts[0]);
  commit("setAccountName", accountname);
  commit("setIsLoaded", false);

  this._vm.$profiles.getAvatars([accountname]).then(a => {
    commit("setProfilePicture", a[0].image);
  });

  const api = await dispatch("global/getDacApi", false, { root: true });

  //requests for setting up the logged in user
  let requests = [
    api.getBalance(accountname),
    api.getAgreedTermsVersion(accountname),
    api.isCandidate(accountname)
  ];
  console.log(JSON.stringify(await api.getAccount(accountname)));
  let [balance, termsversion, isCandidate] = await Promise.all(requests);
  console.log("is canddate:", isCandidate);
  commit("setDacBalance", balance);
  commit("setAgreedTermsVersion", termsversion);
  // commit('setAccount', account);
  commit("setIsCandidate", isCandidate);

  commit("setIsLoaded", true);

  api
    .getBalance(
      accountname,
      this._vm.$configFile.get("systemtokencontract"),
      this._vm.$configFile.get("systemtokensymbol")
    )
    .then(x => {
      commit("setSystemBalance", x);
    })
    .catch(e => console.log(e));

  setTimeout(() => {
    dispatch("fetchDacVotes");
  }, 2000);
}

export async function fetchIsCandidate(
  { state, commit, dispatch },
  accountname = false
) {
  const accountN = accountname || state.accountName;
  const api = await dispatch("global/getDacApi", false, { root: true });
  let isCandidate = await api.isCandidate(accountN);
  if (!accountname) {
    commit("setIsCandidate", isCandidate);
  } else {
    return isCandidate;
  }
}

export async function fetchDacVotes(
  { state, commit, dispatch },
  accountname = false
) {
  const accountN = accountname || state.accountName;
  const api = await dispatch("global/getDacApi", false, { root: true });
  let votes = await api.getVotes(accountN);
  if (!accountname) {
    commit("setDacVotes", votes);
    return votes;
  } else {
    return votes;
  }
}

export async function fetchBalances(
  { state, commit, dispatch },
  accountname = false
) {
  const accountN = accountname || state.accountName;
  const api = await dispatch("global/getDacApi", false, { root: true });
  let requests = [
    api.getBalance(accountN),
    api.getBalance(accountN, "eosio.token", "EOS")
  ];
  let [dacbalance, systembalance] = await Promise.all(requests);
  if (!accountname) {
    commit("setDacBalance", dacbalance);
    commit("setSystemBalance", systembalance);
  } else {
    return [dacbalance, systembalance];
  }
}

export async function fetchPendingPay(
  { state, dispatch },
  accountname = false
) {
  const accountN = accountname || state.accountName;
  const api = await dispatch("global/getDacApi", false, { root: true });
  let res = await api.getPendingPay(accountN);
  return res;
}

export async function fetchCatDelegations(
  { state, dispatch, commit },
  accountname = false
) {
  const accountN = accountname || state.accountName;
  const api = await dispatch("global/getDacApi", false, { root: true });
  let res = await api.getCatDelegations(accountN);
  commit("setCatDelegations", res);
  return res;
}

export async function transact(
  { state, rootState, commit, dispatch, getters },
  payload
) {
  let DELAY_SEC =
    getters["getSettingByName"]("trx_delay").value > 0
      ? getters["getSettingByName"]("trx_delay").value
      : 0;
  let BROADCAST = true;

  if (payload.options) {
    if (payload.options.delay !== undefined) {
      DELAY_SEC = payload.options.delay;
    }
    if (payload.options.broadcast !== undefined) {
      BROADCAST = payload.options.broadcast;
    }
  }

  let actions = payload.actions;

  //if not logged in
  if (!state.accountName) {
    console.log("please login first");

    if (getters["getSettingByName"]("notify_info_msg").value) {
      Notify.create({
        message: this._vm.i18n.t("transaction.please_login"),
        timeout: 5000, // in milliseconds; 0 means no timeout
        type: "info",
        detail: this._vm.i18n.t("transaction.you_must_login"),
        position: "bottom-right", // 'top', 'left', 'bottom-left' etc.
        actions: [
          {
            label: this._vm.i18n.t("default.login"),
            icon: "lock", // optional
            handler: () => {
              dispatch("global/login", null, { root: true });
            }
          }
        ]
      });
    }

    return;
  }

  console.log("loading scatter");
  commit("ui/setShowTransactionOverlay", "loading", { root: true });

  let account = (await rootState.global.scatter.login()).accounts[0]; //same as getIdentity

  if (account.name !== state.accountName) {
    console.log("Yooo stop messing with scatter!");
    commit("setAccount", account);
    commit("setAccountName", account.name);
  }

  actions = actions.map(action => {
    if (!action.authorization) {
      action.authorization = [
        { actor: account.name, permission: account.authority }
      ];
    }
    return action;
  });
  console.log(JSON.stringify(actions));

  try {
    let [eos] = await dispatch("global/getEosScatter", null, { root: true });
    setTimeout(() => {
      commit("ui/setShowTransactionOverlay", "sign", { root: true });
    }, 1500);
    const result = await eos.transact(
      { delay_sec: DELAY_SEC, actions: actions },
      { blocksBehind: 3, expireSeconds: 60, broadcast: BROADCAST }
    );
    commit("ui/setShowTransactionOverlay", "success", { root: true });
    commit("setLastTransaction", result);

    if (getters["getSettingByName"]("notify_success_msg").value) {
      Notify.create({
        message: this._vm.i18n.t("transaction.transaction_successful"),
        timeout: 7000, // in milliseconds; 0 means no timeout
        type: "positive",
        detail: actions.map(a => `${a.account} > ${a.name}`).join(", "),
        position: "bottom-right", // 'top', 'left', 'bottom-left' etc.
        // closeBtn: true, // or string as button message e.g. 'dismiss'
        actions: [
          {
            label: this._vm.i18n.t("transaction.explorer"),
            icon: "link", // optional
            handler: () => {
              openURL(
                `${this._vm.$configFile.get("explorer")}/transaction/${
                  result.transaction_id
                }`
              );
            }
          }
        ]
      });
    }
    // add a delay befor returning the transaction result. this to give nodes time to sync.
    return await new Promise(resolve => setTimeout(() => resolve(result), 250));
  } catch (e) {
    console.log(e);
    let message = "unknown_error";
    if (e.type == "signature_rejected") {
      message = "transaction.signature_rejected";
      commit("ui/setShowTransactionOverlay", "cancelled", { root: true });
    } else {
      message = parseError(e.json);
      commit("ui/setShowTransactionOverlay", "error", { root: true });
    }

    if (getters["getSettingByName"]("notify_error_msg").value) {
      Notify.create({
        message: this._vm.i18n.t("transaction.error"),
        timeout: 7000, // in milliseconds; 0 means no timeout
        type: "negative",
        detail: this._vm.i18n.t(message),
        position: "bottom-right", // 'top', 'left', 'bottom-left' etc.
        closeBtn: true // or string as button message e.g. 'dismiss'
      });
    }
    return false;
  }
}

export async function proposeMsig(
  { state, rootState, commit, dispatch, getters, rootGetters },
  payload
) {
  //payload example
  // {
  //   actions: [], //required
  //   requested: [],
  //   proposal_name: "aname",
  //   expiration: "2019-08-10T19:14:14",
  //   delay_sec: 0,
  //   title: "a title",
  //   description: "a description"
  //   is_personal_msig: false
  // }

  const api = await dispatch("global/getDacApi", false, { root: true });
  //proposalname
  let proposal_name = payload.proposal_name || this._vm.$helper.randomName();
  //expiration
  let exp = new Date();
  exp.setDate(exp.getDate() + 30);
  let [expiration] = exp.toISOString().split(".");

  //requested
  let requested = rootGetters["dac/getCustodianPermissions"];
  if (!requested) {
    requested = await dispatch("dac/fetchCustodianPermissions", null, {
      root: true
    });
  }
  //msig trx template
  let msigTrx_template = {
    expiration: payload.expiration || expiration,
    ref_block_num: 0,
    ref_block_prefix: 0,
    max_net_usage_words: 0,
    max_cpu_usage_ms: 0,
    delay_sec: payload.delay_sec || 0,
    actions: [],
    context_free_actions: [],
    transaction_extensions: [],
    signatures: [],
    context_free_data: []
  };

  //serialize action data and add to template
  for (let i = 0; i < payload.actions.length; i++) {
    let action = payload.actions[i];
    let hexdata = await api.serializeActionData(action);
    action.data = hexdata;
    msigTrx_template.actions.push(action);
  }

  //do the transaction
  let propose = {
    account: this._vm.$configFile.get("systemmsigcontract"),
    name: "propose",
    data: {
      proposer: state.accountName,
      proposal_name: proposal_name,
      requested: payload.requested || requested,
      trx: msigTrx_template
    }
  };
  //handle the correct permission for the "proposed" action
  let PERM = rootGetters["dac/getAuthAccountPermLevel"];

  let proposed = {
    account: this._vm.$configFile.get("dacmsigcontract"),
    name: "proposede",
    authorization: [
      { actor: state.accountName, permission: getters["getAuth"] },
      { actor: this._vm.$configFile.get("authaccountname"), permission: PERM }
    ],
    data: {
      proposer: state.accountName,
      proposal_name: proposal_name,
      dac_id: this._vm.$configFile.get("dacscope"),
      metadata: JSON.stringify({
        title: payload.title || "Default Msig title",
        description: payload.description || "default msig description"
      }),
      dac_id: this._vm.$configFile.get("dacscope")
    }
  };

  let msig_actions = [propose];
  if (!payload.is_personal_msig) {
    msig_actions.push(proposed);
  }
  let res = await dispatch("transact", { actions: msig_actions });
  if (res) {
    res.proposal_name = proposal_name;
  }
  return res;
}

function parseError(err) {
  // example error: assertion failure with message: ERR::UNSTAKE_CANNOT_UNSTAKE_FROM_ACTIVE_CAND::Cannot unstake tokens for an active candidate. Call withdrawcand first.
  if (
    err &&
    err.error.details[0].message &&
    err.error.details[0].message.indexOf("ERR::") > -1
  ) {
    err = err.error.details[0].message.substr(
      err.error.details[0].message.indexOf("ERR::")
    );
    let t = "contract_errors." + err.split("::")[1];
    err = t;
  } else {
    if (err && err.error) {
      err = err.error.details[0].message;
    }
  }
  return err;
}
