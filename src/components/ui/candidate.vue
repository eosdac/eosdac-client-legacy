<template>
<div>
  <!--mobile view (small screen)-->
  <div class="q-mb-md relative-position bg-bg1 bg-logo round-borders lt-sm"  v-bind:class="{ 'selected_candidate': data.selected, 'unselected_candidate':!data.selected, 'shadow-5':!data.selected}">
    <q-chip class="q-ma-xs absolute-top-left" color="bg2" >{{data.rank}}</q-chip>
    <div class="row justify-center q-pt-md">
      <div class="profile_image animate-fade relative-position"  style="width: 100px; height:100px" v-bind:style="{ 'background-image': 'url(' + profileImage + ')' }" >
        <div v-if="is_custodian" style="position:absolute;bottom:-5px;right:-5px"><q-icon size="36px" color="warning" name="star"/></div>
      </div>
    </div>

    <div class="row justify-center">
      <router-link class="q-headline" :to="{path: '/profile/' + data.candidate_name}" >
        <q-icon :title="$t('candidate.nominated_next')" style="margin-top:-5px" v-if="data.rank < 13" name="fiber_manual_record" color="primary" />{{ data.candidate_name }}
      </router-link>
    </div>

    <div class="row justify-between  q-px-md q-pt-md q-body-1"  >
      <span><span class="text-text2">{{$t('candidate.votes')}}:</span> {{ $helper.toLocaleNumber(data.total_votes/10000) }}</span>
      <span><span class="text-text2">{{$t('candidate.staked')}}:</span> {{$helper.assetToLocaleNumber(data.locked_tokens)}}</span>
    </div>


    <div class="row justify-between  q-px-md q-pb-md q-body-1"  >
      <span><span class="text-text2">{{$t('candidate.pay')}}:</span> {{$helper.assetToLocaleNumber(data.requestedpay) }}</span>
      <span class="text-text2"  v-if="data.profile && (data.profile.givenName !='' || data.profile.familyName !='')" >({{data.profile.givenName}} {{data.profile.familyName}})</span>
    </div>

    <div class="bg-bg2 text-italic text-text2 q-body-1 q-mx-xs q-pa-sm round-borders" v-if="data.profile">
      <MarkdownViewer v-if="data.profile" :tags="['h1', 'h2', 'h3', 'italic', 'bold', 'underline', 'strikethrough', 'subscript', 'superscript', 'anchor', 'orderedlist', 'unorderedlist']" dark :text="data.profile.description.slice(0, 140)+'...'" />
    </div>

    <div class="row justify-between q-pa-md">
      <q-btn v-if="!data.selected" icon="icon-plus" color="primary" :label="$t('candidate.select')" @click="$emit('clickvotefor')" />
      <q-btn v-if="data.selected" icon="icon-ui-6" color="positive" :label="$t('candidate.unselect')" @click="$emit('clickunvotefor')" />
      <q-btn v-if="data.profile" color="bg2" :label="$t('candidate.read_more')" @click="profilemodal = true"/>
    </div>
  

    <q-modal maximized v-model="profilemodal">
      <div style="height:50px" class="bg-bg2 row items-center justify-between q-px-md text-text1">
        <span>Bio</span>
        <q-btn icon="close" @click="profilemodal = false" class="no-shadow"/>
      </div>
      <div class="q-pa-md bg-bg1 full-height">
        <div class="row items-center q-mb-md">
          <div class="profile_image on-left animate-fade relative-position"  style="width: 60px; height:60px" v-bind:style="{ 'background-image': 'url(' + profileImage + ')' }" >
            <div v-if="is_custodian" style="position:absolute;bottom:-5px;right:-5px"><q-icon size="24px" color="warning" name="star"/></div>
          </div>
          <router-link class="q-headline" :to="{path: '/profile/' + data.candidate_name}" >
            <q-icon :title="$t('candidate.nominated_next')" style="margin-top:-5px" v-if="data.rank < 13" name="fiber_manual_record" color="primary" />{{ data.candidate_name }}
          </router-link>
        </div>
        <MarkdownViewer v-if="data.profile" :tags="['h1', 'h2', 'h3', 'italic', 'bold', 'underline', 'strikethrough', 'subscript', 'superscript', 'anchor', 'orderedlist', 'unorderedlist']" class="bg-dark2" dark :text="data.profile.description" />
        <SocialLinks class="q-mt-md" :links="sociallinks" />
      </div>
    </q-modal>

  </div>

  <!--desktop-->
  <div class="q-mb-md bg-bg1 round-borders gt-xs"  v-bind:class="{ 'selected_candidate': data.selected, 'unselected_candidate':!data.selected, 'shadow-5':!data.selected}">
    <q-collapsible  label="First" group="candidates" icon-toggle header-class="candidate_header" collapse-icon="icon-ui-11">
      <template slot="header" >
        <q-item-side left >
          <div class="row full-height items-center">
            <q-btn v-if="!data.selected" class="q-mr-md float-left" icon="icon-plus" round color="primary" style="height:55px;width:55px;margin-top:0px;" @click="$emit('clickvotefor')" />
            <q-btn v-else class="q-mr-md" icon="icon-ui-6" round color="positive" style="height:55px;width:55px;margin-top:0px;" @click="$emit('clickunvotefor')"/>
            <div class="profile_image float-left animate-fade relative-position"  style="width: 60px; height:60px" v-bind:style="{ 'background-image': 'url(' + profileImage + ')' }" >
              <div v-if="is_custodian" style="position:absolute;bottom:-5px;right:-5px"><q-icon size="24px" color="warning" name="star"/></div>
            </div>
          </div>
        </q-item-side>
        <q-item-main >
          <div class="q-ml-lg">
            <router-link class="q-headline" :to="{path: '/profile/' + data.candidate_name}" >
              <q-icon title="Nominated for next custodian board" style="margin-top:-5px" v-if="data.rank < 13" name="fiber_manual_record" color="primary" />{{ data.candidate_name }}
            </router-link>
            <span class="text-text2"  v-if="data.profile && (data.profile.givenName !='' || data.profile.familyName !='')" >({{data.profile.givenName}} {{data.profile.familyName}})</span>
            <br>
            <span><span class="text-text2">{{$t('candidate.votes')}}:</span> {{ $helper.toLocaleNumber(data.total_votes/10000) }}</span>
            <span><span class="q-pl-md text-text2">{{$t('candidate.staked')}}:</span> {{$helper.assetToLocaleNumber(data.locked_tokens)}}</span>
          </div>
        </q-item-main>
      </template>
      <div class="q-pt-sm q-px-md" style="border-top:1px solid grey; overflow-x: hidden">
        <q-scroll-area 
          style="width: 100%; height: 300px;"
          :thumb-style="{
            right: '-13px',
            borderRadius: '2px',
            background: '#7c41ba',
            width: '10px',
            opacity: 0.8
          }"
        >
        <div class="q-my-md">BIO <div class="float-right q-body-2"><span class="text-text2">{{$t('candidate.requestedpay')}}: </span>{{ $helper.assetToLocaleNumber(data.requestedpay) }}</div></div>
        <!--<div class="text-text2 q-body-1" style="overflow:hidden; white-space: pre-wrap;" v-if="data.profile !== undefined">{{data.profile.description}}</div>-->
        <MarkdownViewer v-if="data.profile" :tags="['h1', 'h2', 'h3', 'italic', 'bold', 'underline', 'strikethrough', 'subscript',
          'superscript', 'anchor', 'orderedlist', 'unorderedlist']" class="bg-dark2" dark :text="data.profile.description" />
        </q-scroll-area>
        <div class="row justify-between items-center full-height q-pb-sm">
          <div class="q-mb-md" style="border-bottom:1px solid grey; width:100%;height:5px"></div>
          <SocialLinks :links="sociallinks" />
          <a target="_blank" :href="website" class="a2" >{{website}}</a>
        </div>
      </div>
    </q-collapsible>
  </div>
</div>
</template>

<script>
import {mapGetters} from 'vuex';
import SocialLinks from 'components/ui/social-links';
import MarkdownViewer from 'components/ui/markdown-viewer';
export default {
  name: 'Candidate',
  components: {
    SocialLinks,
    MarkdownViewer
  },

  props: {
    data: Object,
  },

  data () {
    return {
      profileImage : this.data.profile.image || this.$profiles.default_avatar,
      sociallinks : this.data.profile.sameAs ? this.data.profile.sameAs.map(p=> p.link) : [],
      website : this.data.profile.url || '',
      profilemodal: false
    }
  },
  computed: {
    ...mapGetters({
      getCustodians: 'dac/getCustodians'
    }),
    is_custodian(){
      if(this.getCustodians){
        return this.getCustodians.find(c=> this.data.candidate_name == c.cust_name)
      }
      else{
        return false;
      }
      
    }
  },
  mounted(){

  }

}
</script>

<style lang ="stylus">
@import '~variables'

.candidate_header{
  height:80px;
  border-radius:2px;
}

.selected_candidate{
  border:2px solid $positive;
  transition : border 400ms ease;
}

.unselected_candidate{
  border:2px solid transparent;
  transition : border 400ms ease;
}

</style>
