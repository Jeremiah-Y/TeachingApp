<template>

  <!--Human-Computer Partnerships overview-->

  <div class="HCPartnershipsTable" style="display:table">
  <div style="display:table-cell">
    <table>
      <tr>
        <th></th>
        <th>Discoverability</th>
        <th>Appropriability</th>
        <th>Expressivity</th>
      </tr>
      <tr>
        <th>Instrument (Input)</th>
        <td>
          <div id="discoverabilityDemo">
          <DiscoverabilityDemo :height="height" :width="width" @explain="addExplanation"></DiscoverabilityDemo>
          </div>
          <p class="caption">Use the eraser and see what can be erased</p>
        </td>
        <td>
          <div id="appropriabilityDemo">
          <AppropriabilityDemo :height="height" :width="width" @explain="addExplanation"></AppropriabilityDemo>
          </div>
          <p class="caption">Resize the stickyline to catch each shape with only one vertical movement</p>
        </td>
        <td>
          <div id="expressivityDemo">
          </div>
          <p class="caption"></p>
        </td>
      </tr>
      <tr>
        <th>Substrate (Output)</th>
        <td>
          <div id="discoverabilitySubstrateDemo">
          <DiscoverabilitySubstrateDemo :height="height" :width="width" @explain="addExplanation"></DiscoverabilitySubstrateDemo>
          </div>
          <p class="caption">Try to swap object by moving them on the stickyline. An indication will appear.</p>
        </td>
        <td>
          <div id="appropriabilitySubstrateDemo">
          <AppropriabilitySubstrateDemo :height="height" :width="width" @explain="addExplanation"></AppropriabilitySubstrateDemo>
          </div>
          <p class="caption">Right click on the line/center to change distribution mode/alignment center. Stretch and rotate the stickyline.</p>
        </td>
        <td>
          <div id="expressivitySubstrateDemo" >
          </div>
          <p class="caption"></p>
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
import AppropriabilityDemo from '@/components/canvas/hc-partnerships-demo/AppropriabilityDemo.vue'
import AppropriabilitySubstrateDemo from '@/components/canvas/hc-partnerships-demo/AppropriabilitySubstrateDemo.vue'
import NarativeBox from '@/components/interactive-components-for-canvas/NarativeBox.vue'
import DiscoverabilitySubstrateDemo from '@/components/canvas/hc-partnerships-demo/DiscoverabilitySubstrateDemo.vue'
import DiscoverabilityDemo from '@/components/canvas/hc-partnerships-demo/DiscoverabilityDemo.vue'




export default {
  name: 'HCPartnershipsTableView',
  components: {
    AppropriabilitySubstrateDemo,
    AppropriabilityDemo,
    DiscoverabilitySubstrateDemo,
    DiscoverabilityDemo,
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
  height:auto;
}
</style>
