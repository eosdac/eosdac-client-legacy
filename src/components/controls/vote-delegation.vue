<template>
  <div class="row gutter-md">
    {{ wpcats }}
    <div
      class="col-xs-12 col-lg-6"
      v-for="(cat, i) in wpcats"
      :key="`wpcat${i}`"
    >
      <q-item class="no-padding">
        <q-item-main>
          <q-item-tile class="text-text2" label>{{
            $t(`wp_categories.${cat.label}`)
          }}</q-item-tile>
          <member-select
            v-model="cat.delegatee"
            :accountnames="[
              'piecesnbitss',
              'evilmikehere',
              'testtesttest',
              'lukedactest1'
            ]"
          />
        </q-item-main>
      </q-item>
    </div>
  </div>
</template>

<script>
import memberSelect from "components/controls/member-select";
import wpcats from "../../extensions/statics/config/wp_categories.json";
export default {
  // name: 'ComponentName',
  components: {
    memberSelect
  },
  data() {
    return {
      wpcats: []
    };
  },
  methods: {
    setWpCats() {
      this.wpcats = JSON.parse(JSON.stringify(wpcats)).map(wpc => {
        wpc.delegatee = "";
        return wpc;
      });
    }
  },
  created() {
    this.setWpCats();
  }
};
</script>

<style></style>
