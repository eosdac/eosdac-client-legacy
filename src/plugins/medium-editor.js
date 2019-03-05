import MediumEditor from 'vue2-medium-editor'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.component('medium-editor', MediumEditor)
}
