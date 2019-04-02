export function getIsDark(state) {
  let activetheme = state.themes.find(t => t.name == state.activeTheme);
  if (activetheme) {
    return activetheme.isdark;
  } else {
    return true;
  }
}

export function getActiveTheme(state) {
  return state.themes.find(t => t.name == state.activeTheme);
}

export function getThemes(state) {
  return state.themes;
}

export function getShowTransactionOverlay(state) {
  return state.showTransactionOverlay;
}

export function getDrawerIsOpen(state) {
  return state.drawerIsOpen;
}
