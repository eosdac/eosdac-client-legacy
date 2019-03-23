<template>
<q-page class="relative-position" style="overflow-x: hidden; ">
  <div class=" gradient-bg-primary q-px-md q-pt-md relative-position" style="min-height:260px">
    <div class="row">
      <div class="col-12">
        <h4 class="q-display-1 q-mb-sm q-mt-none">{{ $t("profile.profile") }}</h4>
      </div>
    </div>
    <div class="row  q-mt-md profile_header_top_row">
      <div class="col-xs-12">
        <div class="text-text2 q-caption uppercase">{{ $t('profile.account_name') }}</div>
        <div class="q-display-1 text-weight-thin uppercase">{{ account_name }}</div>
      </div>
    </div>

    <div class="animate-pop profile_image_outer_wrap" style="">
      <q-btn v-if="is_edit" round size="md" class="animate-pop" color="primary" icon="icon-plus" style="position:absolute;bottom:0;right:7px;z-index:2" @click="visible=true" />
      <div class="fit profile_image_inner_wrap">
        <transition name="fade">
          <img  :class="{ 'hack_center': centerimage, 'full-width': setwidth, 'full-height': !setwidth }" v-bind:src="setImgSrc" v-on:load="onLoaded" v-show="loaded" ref="profile_pic">
        </transition>
        <q-spinner-oval color="white" class="hack_center" v-if="!loaded" size="139px" />
      </div>
    </div>

    <div class="blur-details q-pa-md absolute-bottom" style="height:120px;margin-right:-16px;margin-left:-16px;">
      <div class="row profile_header_bottom_row">
        <div class="col-md-2 col-xs-6 q-pr-sm" >
          <div class="text-text2 q-caption uppercase">{{ $t('profile.givenName') }}</div>
          <q-input color="white" :dark="getIsDark" :readonly="!is_edit" :hide-underline="!is_edit" v-model="form.givenName"/>
        </div>
        <div class="col-md-2 col-xs-6 q-pr-sm">
          <div class="text-text2 q-caption uppercase">{{ $t('profile.familyName') }}</div>
          <q-input color="white" :dark="getIsDark" :readonly="!is_edit" :hide-underline="!is_edit"  v-model="form.familyName"/>
        </div>
        <div class="col-md-2 col-xs-6 q-pr-sm">
          <div class="text-text2 q-caption uppercase">{{ $t('profile.gender') }}</div>
           <q-select
              class=""
              color="white"
              :readonly="!is_edit"
              :hide-underline="!is_edit"
              v-model="form.gender"
              :dark="getIsDark"
             :options="[{label:$t('profile.female'), value:'female'}, {label:$t('profile.male'), value:'male'}, {label:$t('profile.other'), value:'other'}]"
            />
        </div>
        <div class="col-md-2 col-xs-6">
          <div class="text-text2 q-caption uppercase">Type</div>
          <div>Member</div>
        </div>
      </div>

    </div>
  </div> <!-- end header gradient -->

  <div class="q-px-md" >
    <div class="row q-mt-md gutters-md bg-bg1 round-corners shadow-5" style="min-height:265px">
      <div class="col-md-8 col-xs-12 q-pa-md">
        <div class="" style="height:100%">
          <div class="q-title q-mb-md">{{ $t('profile.bio') }}</div>
          <MarkdownViewer :tags="['h1', 'h2', 'h3', 'italic', 'bold', 'underline', 'strikethrough', 'subscript',
            'superscript', 'anchor', 'orderedlist', 'unorderedlist']" class="bg-bg1" :edit="is_edit" :dark="getIsDark" :text="form.description" v-on:update="updateText" />

        </div>
      </div>

      <div class="col-md-4 col-xs-12 q-pa-md">
        <div class="column justify-between" style="height:100%">

          <!-- on display -->
          <div v-if="!is_edit">
            <div class="q-title q-mb-md">{{ $t('profile.website') }}</div>
            <div v-if="$helper.isUrl(form.url)" class="q-body-1 a2"><a target="_blank" :href="form.url">{{form.url}}</a></div>
            <div class="q-mt-md">
              <SocialLinks :links="form.sameAs.map(x => x.link)" />
            </div>
          </div>

          <!-- on is_edit -->
          <div v-if="is_edit">
            <div class="q-title q-mb-md">{{ $t('profile.website') }}</div>
            <q-input color="p-light" :dark="getIsDark" type="url" v-model="form.url"  placeholder="http://example.com" />
            <q-input color="p-light" :dark="getIsDark" type="url"
              class="q-mt-md q-mb-md"
              v-model="social.link"
              v-for="(social, i) in form.sameAs"
              :key = i
              :float-label="`${$t('profile.social_link')} ${i+1}`"

              :placeholder="$t('profile.social_profile_link')"
            />
            <q-btn  round  color="primary" @click="addSocial" icon="icon-plus" @blur.native="maxLinksmsg=''" />
            <span v-if="maxLinksmsg !=''" class="animate-fade on-right">{{maxLinksmsg}}</span>
          </div>

          <div v-if="allow_edit" class="row gutter-sm justify-end q-mt-md">
            <div >
              <q-btn v-if="!is_edit" size="md" class="animate-pop" color="primary" @click="is_edit =! is_edit" :label="$t('profile.edit')" />
              <q-btn v-else size="md" class="animate-pop" color="positive" @click="saveProfile" :label="$t('profile.save')" />
            </div>
            <div>
              <q-btn v-if="is_edit" size="md" class="animate-pop" color="red" @click="is_edit =! is_edit" :label="$t('profile.cancel')" />
              <!-- <q-btn size="md" class="animate-pop" color="dark" @click="download(JSON.stringify(form),`${getAccountName}_eosdac_profile.json`, 'application/json')" :label="$t('profile.download')" /> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="rawprofiledata" class="q-pa-md q-my-md text-text2">
    <TimeZone :offset="Number(form.timezone)" />
  </div>

  <q-modal v-model="visible"  minimized @hide="handleModalClose"  :content-css="{width: '80vw'}">
    <div style="height:50px" class="bg-bg1 row items-center justify-between q-px-md text-text1">
      <span>{{$t('profile.profile_picture_url')}} (https)</span>
      <q-btn icon="close" @click="visible=false" flat dense/>
    </div>
    <div class="q-pa-md bg-bg2 text-text1">
      <q-input :dark="getIsDark" type="url" v-model="form.image" @input="loaded=false" class="q-mt-md" :float-label="$t('profile.profile_picture_url')" placeholder="https://example.site/mypic.jpg" />
    </div>
  </q-modal>

  <div class="q-pa-md">
    <debug-data :data="[{
      'form': form,

    }]" />
  </div>

</q-page>
</template>



<script>

import { Notify } from 'quasar';
import SocialLinks from 'components/ui/social-links'
import TimeZone from 'components/ui/time-zone'
import ProfileTemplate from '../statics/profile.template.json'
import MarkdownViewer from 'components/ui/markdown-viewer'
import debugData from 'components/ui/debug-data'
import {openURL} from 'quasar'
import {mapGetters} from 'vuex'

export default {
  components:{
    debugData,
    SocialLinks,
    TimeZone,
    MarkdownViewer

  },
  data () {
    return {
      account_name:'',
      is_edit:false,
      allow_edit: false,
      profile_is_loading : false,
      rawprofiledata: false,
      profileUrl: '',

      visible:false,
      centerimage:true,
      setwidth: true,
      loaded:false,
      form:ProfileTemplate,
      maxLinksmsg: ''
    }
  },

  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getIsDark: 'ui/getIsDark'

    }),
    setImgSrc(){
      let image = '../statics/images/default-avatar.png'; //default image
      if(this.form.image.startsWith('http:') ){
        console.log('need https image');
        Notify.create({
          message: this.$t('profile.http_error'),
          timeout: 5000,
          type: 'negative',
          position: 'bottom-right', // 'top', 'left', 'bottom-left' etc.
          closeBtn: true, // or string as button message e.g. 'dismiss'
        });
        return false;
      }
      if(this.$helper.isUrl(this.form.image)){
        image = this.form.image;
      }
      return image;
    }
  },

  methods:{
    openURL,
    updateText (val) {
      this.form.description = val
    },
     onLoaded() {
        let img = this.$refs.profile_pic;
        if(img == undefined){
          return false;
        }
        // this.$consoleMsg('Profile image size: '+img.width +' x '+ img.height);
        this.setwidth = img.width <= img.height ? true : false;
        this.centerimage = img.width == img.height ? false : true;
        this.visible = false;
        this.loaded = true;
    },
    //init profile page
    initProfile(){
      this.profile_is_loading = true;
      this.account_name = this.$route.params.accountname;
      //load profile
      this.getProfileData();
      // this.profile_is_loading = false;
    },

    async getProfileData(){
      let p = await this.$profiles.getProfiles([this.account_name]);
      if(p && p.length && this.validateProfile(p[0].profile)){
        this.rawprofiledata = p[0];
        //todo validate profile
        this.form = p[0].profile;
        this.allow_edit = this.account_name === this.getAccountName;

      }
      else{
        this.allow_edit = this.account_name === this.getAccountName ? true : false;
      }
      this.profile_is_loading = false;
    },

    validateProfile(profile) {

      let validkeys = Object.keys(ProfileTemplate);

      let valid = validkeys.every(function (key) {
          return profile.hasOwnProperty(key);
      });
      //loop over keys to see if types match
      if(valid){
        console.log('Fetched profile is valid');
      }
      else{
        console.log('Fetched profile is not valid');
      }
      return valid;
    },

    async saveProfile(){
      this.deleteEmptyLinks();
      this.form.timezone = new Date().getTimezoneOffset();

      let actions = [{
          account: this.$configFile.get('custodiancontract'),
          name: 'stprofileuns',
          data: {
            cand: this.getAccountName,
            profile: JSON.stringify(this.form)
          }
      }];

      let result = await this.$store.dispatch('user/transact', {actions: actions});
      if(result){
        this.saveProfileSuccessCallback();
      }
    },

    async saveProfileSuccessCallback(){
      this.allow_edit = this.is_edit = false;
      let newprofile = await this.$profiles.removeFromCache([this.getAccountName]);
      
      this.$store.commit('user/setProfilePicture', this.form.image)
    },

    addSocial(){
      let max = 4;
      this.deleteEmptyLinks();
      if(this.form.sameAs.length < max ){
        this.form.sameAs.push({link:''});
      }
      else{
          this.maxLinksmsg = this.$t('profile.maxLinksmsg', {number_allowed_links : max});
      }

    },

    deleteEmptyLinks(){
      var self =this;

      this.form.sameAs = this.form.sameAs.filter(function(item){
        return item.link !='' && self.$helper.isUrl(item.link);
      });
    },

    handleModalClose(){
      setTimeout(()=>{
        if(!this.loaded  ){
          this.form.image = '';
        }
      },300)
    },

    download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }
  },

  mounted: function(){
      this.initProfile();
  },
  watch: {
    '$route': function(){
                this.initProfile();
              },
    getAccountName : function(val){
      this.allow_edit = this.account_name === val;
    }

  }

}
</script>

<style lang="stylus">
@import '~variables'

.profile_header_bottom_row{
  margin-left:170px;
  margin-right:16px;
  background:none
}

.profile_header_top_row{
  margin-left:154px;
  background:none
}

.profile_image_inner_wrap{
  border-radius:50%;
  border:4px solid white;
  background: #7c41ba;
  overflow:hidden;
  position:relative;

}
.profile_image_outer_wrap{
  position:absolute;
  z-index:1;
  height:140px;
  width:140px;
  top:70px;
  transition: all .2s ease-in-out;
}
.profile_header_bottom_row .q-if-control{
    display:none !important;
}
.hack_center{
    position: absolute;
    top: -9999px;
    bottom: -9999px;
    left: -9999px;
    right: -9999px;
    margin: auto;
}
</style>
