import Vue from "vue";

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

export function setCatDelegations(state, payload) {
  state.catDelegations = payload;
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

export function setMsigTransferQeue(state, payload) {
  let mode = payload.mode;
  let qeue_entry = payload.qeue_entry; //can be index or entry object

  switch (mode) {
    case "add":
      let f = state.msigTransferQeue.findIndex(qi => qi.status == 3);
      if (f != -1) {
        console.log("edit item index", f);
        qeue_entry.status = 0;
        Vue.set(state.msigTransferQeue, f, qeue_entry);
      } else {
        state.msigTransferQeue.push(qeue_entry);
      }
      break;
    case "remove":
      state.msigTransferQeue.splice(qeue_entry, 1);
      break;
    case "clear":
      state.msigTransferQeue.splice(0, state.msigTransferQeue.length);
      break;
    default:
    // code block
  }
}
