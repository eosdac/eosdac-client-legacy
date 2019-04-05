<template>
  <div class="fixed full-width full-height bg-bg1">
    <div class="fixed-center text-center ">
      <p>
        <img
          v-if="getIsDark"
          src="../extensions/branding/images/logo/logo-notext.svg"
          style="width:30vw;max-width:150px;"
        />
      </p>
      <p class="text-faded">
        {{ $t("four_zero_four.sorry_nothing_here") }}<strong>(404)</strong>
      </p>
      <q-btn color="primary" style="width:200px;" @click="$router.push('/')">{{
        $t("four_zero_four.go_back")
      }}</q-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Error404",
  computed: {
    ...mapGetters({
      getIsDark: "ui/getIsDark"
    })
  }
};
</script>
