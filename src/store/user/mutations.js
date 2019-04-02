export function setIsLoaded(state, payload) {
  state.isLoaded = payload;
}

export function setAccountName(state, payload) {
  state.accountName = payload;
}

export function setProfilePicture(state, payload) {
  state.profilePicture = payload;
}

export function setSettingItem(state, payload) {
  // return state.settings;
  state.settings.find(s => payload.name == s.name).value = payload.value;
}

export function setDacBalance(state, payload) {
  state.dacBalance = payload;
}

export function setSystemBalance(state, payload) {
  state.systemBalance = payload;
}

export function setAccount(state, payload) {
  state.account = payload;
}

export function setAgreedTermsVersion(state, payload) {
  state.agreedTermsVersion = payload;
}

export function setLastTransaction(state, payload) {
  state.lastTransaction = payload;
}

export function setIsCandidate(state, payload) {
  state.isCandidate = payload;
}

export function setLanguage(state, payload) {
  state.language = payload;
}

export function setDacVotes(state, payload) {
  state.dacVotes = payload;
}

export const setMsigIsSeenCache = (state, payload) => {
  let mode = payload.mode;
  let msig_id = payload.msig_id;

  switch (mode) {
    case "add":
      if (state.msigIsSeenCache.indexOf(msig_id) === -1)
        state.msigIsSeenCache.push(msig_id);
      break;
    case "remove":
      state.msigIsSeenCache = state.msigIsSeenCache.filter(m => m !== msig_id);
      break;
    case "clear":
      state.msigIsSeenCache = [];
      break;
    default:
    // code block
  }
};
