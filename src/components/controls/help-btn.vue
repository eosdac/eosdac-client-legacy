<template>
  <div>
    <q-btn
      round
      flat
      :size="size"
      :color="color"
      icon="mdi-help-circle"
      class="animate-pop"
    >
      <q-popover class="bg-bg2 bg-logo">
        <div class="q-pa-sm" style="max-width:400px">
          <div class="q-mb-sm text-text1" v-if="title">{{ title }}</div>
          <div class="q-body-1 text-text2">{{ content }}</div>
        </div>
      </q-popover>
    </q-btn>
  </div>
</template>

<script>
export default {
  name: "helpBtn",
  props: {
    content: {
      type: String,
      default: "No content given as property"
    },
    title: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "info"
    },
    size: {
      type: String,
      default: "md"
    }
  },
  data() {
    return {};
  }
};
</script>
