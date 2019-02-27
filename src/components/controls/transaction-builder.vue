<template>
  <div>
    <action-maker />
  </div>
</template>

<script>
import actionMaker from 'components/controls/action-maker';

export default {
  name: 'transactionBuilder',
  components:{
    actionMaker
  },
  data () {
    return {
      contract: '',
      action_name:''
    }
  }
}
</script>

<style>
</style>
