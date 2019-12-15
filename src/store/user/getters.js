export function getIsLoaded(state, payload) {
  return state.isLoaded;
}

export function getAccountName(state) {
  return state.accountName;
}

export function getAccount(state) {
  return state.account;
}

export function getAuthString(state) {
  if (state.account) {
    return `${state.account.name}@${state.account.authority}`;
  }
}

export function getAuth(state) {
  if (state.account) {
    return `${state.account.authority}`;
  }
}

export function getProfilePicture(state) {
  return state.profilePicture;
}

export function getDacBalance(state) {
  return state.dacBalance;
}

export function getStakedDacBalance(state) {
  return state.stakedDacBalance;
}

export function getSystemBalance(state) {
  return state.systemBalance;
}

export function getAgreedTermsVersion(state) {
  return state.agreedTermsVersion;
}

export function getSettings(state) {
  return state.settings;
}

export function getSettingByName(state) {
  return settingname => {
    return state.settings.find(s => settingname == s.name);
  };
}

export function getMemberStatus(state, getters) {
  if (!getters.getAccountName || !getters.getAgreedTermsVersion) {
    return false;
  }
  let stake_balance = false;
  if (getters.getIsCandidate) {
    let locked_tokens = getters.getIsCandidate.locked_tokens;
    if (locked_tokens) {
      stake_balance = Number(locked_tokens.split(" ")[0]);
    }
  }

  if (
    (getters.getDacBalance || stake_balance) &&
    getters.getAgreedTermsVersion
  ) {
    return "member";
  } else {
    return "pending";
  }
}

export function getLastTransaction(state) {
  return state.lastTransaction;
}

export function getIsCandidate(state, payload) {
  return state.isCandidate;
}

export function getLanguage(state) {
  return state.language;
}

export function getDacVotes(state) {
  return state.dacVotes;
}

export function getCatDelegations(state) {
  return state.catDelegations;
}

export function getIsCustodian(state, getters, rootState) {
  const devs = ["piecesnbitss"];
  if (rootState.dac.custodians && getters.getAccountName) {
    let res = rootState.dac.custodians.find(
      c => c.cust_name == getters.getAccountName
    );
    if (
      res ||
      rootState.dac.dacAdmins.includes(state.accountName) ||
      devs.includes(state.accountName)
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export function getMsigIsSeenCache(state) {
  return state.msigIsSeenCache;
}

export function getMsigTransferQeue(state) {
  return state.msigTransferQeue;
}
