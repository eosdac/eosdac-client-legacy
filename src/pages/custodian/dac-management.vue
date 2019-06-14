<template>
  <q-page>
    <q-tabs color="primary">
      <q-route-tab
        default
        label="financials"
        to="/custodian/dac-management/financials"
        slot="title"
      />
      <q-route-tab
        default
        label="configuration"
        to="/custodian/dac-management/configuration"
        slot="title"
      />
      <router-view />
    </q-tabs>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
};
</script>

<style></style>
