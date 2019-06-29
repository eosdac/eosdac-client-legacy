
const fs = require('fs');

//check if extensions folder is present
if (!fs.existsSync("./src/extensions/")) {
    throw 'extension folder not found. Add an extensions folder to the member client to proceed.'
}

const source_file = require('../src/extensions/statics/config/theme.json');
const target_file = './src/css/themes/custom_theme_colors.styl';

let content = '//This file is generated in the pre build script. \n\n';

if(source_file){
    Object.keys(source_file.colors).forEach(c => {
        content += `${c} = ${source_file.colors[c]}\n`;
    })
}

fs.writeFile(target_file, content, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log(`The color file ${target_file} is generated!`);
}); 