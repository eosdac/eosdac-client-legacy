<template>
  <div class="row items-center ">
    <transition appear leave-class="animated fadeOut">
      <div
        v-if="getSettingByName('toolbar_menu_items').value && getAccountName"
        class="row  justify-start gt-md q-mr-xl"
      >
        <q-item class="animate-pop">
          <q-item-side :icon="$configFile.icon.dactoken" color="text1" />
          <q-item-main style="margin-left:-5px">
            <q-item-tile class="text-text2 q-caption" label>{{
              $t("default.your_token_balance", {
                tokenName: $configFile.get("dactokensymbol")
              })
            }}</q-item-tile>
            <q-item-tile class="text-text1 q-caption" sublabel
              ><xspan
                :value="
                  $helper.toLocaleNumber(
                    getDacBalance,
                    $configFile.get('tokendecimals')
                  )
                "
            /></q-item-tile>
          </q-item-main>
        </q-item>

        <q-item class="animate-pop">
          <q-item-side :icon="$configFile.icon.systemtoken" color="text1" />
          <q-item-main style="margin-left:-5px">
            <q-item-tile class="text-text2 q-caption" label>{{
              $t("default.your_token_balance", {
                tokenName: $configFile.get("systemtokensymbol")
              })
            }}</q-item-tile>
            <q-item-tile class="text-text1 q-caption" sublabel>
              <xspan
                :value="
                  $helper.toLocaleNumber(
                    getSystemBalance,
                    $configFile.get('systemtokendecimals')
                  )
                "
              />
              <q-icon
                :name="$configFile.icon.liquid"
                color="text2"
                style="margin-left:3px"
                title="Liquid Balance"
              />
            </q-item-tile>
          </q-item-main>
        </q-item>
      </div>
    </transition>

    <div
      v-if="
        getSettingByName('toolbar_profile_image').value &&
          getAccountName &&
          getProfilePicture
      "
      class="row justify-end relative-position"
      style=" margin-right:-12px;"
      ref="profileContainer"
    >
      <profile-pic
        :class="{ grey_scale: isAppIdle }"
        :accountname="getAccountName"
        :scale="0.55"
      />
      <div style="position:absolute;top:7px;right:40px" v-if="isAppIdle">
        <zzz-sleep />
      </div>
    </div>

    <q-btn-dropdown
      id="login_button"
      v-if="getAccountName"
      dense
      flat
      no-ripple
      text-color="text1"
      class="animate-fade"
      :label="getAccountName"
      content-style="margin-top:15px;"
      content-class="round-borders"
    >
      <q-list link class="bg-dark text-text1 round-borders">
        <q-list-header class="text-text2" style="min-width:300px">
          {{ getActiveNetworkName }}
          <span class="q-caption">{{ getAuthString }}</span>
        </q-list-header>
        <q-item>
          <q-item-side
            v-if="getMemberStatus == 'member'"
            :icon="$configFile.icon.check"
            color="positive"
          />
          <q-item-side
            v-if="getMemberStatus == 'pending'"
            :icon="$configFile.icon.pending_sand"
            color="warning"
          />
          <q-item-side v-if="getMemberStatus === false" />
          <q-item-main>
            <q-item-tile class="text-text1" label>{{
              $t("menu.member_status")
            }}</q-item-tile>
            <q-item-tile v-if="getMemberStatus" class="text-text2" sublabel>{{
              getMemberStatus
            }}</q-item-tile>
            <q-item-tile v-else class="text-text2" sublabel
              ><q-btn
                color="primary"
                to="/constitution"
                dense
                :label="$t('menu.signature_required')"
              />
            </q-item-tile>
          </q-item-main>
          <!-- <q-item-side right icon="info" color="amber" /> -->
        </q-item>

        <q-item-separator inset />

        <q-item
          v-close-overlay
          @click.native="$store.dispatch('global/switchAccount')"
        >
          <q-item-side :icon="$configFile.icon.refresh" color="info" />
          <q-item-main>
            <q-item-tile label>{{ $t("menu.switch_account") }}</q-item-tile>
          </q-item-main>
        </q-item>

        <q-item
          v-close-overlay
          @click.native="$store.dispatch('global/logout')"
        >
          <q-item-side :icon="$configFile.icon.account" color="negative" />
          <q-item-main>
            <q-item-tile label>{{ $t("default.logout") }}</q-item-tile>
          </q-item-main>
        </q-item>

        <q-item-separator inset />

        <q-item v-close-overlay to="/settings">
          <q-item-side :icon="$configFile.icon.settings" color="text2" />
          <q-item-main>
            <q-item-tile label>{{ $t("menu.settings") }}</q-item-tile>
          </q-item-main>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <q-btn
      size="lg"
      class="no-shadow animate-fade"
      text-color="text1"
      icon="lock"
      v-if="!getAccountName"
      :label="$t('default.login')"
      @click="$store.dispatch('global/login')"
    />
  </div>
</template>

<script>
import profilePic from "components/ui/profile-pic";
import zzzSleep from "components/ui/zzz-sleep";
import xspan from "components/ui/xspan";
import { mapGetters } from "vuex";
export default {
  name: "ToolbarMenu",
  components: {
    xspan,
    profilePic,
    zzzSleep
  },
  data() {
    return {};
  },

  computed: {
    ...mapGetters({
      getAccountName: "user/getAccountName",
      getAuthString: "user/getAuthString",
      getAgreedTermsVersion: "user/getAgreedTermsVersion",
      getProfilePicture: "user/getProfilePicture",
      getDacBalance: "user/getDacBalance",
      getSystemBalance: "user/getSystemBalance",
      getMemberStatus: "user/getMemberStatus",
      getActiveNetworkName: "global/getActiveNetworkName",
      getSettingByName: "user/getSettingByName"
    })
  }
};
</script>

<style lang="stylus">
 @import '~variables'

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
.grey_scale{
  filter: grayscale(80%);
}
</style>
