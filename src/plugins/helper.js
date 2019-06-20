class Helper {
  constructor(store) {
    this.store = store;
  }

  isUrl(url) {
    if (typeof url !== "string") {
      return false;
    }
    const re = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    return re.test(url);
  }

  isEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  noBackSlash(url) {
    return url.replace(/\/+$/, "");
  }

  isAccountname(accountname) {
    const re = /^[a-z1-5.]{1,12}$/;
    return re.test(accountname);
  }

  toLocaleNumber(number, decimals = 4) {
    if (!number) return number;
    let test = this.store.getters["user/getSettingByName"]("locale_numbers")
      .value;
    if (test) {
      return parseFloat(number).toLocaleString(undefined, {
        minimumFractionDigits: decimals
      });
    } else {
      return number;
    }
  }

  assetToLocaleNumber(asset) {
    if (!asset) return asset;
    let [quantity, symbol] = asset.split(" ");
    return `${this.toLocaleNumber(parseFloat(quantity))} ${symbol}`;
  }

  assetToNumber(asset) {
    if (asset) {
      return parseFloat(asset.split(" ")[0]);
    }
  }

  numberToAsset(num, symbol) {
    return `${num} ${symbol}`;
  }

  fullHostToJson(fullhost) {
    let [protocol, host, port] = fullhost.split(":");

    let parts = {
      protocol: protocol,
      host: host.replace(/\//g, ""),
      port: port || (protocol === "https" ? "443" : "80")
    };

    return parts;
  }

  randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  randomName() {
    let name = "";
    let possible = "abcdefghijklmnopqrstuvwxyz12345.";
    for (let i = 0; i < 12; i++) {
      name += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return name;
  }

  truncate(str, length) {
    let dots = str.length > length ? "..." : "";
    return str.substring(0, length) + dots;
  }

  chunkArray(arr, chunksize) {
    let R = [];
    for (var i = 0; i < arr.length; i += chunksize) {
      R.push(arr.slice(i, i + chunksize));
    }
    return R;
  }
}

export default ({ Vue, store }) => {
  Vue.prototype.$helper = new Helper(store);
};
