<template>
  <div
    v-if="getSettingByName('debug_data_structure').value"
    class="debug_data_structure bg-bg1 q-pa-md q-mt-md round-borders shadow-5 animate-fade"
  >
    <div class="text-text1 q-mb-md">Data Structures</div>
    <!-- <span v-if="copied_to_clipboard_msg !=null" class="q-pa-sm animate-fade q-caption text-dimwhite" >{{copied_to_clipboard_msg}}</span>
  <q-btn icon="" @click="copyToClipboard" /> -->
    <div
      id="debug_data_output"
      class="overflow-hidden"
      v-html="debug_data_structures"
    ></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
const prettyHtml = require('json-pretty-html').default;
export default {
  // name: 'ComponentName',
  data() {
    return {
      raw: false,
      copied_to_clipboard_msg: null
    };
  },
  props: {
    data: Array
  },
  computed: {
    ...mapGetters({
      getSettingByName: 'user/getSettingByName'
    }),

    debug_data_structures() {
      if (!this.data) return [];
      this.raw = this.data;
      let obj = this.data;
      return prettyHtml(obj);
    }
  },
  methods: {
    // copyToClipboard(){
    //   let content = JSON.stringify(this.data);
    //   document.addEventListener('copy', (e) => {
    //     e.clipboardData.setData('text/plain', content);
    //     e.preventDefault();
    //     document.removeEventListener('copy');
    //   });
    //   document.execCommand('copy');
    // }
  }
};
</script>

<style></style>
