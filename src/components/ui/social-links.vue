<template>
  <div>
    <a
      v-if="social.link != ''"
      v-for="(social, i) in parseLinks"
      class="on-left"
      :key="i"
      :href="social.link"
      target="_blank"
    >
      <q-btn class="hvr-grow" round color="bg2">
        <q-icon :name="'icon-' + social.icon" />
      </q-btn>
    </a>
  </div>
</template>

<script>
export default {
  name: "SocialLinks",

  props: {
    links: Array
  },

  computed: {
    parseLinks() {
      let parsed = [];

      this.links.forEach(link => {
        if (!this.$helper.isUrl(link)) {
          return false;
        }
        link = this.matchSocialIcon(link);
        parsed.push(link);
      });
      return parsed;
    }
  },

  methods: {
    matchSocialIcon(link) {
      //supported social networks
      link = link.indexOf("://") === -1 ? "http://" + link : link;
      // console.log(link)
      const icons = [
        "social-youtube-com",
        "social-linkedin-com",
        "social-ask-fm",
        "social-tumblr-com",
        "social-weibo-com",
        "social-qzoneqq-com",
        "social-flickr-com",
        "social-instagram-com",
        "social-facebook-com",
        "social-plusgoogle-com",
        "social-meetup-com",
        "social-ok-ru",
        "social-reddit-com",
        "social-twitter-com",
        "social-vk-com",
        "social-pinterest-com",
        "social-behance-net",
        "social-dribble-com",
        "social-github-com",
        "social-medium-com",
        "social-steemit-com",
        "social-general"
      ];

      let lookup = icons.map(icon => {
        return icon.split("-")[1];
      });

      let urlparts = new URL(link); //does not work in IE
      let hostparts = urlparts.hostname.split(".");

      if (hostparts[0] === "www") {
        delete hostparts[0];
      }
      hostparts.pop(); //remove TLD
      let host = hostparts.join("");
      let i = lookup.indexOf(host);
      if (i > -1) {
        return { link: link, icon: icons[i] };
      } else {
        return { link: link, icon: "social-general" };
      }
    }
  }
};
</script>

<style>
/* Grow */
.hvr-grow {
  display: inline-block;
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -webkit-transition-property: transform;
  transition-property: transform;
}
.hvr-grow:hover,
.hvr-grow:focus,
.hvr-grow:active {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
