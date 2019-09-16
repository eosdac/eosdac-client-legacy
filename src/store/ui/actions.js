import { colors } from "quasar";

// {
//     "is_dark": false,
//     "colors": {
//       "$primary": "#6677d9",
//       "$bg1": "#d7dcf7",
//       "$bg2": "#f0f1fa",
//       "$text1": "#292829",
//       "$text2": "#332f33",
//       "$info": "#949ed4",
//       "$positive": "#78c48a",
//       "$negative": "#d67878",
//       "$dark": "#afb6e0"
//     }
//   }

export async function loadTheme({ commit }, theme) {
  let colorvars = Object.keys(theme.colors);

  commit("setIsDark", theme.isDark);
  for (let i = 0; i < colorvars.length; i++) {
    let cv = colorvars[i].replace("$", "");
    colors.setBrand(cv, theme.colors[colorvars[i]]);
  }
}
