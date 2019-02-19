
class helper{

  constructor(store){
    this.store = store
  }

  isUrl(url) {
    if(!typeof url === 'string'){
      return false;
    }
    const re = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    return re.test(url);
  }

  isEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  noBackSlash(url){
    return url.replace(/\/+$/, "");
  }
  
  isAccountname(accountname){
    const re = /^[a-z1-5.]{1,12}$/;
    return re.test(accountname);
  }
  assetToNumber(asset){
    return parseFloat(asset.split(' ')[0]);
  }
  toLocaleNumber(number){
    if(!number) return number;
    let test = this.store.getters['user/getSettingByName']('locale_numbers').value;
    if(test){
      return parseFloat(number).toLocaleString(undefined, { minimumFractionDigits: 4 });
    }
    else{
      return number;
    }
  }

  assetToLocaleNumber(asset){
    
    if(!asset) return asset;
    let [quantity, symbol] = asset.split(' ');
    return `${this.toLocaleNumber(parseFloat(quantity) )} ${symbol}`
  }

}

export default ({ Vue, store }) => {
  Vue.prototype.$helper = new helper(store);
}


// const helper = {

//   isUrl(url) {
//     if(!typeof url === 'string'){
//       return false;
//     }
//     const re = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
//     return re.test(url);
//   },

//   isEmail(email) {
//     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(String(email).toLowerCase());
//   },

//   noBackSlash(url){
//     return url.replace(/\/+$/, "");
//   },
  
//   isAccountname(accountname){
//     const re = /^[a-z1-5.]{1,12}$/;
//     return re.test(accountname);
//   }

// }

// export default ({ Vue }) => {
//   Vue.prototype.$helper = helper;
// }