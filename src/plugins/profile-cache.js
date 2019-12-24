import axios from "axios";

class ProfileCache {
  constructor(config) {
    console.log("profile cache initiated");
    this.config = config;
    this.cache = new Map();
    this.default_avatar = "./branding/images/default-avatar.png";
    this.request_queue = new Set();
    this.inflight = new Set();
    let cache_life = 1000 * 60 * 60;

    if (cache_life) {
      setInterval(() => {
        this.cache.clear();
        console.log("emptied cache");
      }, cache_life);
    }

    setInterval(this.processQueue.bind(this), 300);
  }

  async getProfiles(accountnames, force_reload = false) {
    if (force_reload) this.removeFromCache(accountnames);
    //reduce requested accountnames
    let profiles = accountnames.map(accountname => {
      return this.getPromise(accountname);
    });

    return Promise.all(profiles);
  }

  async getAvatars(accountnames, force_reload = false) {
    let profiles = await this.getProfiles(accountnames, force_reload);
    let avatars = accountnames.map(accountname => {
      let p = profiles.find(x => x.account === accountname);
      let img =
        p && p.profile && p.profile.image
          ? p.profile.image
          : this.default_avatar;
      return { account: accountname, image: img };
    });
    return avatars;
  }

  async processQueue() {
    if (this.request_queue.size) {
      const names = Array.from(this.request_queue.values());
      console.log(`Process queue`, names);
      this.request_queue.clear();
      this.inflight = new Set(names);
      this.fetchProfiles(names);
    }
  }

  async responseWrapper(resp, accountname) {
    /*
      After response is received, filter for only `accountname` and set the cache.  All other promises will resolve
      once the cache is populated
       */
    const resp_data = await resp;
    const profile_data = resp_data.data.results.filter(
      a => a.account === accountname
    )[0];
    this.cache.set(accountname, profile_data);
    this.inflight.delete(accountname);
    return profile_data;
  }

  async fetchProfiles(accountnames) {
    let url = this.config.get("memberclientstateapi");
    // let dacname = "eosdac"; //this.config.get("dacname");
    let params = { account: accountnames.join(",") };
    const header = { "X-DAC-Name": this.config.get("dacscope") };
    const resp = axios({
      method: "get",
      url: `${url}/profile`,
      params: params,
      headers: header
    });

    const retvals = accountnames.map(accountname => {
      return this.responseWrapper(resp, accountname);
    });

    return retvals;
  }

  async getPromise(accountname) {
    /*
      Returns a promise which will return the contents of the cache, if not in the cache then will add to the
      request queue and resolve once that has been executed and in the cache
       */
    return new Promise((resolve, reject) => {
      if (this.cache.has(accountname)) {
        resolve(this.cache.get(accountname));
      } else {
        const interval_handler = () => {
          if (this.cache.has(accountname)) {
            resolve(this.cache.get(accountname));
          } else if (!this.inflight.has(accountname)) {
            this.request_queue.add(accountname);
          }
        };

        interval_handler();
        const ival = setInterval(interval_handler, 100);
        setTimeout(() => {
          if (!this.cache.has(accountname)) {
            console.error(`Timeout fetching profile for ${accountname}`);
          }
          clearInterval(ival);
        }, 10000);
      }
    });
  }

  removeFromCache(accountnames) {
    accountnames.forEach(account => this.cache.delete(account));
  }

  delete() {
    this.cache.clear();
    console.log("Profile cache emptied");
  }
}

export default ({ Vue, store }) => {
  Vue.prototype.$profiles = new ProfileCache(Vue.prototype.$configFile);
};
