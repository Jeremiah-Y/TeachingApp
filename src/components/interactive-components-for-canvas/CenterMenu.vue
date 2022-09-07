<template>

<!--Menu that appear when right click on the center-->

<div id="menu">
<button id="Top" :style="style" @click="GenerateButtonEvent" @mouseover="onHover">Top</button>
<button id="Middle" :style="style" @click="GenerateButtonEvent">Middle</button>
<button id="Bottom" :style="style" @click="GenerateButtonEvent">Bottom</button>
</div>
</template>
<script>


export default {
    props: {
        displayMenu: String,
        ConcernedShape: Object,
        //CopiedShape: Object,
        defaultAlignment: String, //string to tell position of the center
        color:{
          type: String,
          default: 'white'
        },
    },
    data(){
        return{   
            style: {
              '--top_button_color':'white',
              '--middle_button_color':'grey',
              '--bottom_button_color':'white',
            }
        }
    },
    watch: {
      defaultAlignment:function(newVal,oldVal){
        if(newVal!=oldVal){
          this.update()
        }
      }
    },
    methods:{

      //update the menu so that the current position of the center is colored in gray.
      update(){
        if(this.defaultAlignment=="Middle"){
          this.style={'--top_button_color':'white','--middle_button_color':'grey','--bottom_button_color':'white',}
              
        }else if(this.defaultAlignment=="Top"){
          this.style={'--top_button_color':'grey','--middle_button_color':'white','--bottom_button_color':'white',} 
        }
        else if(this.defaultAlignment=="Bottom"){
          this.style={'--top_button_color':'white','--middle_button_color':'white','--bottom_button_color':'grey',}
        }
        else{
          this.style= {'--top_button_color':'white','--middle_button_color':'white','--bottom_button_color':'white',}
        }
      },

      //Wen we click on a button,we emit the corresponding event.
      GenerateButtonEvent(e){
        if(e.target.id=="Top"){
          this.$emit('center-button', "Top");
        }
        if(e.target.id=="Middle"){
          this.$emit('center-button',"Middle");
        }
        if(e.target.id=="Bottom"){
          this.$emit('center-button',"Bottom");
        }

      },
    },
}
</script>
<style scoped>
     body {
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: #f0f0f0;
      }

      #menu {
        display: initial;
        position: absolute;
        background-color: white;
        box-shadow: 0 0 5px grey;
        border-radius: 3px;
      }

      #menu #Top {
        width: 100%;
        border: none;
        margin: 0;
        background-color: var(--top_button_color);
        padding: 10px;
      }


      #menu #Top:hover {
        background-color: lightgray;
      }
      #menu #Middle {
        width: 100%;
        border: none;
        margin: 0;
        background-color: var(--middle_button_color);
        padding: 10px;
      }


      #menu #Middle:hover {
        background-color: lightgray;
      }
      
      #menu #Bottom {
        width: 100%;
        border: none;
        margin: 0;
        background-color: var(--bottom_button_color);
        padding: 10px;
      }


      #menu #Bottom:hover {
        background-color: lightgray;
      }
</style>