<template>
  <div>
<div class="fileContainer q-mb-md ">
    Add file
    <input type="file" ref="myfileinput" @input="handleInput()" />
</div>
  </div>
</template>

<script>
export default {
  name: 'fileInput',
  data () {
    return {

    }
  },
  methods:{
    async handleInput(){
      let f = await this._readLocalFile();
      // console.log(Buffer.from(f))
      this.$emit('input', Buffer.from(f) );
    },

    async _readLocalFile(bytes=false) {

      var file = this.$refs.myfileinput.files[0]
      
      return new Promise((resolve, reject) => {
        var fr = new FileReader();  
        fr.onload = function(result){

            return resolve(fr.result);
        }; 
        if(bytes){
            fr.readAsBinaryString(file);
        }
        else{
            fr.readAsText(file);
        }
      });
    },
  }
}
</script>

<style>
.fileContainer {
    overflow: hidden;
    position: relative;
    background:blue;
    display: inline-block;
    padding:10px;
    cursor: pointer;
    
}

.fileContainer [type=file] {
    cursor: inherit;
    display: block;
    font-size: 999px;
    filter: alpha(opacity=0);
    min-height: 100%;
    min-width: 100%;
    opacity: 0;
    position: absolute;
    right: 0;
    text-align: right;
    top: 0;
}

</style>
