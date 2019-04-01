<template>
  <span>
    <q-spinner v-if="value === null" color="text1" />
    <span v-else>{{ value }}</span>
  </span>
</template>

<script>
export default {
  name: 'Xspan',
  props: {
    value: false
  },
  data() {
    return {};
  },
  mounted() {
    // console.log(this.value)
  }
  // watch: {
  //   value: function(newVal, oldVal) { // watch it
  //     // console.log('Prop changed: ', newVal, ' | was: ', oldVal)
  //     this.test = newVal
  //   }
  // }
};
</script>

<style></style>
