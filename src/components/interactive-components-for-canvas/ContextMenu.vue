<template>

<!--This component is the one of the context menu that can pop on canvas such as the playground-->

<div id="menu">
<!--<button id="ChangeCenter" @click="GenerateButtonEvent" v-if="!menuOfStage">Change Center</button>-->
<!--<button id="DetachShape" @click="GenerateButtonEvent" v-if="menuOfGroupedShape">Detach</button>-->
<button id="KeepDistance" @click="GenerateButtonEvent" v-if="menuOfLine && needSwitchDistributionModeButton">{{ keepDistanceButtonText}}</button>
<button id="Copy" @click="GenerateButtonEvent" v-if="!menuOfStage && needCopyButton">Copy</button>
<button id="CopyAll" @click="GenerateButtonEvent" v-if="menuOfLine && needCopyAllButton">Copy All</button>
<button id="Past" @click="GenerateButtonEvent" v-if="menuOfStage && needPastButton">Past</button>
<!--<button id="Remove" @click="GenerateButtonEvent" v-if="!menuOfStage">Remove</button>
<button id="RemoveAll" @click="GenerateButtonEvent" v-if="menuOfGroupedShape">Remove All</button>-->
</div>
</template>
<script>

export default {
    props: {
        //displayMenu: String,
        ConcernedShape: Object, //Target object (where user right click to make the context menu appear)
        CopiedShape: Object, //Copied object (if Copy or CopyAll button is selected)
        pastOneObject:{ //Say if we want to past only one object (after Copy) or all objects of a group (after CopyAll)
          type: Boolean,
          default: true,
        },
        
        menuOfStage: { //Say if the context menu is the one of the stage
          type: Boolean,
          default:false,
        },
        menuOfLine:{ //Say if the context menu is the one of a stickyline
          type:  Boolean,
          default: false,
        },
        menuOfGroupedShape:{ //Say if the context menu is the one of an attached shape
          type:  Boolean,
          default: false,
        },
        needCopyButton:{ //Say if we need the copy button
          type:  Boolean,
          default: true,
        },
        needPastButton:{ //Say if we need the past button
          type:  Boolean,
          default: true,
        },
        needCopyAllButton:{ //Say if we need the copy All button
          type:  Boolean,
          default: true,
        },
        needSwitchDistributionModeButton:{ //Say if we need the "switch distribution mode" button
          type:  Boolean,
          default: true,
        },
        keepDistanceButtonText: { //text of the "switch distribution mode" button
          type: String,
          default: "Keep Distribution"
        }
    },
    
    data(){
        return{
            dM: this.displayMenu,
            cS: "${this.ConcernedShape.className} ==='Line'",
        }
    },
    
    
    methods:{
        GenerateButtonEvent(e){
          if(e.target.id=="ChangeCenter"){
            this.$emit('changecenter-button',this.ConcernedShape);
          }
          if(e.target.id=="DetachShape"){
            this.$emit('detachshape-button',this.ConcernedShape);
          }
          if(e.target.id=="KeepDistance"){
            this.$emit('keepdistance-button',this.ConcernedShape);
          }
          if(e.target.id=="Copy"){
            this.$emit('copy-button',this.ConcernedShape);
          }
          if(e.target.id=="CopyAll"){
            this.$emit('copy-all-button',this.ConcernedShape);
          }
          if(e.target.id=="Past"){
            this.$emit('past-button',this.CopiedShape);
          }
          if(e.target.id=="Remove"){
            this.$emit('remove-button',this.ConcernedShape);
          }
          if(e.target.id=="RemoveAll"){
            this.$emit('remove-all-button',this.ConcernedShape);
          }

        }
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
        overflow-y: scroll;
        max-height:300px;
        background-color: white;
        box-shadow: 0 0 5px grey;
        border-radius: 3px;
      }

      #menu button {
        width: 100%;
        background-color: white;
        border: none;
        margin: 0;
        padding: 10px;
      }

      #menu button:hover {
        background-color: lightgray;
      }
</style>