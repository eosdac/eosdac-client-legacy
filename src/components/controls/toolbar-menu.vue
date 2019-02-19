<template>

<div class="row items-center ">

<div v-if="getSettingByName('toolbar_menu_items').value && getAccountName" class="row  justify-start gt-md q-mr-xl">
      <q-item class="animate-pop">
        <q-item-side icon="icon-dac-balance" color="text1" />
        <q-item-main style="margin-left:-5px">
          <q-item-tile class="text-text2 q-caption" label>{{$t('default.your_token_balance', { tokenName: $configFile.get('dactokensymbol') }) }}</q-item-tile>
          <q-item-tile class="text-text1 q-caption" sublabel><xspan :value="$helper.toLocaleNumber(getDacBalance)" /></q-item-tile>
        </q-item-main>
      </q-item>

      <q-item class="animate-pop">
        <q-item-side icon="icon-type-2" color="text1" />
        <q-item-main style="margin-left:-5px">
          <q-item-tile class="text-text2 q-caption" label>{{$t('default.your_token_balance', { tokenName: $configFile.get('systemtokensymbol') }) }}</q-item-tile>
          <q-item-tile class="text-text1 q-caption" sublabel><xspan :value="$helper.toLocaleNumber(getSystemBalance)" /></q-item-tile>
        </q-item-main>
      </q-item>
</div>

<div class="row justify-end" style=" margin-right:-14px;cursor:pointer" ref="profileContainer">
  <div v-if="getSettingByName('toolbar_profile_image').value && getAccountName && getProfilePicture" style="width:35px;height:35px" class="profile_image animate-pop on-left q-mr-xs" v-bind:style="{ 'background-image': `url(${getProfilePicture})` }"></div>
</div>
<q-btn-dropdown id="login_button" v-if="getAccountName" no-ripple text-color="text1"  class="no-shadow animate-fade" :label="getAccountName" content-style="margin-top:4px" >
        <q-list  link class="bg-bg2 text-text1"  >
          <q-list-header class="text-text2" style="min-width:300px">{{getActiveNetworkName}}</q-list-header>
           <q-item>
            <q-item-side icon="folder" color="text2" />
            <q-item-main>
              <q-item-tile class="text-text1" label>Member Status</q-item-tile>
              <q-item-tile class="text-text2" sublabel>{{getMemberStatus}}</q-item-tile>
            </q-item-main>
            <!-- <q-item-side right icon="info" color="amber" /> -->
          </q-item>

          <!-- <q-item>
            <q-item-side icon="icon-dac-balance"  color="text2" />
            <q-item-main>
              <q-item-tile class="text-text1" label>{{$t('default.your_token_balance', { tokenName: $configFile.get('dactokensymbol') }) }}</q-item-tile>
              <q-item-tile class="text-text2" sublabel><xspan :value="getDacBalance" /></q-item-tile>
            </q-item-main>
 
          </q-item> -->

          <q-item-separator inset />

          <q-item v-close-overlay @click.native="$store.dispatch('global/switchAccount')">
            <q-item-side icon="cached" color="warning" />
            <q-item-main>
              <q-item-tile label>Switch account</q-item-tile>
            </q-item-main>
          </q-item>

          <q-item v-close-overlay @click.native="$store.dispatch('global/logout')">
            <q-item-side icon="person" color="negative" />
            <q-item-main>
              <q-item-tile label>Logout</q-item-tile>
            </q-item-main>
          </q-item>

          <q-item-separator inset />

          <q-item v-close-overlay to="/settings">
            <q-item-side icon="settings" color="text2" />
            <q-item-main>
              <q-item-tile label>{{$t('default.settings')}}</q-item-tile>
              
            </q-item-main>
          </q-item>

        </q-list>
</q-btn-dropdown>


<q-btn  size="lg" class="no-shadow animate-fade" text-color="text1" icon="lock" v-if="!getAccountName" label="login" @click="$store.dispatch('global/login')" />
</div>


</template>

<script>
import xspan from 'components/ui/xspan';
import {mapGetters} from 'vuex';
export default {
  name: 'ToolbarMenu',
  components: {
      xspan
  },
  data () {
    return {}
  },

  computed:{
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getProfilePicture: 'user/getProfilePicture',
      getAgreedTermsVersion: 'user/getAgreedTermsVersion',
      getDacBalance: 'user/getDacBalance',
      getSystemBalance: 'user/getSystemBalance',
      getMemberStatus: 'user/getMemberStatus',
      getActiveNetworkName: 'global/getActiveNetworkName',
      getSettingByName: 'user/getSettingByName'
    })
    
  },

}
</script>


<style lang="stylus">
   @import '~variables'
.center_background_image{
    display: inline-block;
    border-radius: 50%;
    background-position: center center;
    background-size: cover; 
    border-radius:50%; 
    width:35px;
    height:35px; 
    display:inline-block;
    border: 2px solid var(--q-color-text2);
    
}

#login_button  .q-focusable:focus .q-focus-helper,
#login_button .q-hoverable:hover .q-focus-helper {
background: inherit;
opacity: 0;

}
#login_button .q-hoverable:active .q-focus-helper {
background: inherit;
opacity: 0;

}
#login_button .q-focus-helper {
opacity: 0;
transition: unset;

}
</style>