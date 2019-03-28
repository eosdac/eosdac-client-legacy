import { colors } from 'quasar';

export async function loadColorScheme ({state, commit, dispatch}, themename=false ) {
    themename = themename ? themename : state.activeTheme;
    console.log(`loading theme ${themename}`);

    let activetheme = state.themes.find(t=>t.name==themename);

    if(!activetheme){
        console.log('this theme doesn\'t exists');
        return;
    }

    commit('setActiveTheme', themename);

    for (let c in activetheme.colors) {
        if( activetheme.colors.hasOwnProperty(c) ) {
          colors.setBrand(c, activetheme.colors[c] );
        } 
    }        

}
