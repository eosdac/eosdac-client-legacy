<template>
  <q-page class="q-pa-md">
    <div class="q-pa-md round-borders shadow-5 bg-bg1 bg-logo">
      <transaction-builder />
    </div>
  </q-page>
</template>

<script>
import transactionBuilder from 'components/controls/transaction-builder';
export default {
  name: 'transactions',
  components: {
    transactionBuilder
  }
};
</script>

<style></style>
