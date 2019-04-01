<template>
  <transition name="votedelta">
    <div
      v-if="animate && vote_delta != 0"
      class="vote_delta_common"
      :class="statusClass"
    >
      <q-icon v-if="vote_delta < 0" name="mdi-minus" style="margin-top:-2px" />
      <q-icon v-if="vote_delta > 0" name="mdi-plus" style="margin-top:-2px" />
      <span>{{ $helper.toLocaleNumber(Math.abs(vote_delta / 10000)) }}</span>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "voteAnimation",
  props: {
    vote_delta: Number
  },
  data() {
    return {
      statusClass: [],
      animate: false
    };
  },
  // computed:{
  //   ...mapGetters({
  //     getSettingByName: 'user/getSettingByName'
  //   })

  // },
  watch: {
    vote_delta() {
      if (this.vote_delta > 0) {
        this.statusClass = ["vote_delta_positive"];
        this.animate = true;
      } else {
        this.statusClass = ["vote_delta_negative"];
        this.animate = true;
      }
      setTimeout(() => {
        this.animate = false;
      }, 1200);
    }
  }
};
</script>

<style lang="stylus">
@import '~variables'

.vote_delta_common{
  position:absolute;
  left:150px;
  opacity:0;
  border-radius: 8px;
  padding-top:2px;
  padding-bottom:2px;
  padding-left:5px;
  padding-right:5px;
  color: var(--q-color-text1)

}
.vote_delta_positive{
  background-color: var(--q-color-positive)
}
.vote_delta_negative{
  background-color: var(--q-color-negative)
}
.votedelta-enter-active {
  animation: votedelta 1.2s;
}
/* .votedelta-leave-active {
  animation: votedelta .5s reverse;
} */
@keyframes votedelta{
    0%{
        transform: rotate(0) scale(0) translateX(-20px) translateY(0) skewX(0) skewY(0);
        transform-origin: 0;
        opacity: 0;
        }
    25%{
        transform: rotate(0) scale(1) translateX(0) translateY(-10px) skewX(0) skewY(0);
        transform-origin: 0;
        opacity: 1;
        }
    60%{
        transform: rotate(0) scale(1) translateX(0) translateY(-10px) skewX(0) skewY(0);
        transform-origin: 0;
        opacity: 1;
        }
    100%{
        transform: rotate(0) scale(0.7) translateX(-50px) translateY(0) skewX(0) skewY(0);
        transform-origin: 0;
        opacity: 0;
        }
}
</style>
