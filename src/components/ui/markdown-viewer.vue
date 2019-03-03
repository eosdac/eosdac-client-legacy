<template>
<div>
  <div v-if="!edit" v-html="convertedAndSanitizedHtml" class="markdown-body q-body-ow" v-bind:class="{ overwritemd: dark }"></div>
  <div v-else class="relative-position q-pb-lg">
  <medium-editor ref="markeditor" id="markeditor" class="markdown-body q-body-ow" v-bind:class="{ overwritemd: dark }" :text='editText' custom-tag='div' :options="options" v-on:edit='applyTextEdit' />
  <div class="absolute-bottom bg-dark2">{{ $t('markdown_viewer.select_text_to_edit') }}</div>
  </div>
</div>
</template>

<script>
import sanitizeHtml from 'sanitize-html'
import marked from 'marked'
import TurndownService from 'turndown'
const turndownService = new TurndownService()

export default {
  name: 'MarkdownViewer',
  props: {
    text: String,
    dark: Boolean,
    blackList: Boolean,
    tags: Array,
    edit: Boolean
  },
  methods: {
    applyTextEdit(operation) {
      this.editText = operation.api.origElements.innerHTML
      this.$emit('update', turndownService.turndown(this.editText))
    },
    buttonsToTags(buttons) {
      let tags = []
      for (let i = 0; i < buttons.length; i++) {
        switch (buttons[i]) {
          case 'italic':
            tags.push('i')
            break;
          case 'bold':
            tags.push('b')
            tags.push('strong')
            break;
          case 'underline':
            tags.push('u')
            break;
          case 'strikethrough':
            tags.push('del')
            break;
          case 'subscript':
            tags.push('sub')
            break;
          case 'superscript':
            tags.push('sup')
            break;
          case 'anchor':
            tags.push('a')
            break;
          case 'image':
            tags.push('img')
            break;
          case 'quote':
            tags.push('blockquote')
            break;
          case 'orderedlist':
            tags.push('ol')
            tags.push('li')
            break;
          case 'unorderedlist':
            tags.push('ul')
            tags.push('li')
            break;
          default:
            tags.push(buttons[i])
        }
      }
      tags.push('p')
      tags.push('hr')
      return tags
    }
  },
  data() {
    return {
      editText: '',
      options: {
        toolbar: {
          buttons: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'italic', 'bold', 'underline', 'strikethrough', 'subscript',
            'superscript', 'anchor', 'image', 'quote', 'pre', 'orderedlist', 'unorderedlist', 'indent', 'outdent', 'justifyLeft',
            'justifyCenter', 'justifyRight', 'justifyFull', 'removeFormat'
          ]
        }
      }
    }
  },
  computed: {
    convertedAndSanitizedHtml() {
      return sanitizeHtml(marked(this.text, {
        sanitize: true
      }), {
        allowedTags: this.buttonsToTags(this.options.toolbar.buttons)
      })
    }
  },
  created() {
    if (this.tags && this.tags.length) {
      let arr = this.options.toolbar.buttons
      if (this.blackList) {
        for (let i = 0; i < this.tags.length; i++) {
          arr.splice(arr.indexOf(this.tags[i]), 1)
        }
        this.options.toolbar.buttons = this.arr
      } else {
        this.options.toolbar.buttons = this.tags
      }
    }

  },
  watch: {
    edit(val) {
      if (val) {
        this.editText = sanitizeHtml(marked(this.text, {
          sanitize: false
        }), {
          allowedTags: this.buttonsToTags(this.options.toolbar.buttons)
        })
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'
.medium-editor-toolbar {
  background-color: var(--q-color-bg2) !important;
}
.overwritemd {
  background: none !important;
  color: var(--q-color-text2) !important;
  opacity: .87 !important;
}
.overwritemd h1, .overwritemd h2{
  color: var(--q-color-text2) !important;
}
.overwritemd td, .overwritemd th {
  background: var(--q-color-bg2) !important; 
}

.q-body-ow {
  font-size: 14px !important;
  font-weight: 400 !important;
  line-height:20px !important;
}

.medium-toolbar-arrow-under:after {
  border-color: #000 transparent transparent transparent;
  top: 40px; }

.medium-toolbar-arrow-over:before {
  border-color: transparent transparent #000 transparent; }

.medium-editor-toolbar {
  background-color: var(--q-color-bg2) !important;
  border: none;
  border-radius: $generic-border-radius }
  .medium-editor-toolbar li button {
    background-color: transparent;
    border: none;
    box-sizing: border-box;
    color: #ccc;
    height: 40px;
    min-width: 40px;
    padding: 5px 12px;
    -webkit-transition: background-color .2s ease-in, color .2s ease-in;
            transition: background-color .2s ease-in, color .2s ease-in; }
    .medium-editor-toolbar li button:hover {
      background-color: #000;
      color: #a2d7c7; }
  .medium-editor-toolbar li .medium-editor-button-first {

    padding-left: 24px; }
  .medium-editor-toolbar li .medium-editor-button-last {

    border-right: none;

    padding-right: 24px; }
  .medium-editor-toolbar li .medium-editor-button-active {
    background-color: #000;
    color: #a2d7c7;

   }

.medium-editor-toolbar-form {
  background: #000;
  border-radius: 50px;
  color: #ccc;
  overflow: hidden; }
  .medium-editor-toolbar-form .medium-editor-toolbar-input {
    background: #000;
    box-sizing: border-box;
    color: #ccc;
    height: 40px;
    padding-left: 16px;
    width: 220px; }
    .medium-editor-toolbar-form .medium-editor-toolbar-input::-webkit-input-placeholder {
      color: #f8f5f3;
      color: rgba(248, 245, 243, 0.8); }
    .medium-editor-toolbar-form .medium-editor-toolbar-input:-moz-placeholder {
      /* Firefox 18- */
      color: #f8f5f3;
      color: rgba(248, 245, 243, 0.8); }
    .medium-editor-toolbar-form .medium-editor-toolbar-input::-moz-placeholder {
      /* Firefox 19+ */
      color: #f8f5f3;
      color: rgba(248, 245, 243, 0.8); }
    .medium-editor-toolbar-form .medium-editor-toolbar-input:-ms-input-placeholder {
      color: #f8f5f3;
      color: rgba(248, 245, 243, 0.8); }
  .medium-editor-toolbar-form a {
    color: #ccc;
    -webkit-transform: translateY(2px);
            transform: translateY(2px); }
  .medium-editor-toolbar-form .medium-editor-toolbar-close {
    margin-right: 16px; }

.medium-editor-toolbar-anchor-preview {
  background: #000;

  padding: 5px 12px; }

.medium-editor-anchor-preview a {
  color: #ccc;
  text-decoration: none; }

.medium-editor-toolbar-actions li, .medium-editor-toolbar-actions button {
   }
</style>
