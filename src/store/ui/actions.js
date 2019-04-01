import { colors } from 'quasar';


export async function loadTheme ({state, commit, dispatch}, themename=false ) {
    themename = themename ? themename : state.activeTheme;
    console.log(`loading theme ${themename}`);

    if(themename == 'default'){
        commit('setActiveTheme', themename);
        document.body.removeAttribute("style");
        return;
    }

    let activetheme = state.themes.find(t=>t.name==themename);
    // let activetheme;
    // try {
    //     activetheme = require(`../../statics/themes/${themename}.json`)
    // } 
    // catch (e) {
    //     console.log(`loading theme ${themename} failed`,e );
    //     activetheme = false;
    // }

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
