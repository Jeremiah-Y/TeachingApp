<template>
   <!--Instrumental Interaction overview-->
  <div class="instrumentalInteractionTable" style="display:table">
  <div style="display:table-cell">
    <table>
      <tr>
        <th></th>
        <th>Reification</th>
        <th>Polymorphism</th>
        <th>Reuse</th>
      </tr>
      <tr>
        <th>Instrument (Input)</th>
        <td>
          <div id="reificationdemo">
          <ReificationDemo :height="height" :width="width" @explain="addExplanation"></ReificationDemo>
          </div>
          <p class="caption">Use Stickyline to align the shapes</p>
        </td>
        <td>
          <div id="polymorphismdemo">
          <PolymorphismDemo :height="height" :width="width" @explain="addExplanation"></PolymorphismDemo>
          </div>
          <p class="caption">Use Stickyline to align shapes, text, and even pictures</p>
        </td>
        <td>
          <div id="reusedemo">
          <ReuseDemo :height="height" :width="width" @explain="addExplanation"></ReuseDemo>
          </div>
          <p class="caption">Reuse Stickyline to align another group of objects (right-click,copy and paste)</p>
        </td>
      </tr>
      <tr>
        <th>Substrate (Output)</th>
        <td>
          <div id="reificationSubstrateDemo">
          <ReificationSubstrateDemo :height="height" :width="width" @explain="addExplanation"></ReificationSubstrateDemo>
          </div>
          <p class="caption">Use Stickyline to move the aligned objects together</p>
        </td>
        <td>
          <div id="polymorphismSubstrateDemo">
          <PolymorphismSubstrateDemo :height="height" :width="width" @explain="addExplanation"></PolymorphismSubstrateDemo>
          </div>
          <p class="caption">Stickyline preserves both alignment and distribution</p>
        </td>
        <td>
          <div id="reuseSubstrateDemo" >
          <ReuseSubstrateDemo :height="height" :width="width" @explain="addExplanation"></ReuseSubstrateDemo>
          </div>
          <p class="caption">Reuse Stickyline to duplicate the aligned objects (right-click,copy and paste)</p>
        </td>
      </tr>
    </table>
  </div>
  
  <div id="narationBox" style='display:table-cell'>
  <NarativeBox class="narativeBox" :texts-for-naration="naration" ></NarativeBox>
  </div>
  </div>
</template>

<script>
// @ is an alias to /src
import ReificationDemo from '@/components/canvas/instrumental-interaction-demo/ReificationDemo.vue'
import ReuseDemo from '@/components/canvas/instrumental-interaction-demo/ReuseDemo.vue'
import PolymorphismDemo from '@/components/canvas/instrumental-interaction-demo/PolymorphismDemo.vue'
import PolymorphismSubstrateDemo from '@/components/canvas/instrumental-interaction-demo/PolymorphismSubstrateDemo.vue'
import ReuseSubstrateDemo from '@/components/canvas/instrumental-interaction-demo/ReuseSubstrateDemo.vue'
import ReificationSubstrateDemo from '@/components/canvas/instrumental-interaction-demo/ReificationSubstrateDemo.vue'
import NarativeBox from '@/components/interactive-components-for-canvas/NarativeBox.vue'


export default {
  name: 'InstrumentalInteractionTableView',
  components: {
    ReificationDemo,
    ReuseDemo,
    PolymorphismDemo,
    PolymorphismSubstrateDemo,
    ReuseSubstrateDemo,
    ReificationSubstrateDemo,
    NarativeBox,
  },
  created() {
        this.width = 300;
        this.height = 260;
  },
  updated(){
    let elem = document.getElementsByClassName("narativeBox")[0]
    elem.scrollTop=elem.scrollHeight
  },
  data(){
    return{
      naration:[],
      last_origin:'',
      last_text:'',
    }
  },
  methods:{
    addExplanation(e){
      let text=e.text
      if(e.origin!=this.last_origin){
        this.last_origin=e.origin;
        this.last_text=text
        this.naration.splice(0,this.naration.length)
        this.naration.push(e.origin+" :<br>",)
        
      this.naration.push(text,);
      }else if(text!=this.last_text){
      this.naration.push("***",)
      this.naration.push(text,);
      this.last_text=text
      }
      let elem = document.getElementsByClassName("narativeBox")[0]
      
      elem.scrollTop=elem.scrollHeight
    },
  }
}
</script>

<style>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
.caption{
  width: 300px;
  height:20px
}
</style>
