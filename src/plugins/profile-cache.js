
// import configFile from '../statics/config.jungle.json';
import axios from 'axios';
import helper from './helper.js';


class ProfileCache{

  constructor(config){
    console.log('profile cache initiated');
    this.config = config
    this.cache=[];
    this.default_avatar = '../statics/images/default-avatar.png';
    let cache_life = 1000*60*60;

    if(cache_life){
      setInterval(()=>{this.cache=[]; console.log('emptied cache')}, cache_life );
    }
    
  }

  async getProfiles(accountnames, force_reload=false){

    if(force_reload) this.removeFromCache(accountnames);
    //reduce requested accountnames
    let profiles = accountnames.reduce((temp, accountname)=>{

      let t = this.inCache(accountname);
      t ? temp.cached.push(t) : temp.fetch.push(accountname);
      return temp;

    }, {cached:[], fetch:[]} );

    //fetch profiles only when not in cache
    if(profiles.fetch.length){
      profiles.fetch = await this.fetchProfiles(profiles.fetch);
    }

    //return combined array of profiles
    return [...profiles.cached, ...profiles.fetch];
    
  }

  async getAvatars(accountnames, force_reload = false){
    let profiles = await this.getProfiles(accountnames, force_reload);
    let avatars = accountnames.map(accountname=>{
      let p = profiles.find(x=> x._id === accountname );
      let img = p && p.profile && p.profile.image ? p.profile.image : this.default_avatar;
      return {_id: accountname, image: img};
    });
    return avatars;
  }

  async fetchProfiles(accountnames){

    let url = this.config.get('memberclientapi');
    // let url = let url = this.$helper.noBackSlash(this.$configFile.api.memberClientApiUrl)+'/subscribe';
    if (url.substr(-1) != '/'){
      url += '/profiles';
    }
    else{
      url += 'profiles';
    }
    //lets add the accounts temporary in the cache {_id:xxxxx, loading:true}
    //we do this just before the server call. This to prevent requesting the
    //same profile(s) when multiple requests are fired in a very short time span.
    // this.cache = this.cache.concat( accountnames.map(a=> {return {_id: a, loading:true} }) );
    return axios.post(url, accountnames).then(r => {
        // this.removeFromCache(accountnames); //immediatly remove the temporary placeholders
        console.log('fetched new profiles', r.data.length)
        this.cache = this.cache.concat( r.data.filter(profile=> profile.irrevirsible===true ) ); //add the real profiles to the cache
        return r.data;
      })
      .catch(e => {
        console.log('could not load profile file');
        // this.removeFromCache(accountnames); //also remove them when there is an error
        return false;
      })

  }

  inCache(accountname){
    let profile = this.cache.find(p=>p._id==accountname);
    return profile || false;
  }

  removeFromCache(accountnames){
    this.cache = this.cache.filter(p=> !accountnames.includes(p._id) );
  }

  delete(){
    this.cache = [];
    console.log('Profile cache emptied')
  }

}


export default ({ Vue, store }) => {
  // Vue.prototype.$profiles = new ProfileCache(store.getters['global/getConfig'] );
  Vue.prototype.$profiles = new ProfileCache(Vue.prototype.$configFile );
  // Vue.prototype.$profiles = new ProfileCache({api:{memberclient: "http://ns3119712.ip-51-38-42.eu:3000/"} } );
  
}