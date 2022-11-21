<template>
<div id="basicAlignmentDemo"
@click="hideButton">
  <v-stage
  ref="stage"
  id="stage"
  :config="stageSize"

  @contextMenu="displayButton"
  >
    <v-layer ref="layer">
      <v-rect
      v-for="item in shapes.filter(i=>i.className=='Rect')"
      :key="item.id"
      :config="item"
      
      @click="selectShape"
      />
      <v-circle
        v-for="item in shapes.filter(i=>i.className=='Circle')"
        :key="item.id"
        :config="item"
        @click="selectShape"
      />
      <v-regular-polygon
        v-for="item in shapes.filter(i=>i.className=='Triangle')"
        :key="item.id"
        :config="item"
        @click="selectShape"
      />
    </v-layer>
  </v-stage>
  <div id="align_button">
    <button @click="alignSelectedShapes">Align</button>
  </div>
</div>
</template>
<script>

//drag bound func to prevent the objects from going outside the stage
const dragFunc=function (pos) {
  let width=this.getStage().width();
  let height=this.getStage().height();
  let strokeSize=10
    if(pos.x>width-strokeSize && pos.y>height-strokeSize){
      return{
        x: width-strokeSize,
        y: height-strokeSize,
      }
    } else if(pos.x>width-strokeSize && pos.y<strokeSize){
      return{
        x: width-strokeSize,
        y: strokeSize,
      }
    } else if(pos.y>height-strokeSize && pos.x<strokeSize){
      return{
        x: strokeSize,
        y: height-strokeSize,
      }
    } else if(pos.x<strokeSize && pos.y<strokeSize){
      return{
        x: strokeSize,
        y: strokeSize,
      }
    } else if(pos.x<strokeSize){
      return{
        x: strokeSize,
        y: pos.y,
      }
    }else if(pos.y<strokeSize){
      return{
        x: pos.x,
        y: strokeSize,
      }
    }else if(pos.x>width-strokeSize){
      return{
        x: width-strokeSize,
        y: pos.y,
      }
    }else if(pos.y>height-strokeSize){
      return{
        x: pos.x,
        y: height-strokeSize,
      }
    } else{
      return {
        x: pos.x,
        y: pos.y,
      };
    }
};
export default {
   props:{
        width:{
          type: Number,
          default:window.innerWidth,
        },
        height:{
          type: Number,
          default:window.innerHeight,
        }
    },
    data() {
    return {
      align_pos:null, // position where selected shapes will be aligned (regading y-axis)
      stageSize: {
        width: this.width,
        height: this.height,
      },
      shapes:[
        {
          rotation: 0,
          id:'2',
          x: 220,
          y: 250,
          width: 70,
          height: 70,
          scaleX: 1,
          scaleY: 1,
          strokeWidth: 0,
          stroke: 'red',
          fill: 'green',
          name: 'rect2',
          draggable: true,
          className:"Rect",
          isGrouped: 0,
          dragBoundFunc: dragFunc,
          offsetX: 70/2,
          offsetY: 70,
          /*When it is on a line, a shape can be rotate by the user independently from the line.
          To keep the independant rotation of the attached shape, we add the parameter "personalRotation".
          So, when the shape is attached, is final rotation is the sum of this parameter with the rotation of the line.
          */
          personalRotation:0, 
          centerPosition:'Bottom',
        },
        {
          rotation:0,
          x: 50,
          y: 100,
          scaleX:1,
          scaleY:1,
          offsetX: 0,
          offsetY: 40,
          radius: 40,
          fill: 'orange',
          strokeWidth: 0,
          stroke: 'red',
          draggable:true,
          isGrouped: 0,
          className:"Circle",
          /*When it is on a line, a shape can be rotate by the user independently from the line.
            To keep the independant rotation of the attached shape, we add the parameter "personalRotation".
            So, when the shape is attached, is final rotation is the sum of this parameter with the rotation of the line.
            */
          personalRotation:0, 
          id:'3',
          dragBoundFunc: dragFunc,
          centerPosition:'Bottom',
        }, 
        {
          rotation: 0,
          id:'8',
          x: 400,
          y: 130,
          sides:3,
          radius:45,
          width: 90,
          height: 90,
          scaleX: 1,
          scaleY: 1,
          strokeWidth: 0,
          stroke: 'red',
          fill: 'purple',
          name: 'triangle1',
          draggable: true,
          className:"Triangle",
          isGrouped: 0,
          dragBoundFunc: dragFunc,
          offsetX: 0,
          offsetY: 22.5,
          personalRotation:0, 
          centerPosition:'Bottum',
        },],
      }
    },
    methods:{

        //Make a strock appear(select) or disappear (unselect) on the target shape
        selectShape(e){
          if(e.target.strokeWidth()==0){
            this.shapes.find((r)=>r.id==e.target.attrs.id).strokeWidth=3;
          }
          else{
            this.shapes.find((r)=>r.id==e.target.attrs.id).strokeWidth=0;
          }
        },

        // align the shapes that are selected
        alignSelectedShapes(){ 
          for(let i=0;i<this.shapes.length;i++){
            if(this.shapes[i].strokeWidth>0){
              this.shapes[i].strokeWidth=0;
              this.shapes[i].y=this.align_pos
            }
          }
        },

        //display button
        //called when right click on the stage
        displayButton(e){
          e.evt.preventDefault()
          if(e.target.attrs.id==="stage"){
            this.align_pos=e.target.getStage().getPointerPosition().y
            document.getElementById("align_button").style.display="initial";
            document.getElementById("align_button").style.top= document.getElementById("basicAlignmentDemo").getBoundingClientRect().top+document.documentElement.scrollTop+e.target.getStage().getPointerPosition().y+"px";
            document.getElementById("align_button").style.left= document.getElementById("basicAlignmentDemo").getBoundingClientRect().left+document.documentElement.scrollLeft+e.target.getStage().getPointerPosition().x+"px"; 
          }
        },

        //hide the button
        hideButton(){
          document.getElementById("align_button").style.display="none"
        }
        



        
    }
};
</script>
<style>
#basicAlignmentDemo{
  cursor: default;
}
#align_button{
  position: absolute;
  display: none;
  top: 0px;
  left: 0px;
}
</style>