<template>
<!--Component of the narative box-->

<div id="box">
    <p id="narativebox" v-for="item in sentences" :key="item" v-html="item"></p>
</div>
</template>
<script>
export default {
  props:['textsForNaration'],

  data() {
    return {
        sentences:this.textsForNaration //Text that have to be shown in the "narative box"
    }
  }
}
</script>
<style>
#narativebox{
  width:400px;
}
#box{
  position:absolute;
  height:500px;
  width:400px;
  border: solid;
  overflow-y: scroll;
  scroll-behavior: auto;
}
mark.red{
    color:#ff0000;
    background: none;
}
mark.blue{
    color:blue;
    background: none;
}
mark.yellow{
  color:yellow;
  background: none;
}
mark.green{
  color:green;
  background: none;
}
mark.black{
  color:black;
  background: none;
}
mark.grey{
  color:rgb(48,48,48);
  background: none;
}
</style>