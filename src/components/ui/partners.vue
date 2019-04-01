<template>
  <div v-if="items.length">
    <a
      v-for="(p, i) in items"
      class="on-left"
      :key="i"
      :href="p.url"
      target="_blank"
      style=" display:inline-block"
    >
      <div class="row items-center">
        <img :style="style" :src="p.logo" />
        <span>{{ p.name }}</span>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  name: "partners",
  props: {
    size: String,
    items: Array
  },
  computed: {
    style() {
      return "width: " + this.size + "; margin-right:4px";
    }
  },

  methods: {},
  mounted() {}
};
</script>

<style></style>
