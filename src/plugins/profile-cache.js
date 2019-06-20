import axios from "axios";

class ProfileCache {
  constructor(config) {
    console.log("profile cache initiated");
    this.config = config;
    this.cache = [];
    this.default_avatar = "./branding/images/default-avatar.png";
    let cache_life = 1000 * 60 * 60;

    if (cache_life) {
      setInterval(() => {
        this.cache = [];
        console.log("emptied cache");
      }, cache_life);
    }
  }

  async getProfiles(accountnames, force_reload = false) {
    if (force_reload) this.removeFromCache(accountnames);
    //reduce requested accountnames
    let profiles = accountnames.reduce(
      (temp, accountname) => {
        let t = this.inCache(accountname);
        t ? temp.cached.push(t) : temp.fetch.push(accountname);
        return temp;
      },
      { cached: [], fetch: [] }
    );

    //fetch profiles only when not in cache
    if (profiles.fetch.length) {
      profiles.fetch = await this.fetchProfiles(profiles.fetch);
      //remove http images
      profiles.fetch.forEach(p => {
        if (p.profile.image.startsWith("http:")) {
          p.profile.image = "";
        }
      });
    }

    //return combined array of profiles
    return [...profiles.cached, ...profiles.fetch];
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

  async fetchProfiles(accountnames) {
    let url = this.config.get("memberclientstateapi");
    // let dacname = "eosdac"; //this.config.get("dacname");
    let params = { account: accountnames.join(",") };
    const header = { "X-DAC-Name": this.config.get("dacscope") };
    return axios({
      method: "get",
      url: `${url}/profile`,
      params: params,
      headers: header
    })
      .then(r => {
        console.log("fetched new profiles", r.data.results.length);
        let p = r.data.results;
        this.cache = this.cache.concat(p);
        return p;
      })
      .catch(e => {
        console.log("error during api request.", e);
        return false;
      });
  }

  inCache(accountname) {
    let profile = this.cache.find(p => p.account == accountname);
    if (profile) {
      return profile;
    } else {
      return false;
    }
  }

  removeFromCache(accountnames) {
    this.cache = this.cache.filter(p => !accountnames.includes(p.account));
  }

  delete() {
    this.cache = [];
    console.log("Profile cache emptied");
  }
}

export default ({ Vue, store }) => {
  Vue.prototype.$profiles = new ProfileCache(Vue.prototype.$configFile);
};
