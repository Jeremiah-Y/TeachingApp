<template>

<div @click="HideContextMenu" id="ReuseDemo"
 @focusin="initialNaration(this.groups)"
@focusout="this.narationHasBeenInitialized=false"
tabindex="0">
<!--
  <ToolBar :height="100" :width="400"
  @need_new_shape="createNewShape" @eraser_is_selected="switchEraseMode"></ToolBar>
  -->
  <v-stage
    ref="stage"
    id="stage"
    :config="stageSize"
    @dragmove="update"
    @mousedown="handleTransformation"
    @touchstart="handleTransformation"
    @fusion="makeGroup"
    @contextMenu="DisplayContextMenu"
  >
    <v-layer ref="layer">
      <!--
        see if a group should contain more than one line
      -->
      <!--
      <v-circle :key="center.id" :config="center"/>
      -->
      <v-group ref="groups" v-for="step in groups" :key="step.id" :config="step">
      
      
      
        <v-rect
        v-for="item in step.shapes_g.filter(i=>i.className=='Rect')"
        :key="item.id"
        :config="item"
        
       
        @transformend="updateTransformedShape"
        @dragend= "updatePosInGrp($event,step.id) "
        @dragmove="CheckIfNeedToDetach"
        @mouseenter="showSelectedShape"
        @mouseout="unshowSelectedShape"
      />
      <v-circle
        v-for="item in step.shapes_g.filter(i=>i.className=='Circle')"
        :key="item.id"
        :config="item"
        @transformend="updateTransformedShape"
        @dragend="updatePosInGrp($event,step.id)"
        @dragmove="CheckIfNeedToDetach"
        @mouseenter="showSelectedShape"
        @mouseout="unshowSelectedShape"
      />
      
      <v-image
        v-for="item in step.shapes_g.filter(i=>i.className=='Image')"
        :key="item.id"
        :config="item"
        @transformend="updateTransformedShape"
        @dragend="updatePosInGrp($event,step.id)"
        @dragmove="CheckIfNeedToDetach"
        @mouseenter="showSelectedShape"
        @mouseout="unshowSelectedShape"
      />
      <v-text
        v-for="item in step.shapes_g.filter(i=>i.className=='Text')"
        :key="item.id"
        :config="item"
        @transformend="updateTransformedShape"
        @dragend="updatePosInGrp($event,step.id)"
        @dragmove="CheckIfNeedToDetach"
        @mouseenter="showSelectedShape"
        @mouseout="unshowSelectedShape"

        @dblclick="editText"
        />
        <v-regular-polygon
        v-for="item in step.shapes_g.filter(i=>i.className=='Triangle')"
        :key="item.id"
        :config="item"
        @transformend="updateTransformedShape"
        @dragend="updatePosInGrp($event,step.id)"
        @dragmove="CheckIfNeedToDetach"
        @mouseenter="showSelectedShape"
        @mouseout="unshowSelectedShape"
      />
        <v-line 
        :key="step.line.id"
        :config="step.line"
        @transformend="updateTransformedShape"
        @dragmove="updateGrp($event,step.id)"
        @mouseout="unshowSelectedShape"
        @mouseenter="showSelectedShape"
        />
    <v-circle
        v-for="item in step.line.positionPoints"
        :key="item.id"
        :config="item"
        
        @mouseenter="showSelectedShape"
        @mouseout="unshowSelectedShape"
      />
      </v-group>
      <v-rect
        v-for="item in shapes.filter(i=>i.className=='Rect')"
        :key="item.id"
        :config="item"
        @transformend="updateTransformedShape"
        @dragmove="updatePos"
        @mouseenter="showSelectedShape"
        @mouseout="unshowSelectedShape"
        
      />
      
      <v-circle
        v-for="item in shapes.filter(i=>i.className=='Circle')"
        :key="item.id"
        :config="item"
        @transformend="updateTransformedShape"
        @dragmove="updatePos"
        @mouseenter="showSelectedShape"
        @mouseout="unshowSelectedShape"
        
      />
      <!--
      <v-image
        v-for="item in shapes.filter(i=>i.className=='Image')"
        :key="item.id"
        :config="item"
        @transformend="updateTransformedShape"
        @dragmove="updatePos"
        @mouseenter="showSelectedShape"
        @mouseout="unshowSelectedShape"
        />
     
      <v-text
        v-for="item in shapes.filter(i=>i.className=='Text')"
        :key="item.id"
        :config="item"
        @transformend="updateTransformedShape"
        @dragmove="updatePos"
        @mouseenter="showSelectedShape"
        @mouseout="unshowSelectedShape"
        
        @dblclick="editText"
        /> 
      -->
      <v-regular-polygon
        v-for="item in shapes.filter(i=>i.className=='Triangle')"
        :key="item.id"
        :config="item"
        @transformend="updateTransformedShape"
        @dragmove="updatePos"
        @mouseenter="showSelectedShape"
        @mouseout="unshowSelectedShape"
        />
      
      
      <v-transformer  v-for="item in transformers" :key="item.id" :config="item"/>
      <v-circle :key="center.id" :config="center"
      @dragend="ChangeCenter"
      @click="DisplayCenterMenu"/>
      <!--
      <v-transformer id="shapeTransformer"/>
      <v-transformer id="lineTransformer" :config="{enabledAnchors: ['middle-left', 'middle-right'],}" />
      -->
    </v-layer>
    
  </v-stage>
  
  
  <div id="activeReuse"
  @focusout="stopInitialisation"
  tabindex="1">
  <ContextMenu :menu-of-stage="isStageOnlySelected" :menu-of-line=isALineSelected 
  :menu-of-grouped-shape=isAGroupedShapeSelected :keep-distance-button-text="this.keepDistanceButtonText" :need-switch-distribution-mode-button="false"
  :need-copy-all-button="false"

 
  @changecenter-button="ChangeCenterButtonAction" @detachshape-button="DetachShapeButtonAction" @keepdistance-button="KeepDistribution"
  @copy-button="Copy" @copy-all-button="CopyAll" @past-button="Past" @remove-button="Remove" @remove-all-button="RemoveAll"></ContextMenu>
  </div>
  <!--
  <div id="center_menu">
  <CenterMenu :defaultAlignment="this.selectedShapeAlignment" @center-button="ChangeAlignCenter"></CenterMenu>
  </div>
  -->
  </div>
</template>

<script>

import ContextMenu from "@/components/interactive-components-for-canvas/ContextMenu.vue"
//import CenterMenu from "./CenterMenu.vue"
//import ToolBar from "./ToolBar.vue";

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
  components:{
    ContextMenu,
    //CenterMenu,
    //ToolBar,
},
  data() {
    return {
      stageSize: {
        width: this.width,
        height: this.height,
      },
      narationHasBeenInitialized:false, //to know if the naration has to be initialized or not

      lengthToCapture:10,
      lengthToDetach:15,
      editedText:null,

      eraseMode:0,

      selectedShapeAlignment:'',
      
      needMenu: 'initial', //say if the context menu has to be "active" or not.
      isALineSelected:false, 
      isAGroupedShapeSelected:false,
      isStageOnlySelected: false,
      //dragItemId: null, //id of the item which is dragging.
      //text which will appear on the button corresponding to the management of the distribution
      keepDistanceButtonText:"Liberate Distribution",
      max_id_figures: 6, //max among id of shapes and line since the canvas exist (line excluded) 
      //max_id_lines: 2, //max among id of lines since the canvas exist (line excluded) 
      //groups of shapes (ie a line with shapes on it)
      groups:[{
        //rotation: 20,
        name: "group",
        className: "Group",
        id: '1',
        x:0,
        y:0,
        offsetX:0,
        offsetY:0,
        rotation: 0,
        draggable: false,
        shapes_g:[ {
        rotation:0,
        x: 20,
        y: 320,
        scaleX:1,
        scaleY:1,
        offsetX: 0,
        offsetY: 40,
        radius: 40,
        fill: 'orange',
        strokeWidth: 0,
        stroke: 'black',
        draggable:true,
        isGrouped: 1,
        className:"Circle",
        /*When it is on a line, a shape can be rotate by the user independently from the line.
          To keep the independant rotation of the attached shape, we add the parameter "personalRotation".
          So, when the shape is attached, is final rotation is the sum of this parameter with the rotation of the line.
          */
        personalRotation:0, 
        id:'2',
        dragBoundFunc: dragFunc,
        centerPosition:'Bottom',
      },
        {
        rotation:0,
        x: 110,
        y: 320,
        scaleX:1,
        scaleY:1,
        offsetX: 0,
        offsetY: 40,
        radius: 40,
        fill: 'orange',
        strokeWidth: 0,
        stroke: 'black',
        draggable:true,
        isGrouped: 1,
        className:"Circle",
        /*When it is on a line, a shape can be rotate by the user independently from the line.
          To keep the independant rotation of the attached shape, we add the parameter "personalRotation".
          So, when the shape is attached, is final rotation is the sum of this parameter with the rotation of the line.
          */
        personalRotation:0, 
        id:'3',
        dragBoundFunc: dragFunc,
        centerPosition:'Bottom',
      },{
        rotation:0,
        x: 200,
        y: 320,
        scaleX:1,
        scaleY:1,
        offsetX: 0,
        offsetY: 40,
        radius: 40,
        fill: 'orange',
        strokeWidth: 0,
        stroke: 'black',
        draggable:true,
        isGrouped: 1,
        className:"Circle",
        /*When it is on a line, a shape can be rotate by the user independently from the line.
          To keep the independant rotation of the attached shape, we add the parameter "personalRotation".
          So, when the shape is attached, is final rotation is the sum of this parameter with the rotation of the line.
          */
        personalRotation:0, 
        id:'4',
        dragBoundFunc: dragFunc,
        centerPosition:'Bottom',
      }], //list of shapes that are on the line
        //the line of the group:
        aShapeHasBeenDetach:0,
        line:{
          x:150,
          y:250,
          points: [0, 0, 0, 0, 250, 0],
          positionPoints:[{
        x: 300,
        y: 500,
        scaleX:1,
        scaleY:1,
        offsetX: 0,
        offsetY: 0,
        radius: 3,
        fill: 'yellow',
        opacity:1,
        draggable:false,
        isGrouped: 0,
        className:"positionPoint",
        id:'positionPoint1',
        distance_to_line_center:undefined,
      },{
        x: 300,
        y: 500,
        scaleX:1,
        scaleY:1,
        offsetX: 0,
        offsetY: 0,
        radius: 3,
        fill: 'yellow',
        opacity:1,
        draggable:false,
        isGrouped: 0,
        className:"positionPoint",
        id:'positionPoint2',
        distance_to_line_center:undefined,
      },{
        x: 300,
        y: 500,
        scaleX:1,
        scaleY:1,
        offsetX: 0,
        offsetY: 0,
        radius: 3,
        fill: 'yellow',
        opacity:1,
        draggable:false,
        isGrouped: 0,
        className:"positionPoint",
        id:'positionPoint3',
        distance_to_line_center:undefined,
      },],
          strokeWidth: 10,
          rotation: 0,
          tension:0,
          closed: true,
          draggable: true,
          scaleX:1,
          scaleY:1,
          opacity:0.5,
          offset:{
            x:125,
            y:0,
          },
          name: "ligne",
          className: "Line",
          stroke: 'blue',
          id:'1',
          //distShapesToCenter:[],
          keepDistribution: false, //say of we keep the distribution on the line or not
          freeDistances:[], // distance that can be taken by other shapes (if we keep distribution on the line).
          occupiedDistances:[-95,-25,80], //distance already "taken" by shapes on the line.       
          //text which will appear on the button corresponding to the management of the distribution:
          keepDistanceButtonText:"Liberate Distribution",
          //function which determine how the line can be dragged:
          defaultAlignment:"Bottom",
          dragBoundFunc: dragFunc,
        },
      },
      /*{
        name: "group2",
        className: "Group",
        id: '7',
        x:0,
        y:0,
        offsetX:0,
        offsetY:0,
        rotation: 0,
        draggable: false,
        shapes_g:[],
        line:{
        x:500,
        y:300,
        points: [0, 0, 0, 0, 300, 0],
        positionPoints:[],
        strokeWidth: 10,
        rotation: 0,
        tension:0,
        closed: true,
        draggable: true,
        scaleX:1,
        scaleY:1,
        opacity:0.5,
        offset:{
          x:150,
          y:0,
        },
        //draggable:true,
        name: "ligne",
        className: "Line",
        stroke: 'black',
        id:'7',
        distShapesToCenter:[],
        keepDistribution: true,
        freeDistances:[],
        occupiedDistances:[],
        keepDistanceButtonText:"Liberate Distribution",
        defaultAlignment:"Middle",
        dragBoundFunc: dragFunc,
      },
      
      }*/
      ],
      transformers:[
        {
          id: 'lineTransformer',
          enabledAnchors: [],
          rotateEnabled: false,
          borderEnabled:false,
          flipEnabled: false, // in order to not have a rotation of the transformer which lead to problem related to shapes position on a line
          nodes: [],

        },
        {
          id: 'shapeTransformer',
          nodes: [],
        }
      ],
      shapes: [
        /*
        {
          rotation: 0,
          id: '1',
          x: 100,
          y: 10,
          width: 130,
          height: 100,
          scaleX: 1,
          scaleY: 1,
          strokeWidth: 0,
          stroke: 'black',
          fill: 'red',
          name: 'rect1',
          draggable: true,
          className:"Rect",
          isGrouped: 0, //if =0 the shape is not attached to a stickyline. if=1, it does.
          offsetX:130/2,
          offsetY:0,
          personalRotation:0, 
          centerPosition:'Top',
          dragBoundFunc: dragFunc
          
        },
        */
        
        {
          rotation: 0,
          id:'5',
          x: 150,
          y: 120,
          sides:3,
          radius:45,
          width: 90,
          height: 90,
          scaleX: 1,
          scaleY: 1,
          strokeWidth: 0,
          stroke: 'black',
          fill: 'purple',
          name: 'triangle1',
          draggable: true,
          className:"Triangle",
          isGrouped: 0,
          dragBoundFunc: dragFunc,
          offsetX: 0,
          offsetY: 22.5,
          personalRotation:0, 
          centerPosition:'Bottom',
        },
      {
          rotation: 0,
          id:'6',
          x: 50,
          y: 70,
          sides:3,
          radius:45,
          width: 90,
          height: 90,
          scaleX: 1,
          scaleY: 1,
          strokeWidth: 0,
          stroke: 'black',
          fill: 'purple',
          name: 'triangle1',
          draggable: true,
          className:"Triangle",
          isGrouped: 0,
          dragBoundFunc: dragFunc,
          offsetX: 0,
          offsetY: 22.5,
          personalRotation:0, 
          centerPosition:'Bottom',
        },
      /*
        {
            text: 'A text',
            rotation: 0,
            x: 400,
            y: 200,           
            scaleX:1,
            scaleY:1,
            offsetY:0,
            offsetX: 36,
            length_x:72,
            length_y:30,
            draggable: true,
            isGrouped: 0,
            className:"Text",    
            fontSize: 30,
            fontFamily: 'Calibri',
          personalRotation:0,
            id:'4',
            dragBoundFunc:dragFunc,
            centerPosition:'Top',
        },
        {
            rotation: 0,
            x: 700,
            y: 400,           
            scaleX:1,
            scaleY:1,
            offsetY:0,
            offsetX:0,
            //width:72,
            //height:30,
            image: null,
            draggable: true,
            isGrouped: 0,
            className:"Image", 
               
            fontSize: 30,
          personalRotation:0, 
            id:'5',
            dragBoundFunc:dragFunc,
            centerPosition:'Top',
        },
        */
         {
          rotation: 0,
          id:'7',
          x: 250,
          y: 100,
          sides:3,
          radius:45,
          width: 90,
          height: 90,
          scaleX: 1,
          scaleY: 1,
          strokeWidth: 0,
          stroke: 'black',
          fill: 'purple',
          name: 'triangle1',
          draggable: true,
          className:"Triangle",
          isGrouped: 0,
          dragBoundFunc: dragFunc,
          offsetX: 0,
          offsetY: 22.5,
          personalRotation:0, 
          centerPosition:'Bottom',
        },
      ],
      center:{
        x: 300,
        y: 500,
        scaleX:1,
        scaleY:1,
        offsetX: 0,
        offsetY: 0,
        radius: 4,
        fill: 'black',
        opacity:1,
        draggable:true,
        isGrouped: 0,
        className:"Circle",
        id:'center',
        dragBoundFunc:dragFunc,
      },
      positionPoint:{
        x: 300,
        y: 500,
        scaleX:1,
        scaleY:1,
        offsetX: 0,
        offsetY: 0,
        radius: 3,
        fill: 'yellow',
        opacity:1,
        draggable:false,
        isGrouped: 0,
        className:"positionPoint",
        id:'positionPoint',
        distance_to_line_center:undefined,
      },
      selectedShapeId: '',
    };
  },
  mounted(){
    let texts=this.$refs.stage.getStage().getChildren()[0].getChildren().filter((r)=>r.attrs.className=='Text');
    
    
    for(let i=0;i<texts.length;i++){
      texts[i].attrs.length_x=texts[i].width();
      texts[i].attrs.length_y=texts[i].height();
      texts[i].offsetX(texts[i].attrs.length_x/2);
    }
    let grp=this.groups[0];
    let line=grp.line;
    let shapes_g=grp.shapes_g;
    for(let i=0;i<shapes_g.length;i++){
      this.updateDragFunc(shapes_g[i],line);
      
      this.updateAllPosInGrp(grp.id);
    }
  },
  created(){
    //nb of shapes on the canvas (line excluded), we consider that there is no shape on line:
    this.max_id_figures=this.shapes.length +this.groups.length;
    for(let i=0;i<this.groups.length;i++){
      this.max_id_figures= this.max_id_figures+this.groups[i].shapes_g.length;
    }
    //this.max_id_lines=this.groups.length;
    /*
    const image = new window.Image();
    image.src = require("@/assets/exsitu.png");
    // set image only when it is loaded
    image.height=150;
    image.width=150;
    image.onload = () => {
      this.shapes.find((r)=>r.className==="Image").image= image;
      this.shapes.find((r)=>r.className==="Image").offsetX=image.width/2;
      this.shapes.find((r)=>r.className==="Image").offsetY=0; 
    };
    */
  },
  methods: {
    //this function is here to avoid the execution of the function initialNaration.
    

    switchEraseMode(){
      if(this.eraseMode==0){
        this.eraseMode=1;
        document.getElementById("playground").style.cursor='url('+require('@/assets/ugly_eraser.png')+'),default';
        
      this.eraseNodefromTransformer("shapeTransformer");
      this.eraseNodefromTransformer("lineTransformer");
      } else{
        this.eraseMode=0;
        document.getElementById("playground").style.cursor="default";
      }
    },
    /*
    Check if all shapes that are supposed to be on a line still in this line.
    id_grp is the id of the group which contains the line.
    */
    checkIfShapesOnLine(id_grp){
      const grp= this.groups.find((r) => r.id===id_grp);
      const line=grp.line;
      const groupedShapes = grp.shapes_g;
      //const lengthToDetach=10;
      
      /*
      To determine if a shape is on a line, we see if the point is not on the corresponding
      straight line y=a*x+b regarding certains intervals for x and y.Those intervals depends of the rotation of
      the line. 
      */
     /*
      let coord_y1=line.y-line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180));
      let coord_x1=line.x+line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180));
      let coord_y2= line.y+line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180));
      let coord_x2=line.x-line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180));
      let a=(coord_y1-coord_y2)/(coord_x2-coord_x1);
      let b=line.y-a*line.x;
      let is_on_straight_line=false;
      */
      
      let i=0;
      while(i<groupedShapes.length){
        /*
        if(Math.abs(coord_x1-coord_x2)>1){
        is_on_straight_line=(Math.abs(a*groupedShapes[i].x+b-groupedShapes[i].y)<this.lengthToDetach);
      }else{
        is_on_straight_line=(Math.abs(groupedShapes[i].x-line.x)<this.lengthToDetach);
      }
        if (
          !(is_on_straight_line)
        ||((line.y-line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180))+this.lengthToDetach<groupedShapes[i].y
        ||line.y+line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180))-this.lengthToDetach>groupedShapes[i].y)
        && ((line.rotation*(Math.PI/180)<=0 && line.rotation*(Math.PI/180)>-Math.PI/2)))

        ||((line.x+line.points[4]*line.scaleX*(1/2)*Math.cos(line.rotation*(Math.PI/180))+this.lengthToDetach<groupedShapes[i].x
        ||line.x-line.points[4]*line.scaleX*(1/2)*Math.cos(line.rotation*(Math.PI/180))-this.lengthToDetach>groupedShapes[i].x)
        &&((line.rotation*(Math.PI/180)<=0 && line.rotation*(Math.PI/180)>-Math.PI/2)))

        ||((line.y+line.points[4]*line.scaleX*(1/2)*Math.sin(Math.PI+line.rotation*(Math.PI/180))+this.lengthToDetach<groupedShapes[i].y
        ||line.y-line.points[4]*line.scaleX*(1/2)*Math.sin(Math.PI+line.rotation*(Math.PI/180))-this.lengthToDetach>groupedShapes[i].y)
        &&((line.rotation*(Math.PI/180)<=-Math.PI/2 && line.rotation*(Math.PI/180)>=-Math.PI)))

        ||((line.x+line.points[4]*line.scaleX*(1/2)*Math.cos(Math.PI+line.rotation*(Math.PI/180))+this.lengthToDetach<groupedShapes[i].x
        ||line.x-line.points[4]*line.scaleX*(1/2)*Math.cos(Math.PI+line.rotation*(Math.PI/180))-this.lengthToDetach>groupedShapes[i].x)
        &&((line.rotation*(Math.PI/180)<=-Math.PI/2 && line.rotation*(Math.PI/180)>=-Math.PI)))

        ||((line.y+line.points[4]*line.scaleX*(1/2)*Math.sin(Math.PI-line.rotation*(Math.PI/180))+this.lengthToDetach<groupedShapes[i].y
        ||line.y-line.points[4]*line.scaleX*(1/2)*Math.sin(Math.PI-line.rotation*(Math.PI/180))-this.lengthToDetach>groupedShapes[i].y)
        &&((line.rotation*(Math.PI/180)<=Math.PI && line.rotation*(Math.PI/180)>Math.PI/2)))

        ||((line.x+line.points[4]*line.scaleX*(1/2)*Math.cos(Math.PI-line.rotation*(Math.PI/180))+this.lengthToDetach<groupedShapes[i].x
        ||line.x-line.points[4]*line.scaleX*(1/2)*Math.cos(Math.PI-line.rotation*(Math.PI/180))-this.lengthToDetach>groupedShapes[i].x)
        &&((line.rotation*(Math.PI/180)<=Math.PI && line.rotation*(Math.PI/180)>Math.PI/2)))

        ||((line.y+line.points[4]*line.scaleX*(1/2)*Math.sin(line.rotation*(Math.PI/180))+this.lengthToDetach<groupedShapes[i].y
        ||line.y-line.points[4]*line.scaleX*(1/2)*Math.sin(line.rotation*(Math.PI/180))-this.lengthToDetach>groupedShapes[i].y)
        &&((line.rotation*(Math.PI/180)<=Math.PI/2 && line.rotation*(Math.PI/180)>0)))

        ||((line.x+line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180))+this.lengthToDetach<groupedShapes[i].x
        ||line.x-line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180))-this.lengthToDetach>groupedShapes[i].x)
        &&((line.rotation*(Math.PI/180)<=Math.PI/2 && line.rotation*(Math.PI/180)>0)))
        )
        */
       if(!this.isCoordinateOnLine(groupedShapes[i].x,groupedShapes[i].y,line.id)){
          console.log("a shape is not on a line");
          groupedShapes[i].dragBoundFunc= dragFunc;
          groupedShapes[i].isGrouped=0;
          if(line.keepDistribution){
            line.positionPoints.slice(i,1)
          }
          this.shapes.push(groupedShapes[i],)
          line.freeDistances.push(line.occupiedDistances[i]);
          line.occupiedDistances.splice(i,1);
          groupedShapes.splice(i,1);
          
          this.updateNaration(grp)
        }else{
          i=i+1;
        }
      }
    },

    //say of {x,y} is a point from the line
    isCoordinateOnLine(x,y,id_grp){
      const grp=this.groups.find((r) => r.id===id_grp);
      const line=grp.line;
      let is_not_on_straight_line=true;
      let coord_y1=line.y-line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180));
      let coord_x1=line.x+line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180));
      let coord_y2= line.y+line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180));
      let coord_x2=line.x-line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180));
      let a=(coord_y1-coord_y2)/(coord_x2-coord_x1);
      let b=line.y-a*line.x;
      if(Math.abs(coord_x1-coord_x2)>1){
        is_not_on_straight_line=(Math.abs(a*x+b-y)>1);
      }else{
        is_not_on_straight_line=(Math.abs(x-line.x)>1)
      }
      if(
        (is_not_on_straight_line)

      ||((line.y-line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180))+this.lengthToDetach<y
      ||line.y+line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180))-this.lengthToDetach>y)
      && ((line.rotation*(Math.PI/180)<=0 && line.rotation*(Math.PI/180)>-Math.PI/2)))

      ||((line.x+line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180))+this.lengthToDetach<x
        ||line.x-line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180))-this.lengthToDetach>x)
      &&((line.rotation*(Math.PI/180)<=0 && line.rotation*(Math.PI/180)>-Math.PI/2)))

      ||((line.y+line.points[4]*(1/2)*line.scaleX*Math.sin(Math.PI+line.rotation*(Math.PI/180))+this.lengthToDetach<y
        ||line.y-line.points[4]*(1/2)*line.scaleX*Math.sin(Math.PI+line.rotation*(Math.PI/180))-this.lengthToDetach>y)
      &&((line.rotation*(Math.PI/180)<=-Math.PI/2 && line.rotation*(Math.PI/180)>-Math.PI)))

      ||((line.x+line.points[4]*(1/2)*line.scaleX*Math.cos(Math.PI+line.rotation*(Math.PI/180))+this.lengthToDetach<x
      ||line.x-line.points[4]*(1/2)*line.scaleX*Math.cos(Math.PI+line.rotation*(Math.PI/180))-this.lengthToDetach>x)
      &&((line.rotation*(Math.PI/180)<=-Math.PI/2 && line.rotation*(Math.PI/180)>-Math.PI)))

      ||((line.y+line.points[4]*(1/2)*line.scaleX*Math.sin(Math.PI-line.rotation*(Math.PI/180))+this.lengthToDetach<y
      ||line.y-line.points[4]*(1/2)*line.scaleX*Math.sin(Math.PI-line.rotation*(Math.PI/180))-this.lengthToDetach>y)
      &&((line.rotation*(Math.PI/180)<=Math.PI && line.rotation*(Math.PI/180)>Math.PI/2)))

      ||((line.x+line.points[4]*(1/2)*line.scaleX*Math.cos(Math.PI-line.rotation*(Math.PI/180))+this.lengthToDetach<x
      ||line.x-line.points[4]*(1/2)*line.scaleX*Math.cos(Math.PI-line.rotation*(Math.PI/180))-this.lengthToDetach>x)
      &&((line.rotation*(Math.PI/180)<=Math.PI && line.rotation*(Math.PI/180)>Math.PI/2)))

      ||((line.y+line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180))+this.lengthToDetach<y
      ||line.y-line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180))-this.lengthToDetach>y)
      &&((line.rotation*(Math.PI/180)<=Math.PI/2 && line.rotation*(Math.PI/180)>=0)))

      ||((line.x+line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180))+this.lengthToDetach<x
      ||line.x-line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180))-this.lengthToDetach>x)
      &&((line.rotation*(Math.PI/180)<=Math.PI/2 && line.rotation*(Math.PI/180)>=0)))

      ||(!is_not_on_straight_line && Math.sqrt((line.x-x)**2+(line.y-y)**2)>line.points[4]*line.scaleX/2)

      )
      {
        return false; 
      } else{
        return true;
      }
    },

    //update a group with the id id_grp
    updateGrp(e,id_grp){
      const grep=this.groups.find((r)=>r.id===id_grp);
      const line= grep.line;
      grep.offsetX=line.offsetX;
      grep.offsetY=line.offsetY;
      
      line.x=e.target.x();
      line.y=e.target.y();
      this.center.x=line.x;
      this.center.y=line.y;
      /*
      if(line.keepDistribution){
        this.updateOccupiedDistance(line.id);
      }
      */
      this.updateAllPosInGrp(line.id); 
      this.checkIfShapesOnLine(line.id);
    },


    //update the position of all shapes that are on the line of the group with the id id_grp.
    updateAllPosInGrp(id_grp){
      const grp= this.groups.find((r) => r.id===id_grp);     
      const line= grp.line;
      const shapes_g = grp.shapes_g;
      for (let i=0;i<shapes_g.length;i++){
          if(line.keepDistribution){
            shapes_g[i].x=line.x+line.occupiedDistances[i]*Math.cos(line.rotation*(Math.PI/180));
            shapes_g[i].y=line.y+line.occupiedDistances[i]*Math.sin(line.rotation*(Math.PI/180));
            shapes_g[i].distance_to_line_center=line.occupiedDistances[i];
            shapes_g[i].rotation=shapes_g[i].personalRotation+line.rotation;
            
          } else{
            shapes_g[i].x=line.x+line.occupiedDistances[i]*Math.cos(line.rotation*(Math.PI/180));
            shapes_g[i].y=line.y+line.occupiedDistances[i]*Math.sin(line.rotation*(Math.PI/180));
            shapes_g[i].distance_to_line_center=line.occupiedDistances[i];
            shapes_g[i].rotation=shapes_g[i].personalRotation+line.rotation;
          }
          line.positionPoints[i].x=shapes_g[i].x;
          line.positionPoints[i].y=shapes_g[i].y;
          line.positionPoints[i].distance_to_line_center=shapes_g[i].distance_to_line_center;
      }
      let i=shapes_g.length;
      while(i<line.positionPoints.length){
        if(line.keepDistribution){
          line.positionPoints.splice(i,1);
        }else{
        line.positionPoints[i].x=line.x+line.freeDistances[i-shapes_g.length]*Math.cos(line.rotation*(Math.PI/180));
        line.positionPoints[i].y=line.y+line.freeDistances[i-shapes_g.length]*Math.sin(line.rotation*(Math.PI/180));
        line.positionPoints[i].distance_to_line_center=line.freeDistances[i-shapes_g.length];
        i++;
        }
        
      }
    
    },
    isOutsideTheLine(shape,line){
      let coord_y1=line.y-line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180));
      let coord_x1=line.x+line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180));
      let coord_y2= line.y+line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180));
      let coord_x2=line.x-line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180));
      let a=(coord_y1-coord_y2)/(coord_x2-coord_x1);
      let b=line.y-a*line.x;
      let is_on_straight_line=false;
      if(Math.abs(coord_x1-coord_x2)>=1){
        is_on_straight_line=(Math.abs(a*shape.x+b-shape.y)<1);
      }else{
        is_on_straight_line=(Math.abs(shape.x-line.x)<1);
      }
      if(
        !(is_on_straight_line)
      ||((line.y-line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180))+this.lengthToDetach<shape.y
        ||line.y+line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180))-this.lengthToDetach>shape.y)
      && ((line.rotation*(Math.PI/180)<=0 && line.rotation*(Math.PI/180)>-Math.PI/2)))

      ||((line.x+line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180))+this.lengthToDetach<shape.x
      ||line.x-line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180))-this.lengthToDetach>shape.x)
      &&((line.rotation*(Math.PI/180)<=0 && line.rotation*(Math.PI/180)>-Math.PI/2)))

      ||((line.y+line.points[4]*(1/2)*line.scaleX*Math.sin(Math.PI+line.rotation*(Math.PI/180))+this.lengthToDetach<shape.y
      ||line.y-line.points[4]*(1/2)*line.scaleX*Math.sin(Math.PI+line.rotation*(Math.PI/180))-this.lengthToDetach>shape.y)
      &&((line.rotation*(Math.PI/180)<=-Math.PI/2 && line.rotation*(Math.PI/180)>-Math.PI)))

      ||((line.x+line.points[4]*(1/2)*line.scaleX*Math.cos(Math.PI+line.rotation*(Math.PI/180))+this.lengthToDetach<shape.x
      ||line.x-line.points[4]*(1/2)*line.scaleX*Math.cos(Math.PI+line.rotation*(Math.PI/180))-this.lengthToDetach>shape.x)
      &&((line.rotation*(Math.PI/180)<=-Math.PI/2 && line.rotation*(Math.PI/180)>-Math.PI)))

      ||((line.y+line.points[4]*(1/2)*line.scaleX*Math.sin(Math.PI-line.rotation*(Math.PI/180))+this.lengthToDetach<shape.y
      ||line.y-line.points[4]*(1/2)*line.scaleX*Math.sin(Math.PI-line.rotation*(Math.PI/180))-this.lengthToDetach>shape.y)
      &&((line.rotation*(Math.PI/180)<=Math.PI && line.rotation*(Math.PI/180)>Math.PI/2)))

      ||((line.x+line.points[4]*(1/2)*line.scaleX*Math.cos(Math.PI-line.rotation*(Math.PI/180))+this.lengthToDetach<shape.x
      ||line.x-line.points[4]*(1/2)*line.scaleX*Math.cos(Math.PI-line.rotation*(Math.PI/180))-this.lengthToDetach>shape.x)
      &&((line.rotation*(Math.PI/180)<=Math.PI && line.rotation*(Math.PI/180)>Math.PI/2)))

      ||((line.y+line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180))+this.lengthToDetach<shape.y
      ||line.y-line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180))-this.lengthToDetach>shape.y)
      &&((line.rotation*(Math.PI/180)<=Math.PI/2 && line.rotation*(Math.PI/180)>=0)))

      ||((line.x+line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180))+this.lengthToDetach<shape.x
      ||line.x-line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180))-this.lengthToDetach>shape.x)
      &&((line.rotation*(Math.PI/180)<=Math.PI/2 && line.rotation*(Math.PI/180)>=0)))
      ){
        return true;
      }else{ return false}
    },
    
    //update the canvas
    update(){
      const shapes = this.shapes
      
      //const lengthToCapture=10; //bigger is the number, bigger is the intervals of x and y where a shape can be added to a line.
      let is_on_straight_line=false;
      for (let i=0;i<shapes.length;i++){
        let x=shapes[i].x;
        let y=shapes[i].y;
      for (let j=0;j<this.groups.length;j++){
      
        let line=this.groups[j].line;

        
        let coord_y1=line.y-line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180));
        let coord_x1=line.x+line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180));
        let coord_y2= line.y+line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180));
        let coord_x2=line.x-line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180));
        let a=(coord_y1-coord_y2)/(coord_x2-coord_x1);
        let b=line.y-a*line.x;
        if(Math.abs(coord_x1-coord_x2)>1){
          is_on_straight_line=(Math.abs(a*x+b-y)<=this.lengthToCapture);
        }else{
          is_on_straight_line=(Math.abs(x-line.x)<=this.lengthToCapture);
          //is_on_straight_line=true;
        }
        if(
        (
          is_on_straight_line
      &&(line.y-line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180))+this.lengthToCapture>=y
      && line.y+line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180))-this.lengthToCapture<=y)
      &&(line.x+line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180))+this.lengthToCapture>=x
      && line.x-line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180))-this.lengthToCapture<=x)
      &&(line.rotation*(Math.PI/180)<=0 
      && line.rotation*(Math.PI/180)>-Math.PI/2))

      ||(
        is_on_straight_line
      &&(line.y+line.points[4]*(1/2)*line.scaleX*Math.sin(Math.PI+line.rotation*(Math.PI/180))+this.lengthToCapture>=y
      && line.y-line.points[4]*(1/2)*line.scaleX*Math.sin(Math.PI+line.rotation*(Math.PI/180))-this.lengthToCapture<=y) 
      &&(line.x+line.points[4]*(1/2)*line.scaleX*Math.cos(Math.PI+line.rotation*(Math.PI/180))+this.lengthToCapture>=x
      && line.x-line.points[4]*(1/2)*line.scaleX*Math.cos(Math.PI+line.rotation*(Math.PI/180))-this.lengthToCapture<=x)
      &&(line.rotation*(Math.PI/180)<=-Math.PI/2 
      && line.rotation*(Math.PI/180)>=-Math.PI))

      ||(
        is_on_straight_line
      &&(line.y+line.points[4]*(1/2)*line.scaleX*Math.sin(Math.PI-line.rotation*(Math.PI/180))+this.lengthToCapture>=y
      &&line.y-line.points[4]*(1/2)*line.scaleX*Math.sin(Math.PI-line.rotation*(Math.PI/180))-this.lengthToCapture<=y)
      &&(line.x+line.points[4]*(1/2)*line.scaleX*Math.cos(Math.PI-line.rotation*(Math.PI/180))+this.lengthToCapture>=x
      && line.x-line.points[4]*(1/2)*line.scaleX*Math.cos(Math.PI-line.rotation*(Math.PI/180))-this.lengthToCapture<=x)
      &&(line.rotation*(Math.PI/180)<=Math.PI 
      && line.rotation*(Math.PI/180)>Math.PI/2))

      ||(
        is_on_straight_line
      &&(line.y+line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180))+this.lengthToCapture>=y
      && line.y-line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180))-this.lengthToCapture<=y)
      &&(line.x+line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180))+this.lengthToCapture>=x
      && line.x-line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180))-this.lengthToCapture<=x)
      &&(line.rotation*(Math.PI/180)<=Math.PI/2
      && line.rotation*(Math.PI/180)>=0))
      )
       {
          shapes[i].isGrouped=1;
          this.makeGroup(line.id);
          
        }
      }
      }
    },

    CheckIfNeedToDetach(e){
      let grp=this.groups.find((r)=>r.id===e.target.getParent().attrs.id);
      let shape= grp.shapes_g.find((r)=>r.id==e.target.id());
      let dist=Math.sqrt((e.target.getStage().getPointerPosition().y-e.target.y())**2+(e.target.getStage().getPointerPosition().x-e.target.x())**2);
      if(e.target.className=="Rect"){
        dist-=e.target.attrs.height*e.target.attrs.scaleY;
      } else if(e.target.className=="Circle"){
        dist-=(2*e.target.attrs.radius)*e.target.attrs.scaleY;
      } else if(e.target.className=="Text"){
        dist-=e.target.attrs.length_y*e.target.attrs.scaleY;
      } else if(e.target.className=="Image"){
        dist-=e.target.height()*e.target.scaleY();
      } else if(e.target.attrs.className=="Triangle"){
        dist-=e.target.height()*e.target.scaleY();
      } 
      
      if (dist>50){
        //let shape= this.groups.find((r)=>r.id===e.target.getParent().attrs.id).shapes_g.find((r)=>r.id==e.target.id());
        //this.groups.find((r)=>r.id===e.target.getParent().attrs.id).shapes_g.find((r)=>r.id==e.target.id()).needToBeDetach=1;
        /*
        shape.dragBoundFunc= function (pos) {
              return {
                x: pos.x,
                y: pos.y,
              };
        }
        */
        //shape.x=e.target.getStage().getPointerPosition().x;
        //shape.y=e.target.getStage().getPointerPosition().y;
        //if (Math.abs(e.target.getStage().getPointerPosition().y-e.target.y())>220){
        
        //shape.x=e.target.getStage().getPointerPosition().x;
        //shape.y=e.target.getStage().getPointerPosition().y;
        this.groups.find((r)=>r.id===e.target.getParent().attrs.id).aShapeHasBeenDetach=1;
        this.DetachShape(shape,e.target.getStage().getPointerPosition().x,e.target.getStage().getPointerPosition().y);
        //}
        
        
        
      }
    },

    //Give the sign of the distance of shape from the center of a line.
    GiveSignOfDistance(shape,line){
      let result;
      let angle=line.rotation*(Math.PI/180);
      let distX=shape.x-line.x;
      let distY=shape.y-line.y;
      /*
      
      if(angle<=-Math.PI/4 || angle>=-Math.PI/2){
        result=-Math.sign(distY);
      }
      else if(angle<=-Math.PI/2 || angle>=-3*Math.PI/4){
        result=Math.sign(distY);
      }
      else if(angle<=-3*Math.PI/4 || angle>=-Math.PI){
        result=-Math.sign(distX);
      }else if(angle>=3*Math.PI/4 || angle<=Math.PI){
        result=Math.sign(distX);
      }else if(angle>=Math.PI/2 || angle<3*Math.PI/4){
        result=-Math.sign(distY);
      } else if(angle<=Math.PI/2 || angle>Math.PI/4){
        result=-Math.sign(distY);
      } else if(angle<=Math.PI/4 || angle>=0){
        result=Math.sign(distX);
      }
      */
      
      
      if(Math.abs(distX)<=this.lengthToCapture && line.rotation==-90){
        
        result=-Math.sign(distY);
      } else if (Math.abs(distX)<=this.lengthToCapture && line.rotation==90){
        result=Math.sign(distY);
      }
      else{
        result=Math.sign(distX);
      }
      if(angle<-Math.PI/2 || angle>Math.PI/2){
        result=-result;
      }
      
      return result;
    },

    //Different from the previous function bcs the straight line of the center is perdendicular to the line
    GiveSignOfDistanceBtwCenterAndShape(center,shape){
      let result;
      let angle=shape.rotation*(Math.PI/180);
      let distX=center.x-shape.x;
      let distY=center.y-shape.y;
      /*
      
      if(angle<=-Math.PI/4 || angle>=-Math.PI/2){
        result=-Math.sign(distY);
      }
      else if(angle<=-Math.PI/2 || angle>=-3*Math.PI/4){
        result=Math.sign(distY);
      }
      else if(angle<=-3*Math.PI/4 || angle>=-Math.PI){
        result=-Math.sign(distX);
      }else if(angle>=3*Math.PI/4 || angle<=Math.PI){
        result=Math.sign(distX);
      }else if(angle>=Math.PI/2 || angle<3*Math.PI/4){
        result=-Math.sign(distY);
      } else if(angle<=Math.PI/2 || angle>Math.PI/4){
        result=-Math.sign(distY);
      } else if(angle<=Math.PI/4 || angle>=0){
        result=Math.sign(distX);
      }
      */
      
      
      if(Math.abs(distY)<=this.lengthToCapture && shape.rotation==-90){
        
        result=Math.sign(distX);
      } else if (Math.abs(distY)<=this.lengthToCapture && shape.rotation==90){
        result=-Math.sign(distX);
      }
      else{
        result=Math.sign(distY);
      }
      if(angle<-Math.PI/2 || angle>Math.PI/2){
        result=-result;
      }
      
      return result;
    },

    /*add shapes with isGrouped==1 to the group with the id id_grp.
    */
    makeGroup(id_grp){
      this.eraseNodefromTransformer("shapeTransformer");
      this.eraseNodefromTransformer("lineTransformer");
      const grp=this.groups.find((r)=> r.id===id_grp);
      const line=grp.line;
      const shapes = this.shapes;
      line.freeDistances.sort(this.isSmaller); //we will give the shortest available distance to the added shape
      shapes.sort(this.isBeforeRegardingX);
      for (let i=0;i<shapes.length;i++){
        if(shapes[i].isGrouped==1){
          const positionPoint=Object.assign({},this.positionPoint);
          let distX=shapes[i].x-line.x;
          let distY=shapes[i].y-line.y; 
          shapes[i].personalRotation=0;
          //let pot_dist=this.GiveSignOfDistance(shapes[i],line)*Math.sqrt((distX)**2+(distY)**2);
          /*
          if(line.keepDistribution && line.freeDistances.length>0){
          let distances=line.freeDistances+line.occupiedDistances;
          console.log(distances);
           let freeDistance=this.isNearest(line.freeDistances,pot_dist);
           //shapes[i].distance_to_line_center=freeDistance.res; 
           shapes[i].distance_to_line_center=this.GiveSignOfDistance(shapes[i],line)*Math.sqrt((distX)**2+(distY)**2);
            
           line.occupiedDistances.push(shapes[i].distance_to_line_center,);
           line.freeDistances.splice(freeDistance.indice,1);

          } else{
            */
            //let distX=shapes[i].x-line.x;
            //let distY=shapes[i].y-line.y;
            shapes[i].distance_to_line_center=this.GiveSignOfDistance(shapes[i],line)*Math.sqrt((distX)**2+(distY)**2);
            /*If the distance is a little bit to far from the center 
            we adjust it so that the shape can be at one of the border of the stickyline*/
            if(Math.abs(shapes[i].distance_to_line_center)>=line.points[4]*line.scaleX/2){
              shapes[i].distance_to_line_center=Math.sign(shapes[i].distance_to_line_center)*line.points[4]*line.scaleX/2
            }
            this.ChangeCenterRegardingCommand(shapes[i].id,grp.line.defaultAlignment);
            if(!line.keepDistribution && line.freeDistances.length>0){
              let indice=this.isNearest(line,shapes[i]);
              //console.log(indice);
              //shapes[i].distance_to_line_center=line.freeDistances[indice];
              //line.freeDistances.splice(indice,1);
              //shapes[i].isGrouped=0;
              this.updateDragFunc(shapes[i],line);
              grp.shapes_g.push(shapes[i],);
              grp.line.occupiedDistances.push(grp.line.freeDistances[indice]);
              grp.line.freeDistances.splice(indice,1);
              //this.updateOccupiedDistance(grp.line.id);

            }else{
              //shapes[i].isGrouped=0;
              this.updateDragFunc(shapes[i],line);
              grp.shapes_g.push(shapes[i],);
              console.log("no 'free distance' anymore")
              grp.line.occupiedDistances.push(shapes[i].distance_to_line_center,);
              positionPoint.id="positionPoint"+grp.id+grp.line.positionPoints.length;
              grp.line.positionPoints.push(positionPoint,);
              //shapes[i].distance_to_line_center=this.GiveSignOfDistance(shapes[i],line)*Math.sqrt((distX)**2+(distY)**2);
            }
            //line.occupiedDistances.push(shapes[i].distance_to_line_center,);
          //}
          console.log("A new shape has been added with a distance"+shapes[i].distance_to_line_center);
          //shapes[i].isGrouped=0;
          //this.updateDragFunc(shapes[i],line);
          //grp.shapes_g.push(shapes[i],);
          this.updateOccupiedDistance(line.id);
          
          this.updateAllPosInGrp(id_grp);
          shapes.splice(i,1);
        }
      }
      
      this.updateNaration(grp)
      this.center.x=line.x;
      this.center.y=line.y;
    },

    updateOccupiedDistance(id_grp){
      
      const grp=this.groups.find((r)=> r.id===id_grp);
      //this.updateAllPosInGrp(id_grp);
      this.sortByDistToLineCenter(grp);
      
      //let l=grp.line.points[4]/2;
      if(grp.line.keepDistribution){
      let L=grp.line.points[4];
      let nb_shapes=grp.shapes_g.length;
      let d=(L/(nb_shapes-1))*grp.line.scaleX;
      if(nb_shapes%2==0){
        
      for (let i =1;i<=nb_shapes/2-1;i++){
        //grp.line.occupiedDistances[i-1]=-(l/i);
        grp.line.occupiedDistances[i-1]=-((nb_shapes/2-1)-i+1)*d-d/2
      }
      for (let i =1;i<=nb_shapes/2-1;i++){
        grp.line.occupiedDistances[nb_shapes/2+i]=i*d+d/2;
      }
      grp.line.occupiedDistances[nb_shapes/2-1]=-d/2
      grp.line.occupiedDistances[nb_shapes/2]=d/2
      } else{
        for (let i =1;i<=(nb_shapes-1)/2;i++){
          grp.line.occupiedDistances[i-1]=-d*(((nb_shapes-1)/2)-i+1);
        }
        for (let i =1;i<=(nb_shapes-1)/2;i++){
          grp.line.occupiedDistances[((nb_shapes-1)/2)+i]=d*i;
        }
        grp.line.occupiedDistances[(nb_shapes-1)/2]=0;
      }
      
      for (let i=0;i<grp.shapes_g.length;i++){
        grp.shapes_g[i].distance_to_line_center=grp.line.occupiedDistances[i];
      }
      }
      else{
        grp.line.occupiedDistances.sort(this.isSmaller);
      }
      
      
      
    

    },

   isSmaller(a,b){
    if(a<b){
      return -1;
    }else{
      return 1
    }
   },

   isBeforeRegardingX(a,b){
    if(a.x<b.x){
      return -1;
    }else{
      return 1;
    }
   },

    
   updateOccDist(grp,shape){
    let res=this.isNearest(grp.line,shape);
    //let grp=this.groups.find((r)=>r.id===line.id);
    if(res.isFree){
      shape.distance_to_line_center=grp.line.freeDistances[res.indice];
      grp.line.freeDistances.splice(res.indice,1);
      this.sortByDistToLineCenter(grp);
      for(let l=0;l<grp.shapes_g.length;l++){
        if(grp.line.occupiedDistances.length==l){
          grp.line.occupiedDistances.push(grp.shapes_g[l].distance_to_line_center,);
        }else{
          grp.line.occupiedDistances[l]=grp.shapes_g[l].distance_to_line_center;
        }
      } 
    } else{
      grp.shapes_g.find((r)=>r.id==shape.id).distance_to_line_center=grp.line.occupiedDistances[res.indice];
      grp.line.occupiedDistances.splice(res.indice,1);
      //line.occupiedDistances.push(shape.distance_to_line_center,);
      //line.freeDistances.splice(res.indice,1);   
      this.updateOccDist(grp,grp.shapes_g[res.indice]);
    }
   },
   isNearest(line,shape){
    let ecart;
    let invx=line.x+line.freeDistances[0]*Math.cos(line.rotation*(Math.PI/180));
    let invy=line.y+line.freeDistances[0]*Math.sin(line.rotation*(Math.PI/180));
    let ecart_min=Math.sqrt((invx-shape.x)**2+(invy-shape.y)**2);
    let indice=0;
    for(let i=1;i<line.freeDistances.length;i++){
      invx=line.x+line.freeDistances[i]*Math.cos(line.rotation*(Math.PI/180));
      invy=line.y+line.freeDistances[i]*Math.sin(line.rotation*(Math.PI/180));
      ecart=Math.sqrt((invx-shape.x)**2+(invy-shape.y)**2);
      if(ecart<ecart_min){
        //res=line.freeDistances[i];
        ecart_min=ecart;
        indice=i;
      }
    }
    return indice;
    /*
    let allDist=line.freeDistances.concat(line.occupiedDistances);
    console.log(allDist);
    
    let ecart;
    let invx=line.x+allDist[0]*Math.cos(line.rotation*(Math.PI/180));
    let invy=line.y+allDist[0]*Math.sin(line.rotation*(Math.PI/180));
    let ecart_min=Math.sqrt((invx-shape.x)**2+(invy-shape.y)**2)
    let indice=0;
    console.log(ecart_min);
    for(let i=1;i<allDist.length;i++){
      invx=line.x+allDist[i]*Math.cos(line.rotation*(Math.PI/180));
      invy=line.y+allDist[i]*Math.sin(line.rotation*(Math.PI/180));
      ecart=Math.sqrt((invx-shape.x)**2+(invy-shape.y)**2);
      if(this.groups.find((r)=>r.id==line.id).shapes_g.indexOf(shape)!=-1){
        console.log(ecart_min);
        console.log(ecart);
        if(ecart<ecart_min && ecart!=0){
          //res=allDist[i];
          ecart_min=ecart;
          indice=i;
        }
      }else if(ecart<ecart_min){
        //res=allDist[i];
        ecart_min=ecart;
        indice=i;
      }
    }
    console.log(indice);
    if(indice>=line.freeDistances.length){
      return{
        isFree: false,
        indice: indice-line.freeDistances.length,
      }
    }else{
      return{
        isFree: true,
        indice: indice,
      }
    }
    */

    /*
    line.freeDistances.sort(this.isSmaller);
    let ecart;
    let invx=line.x+line.freeDistances[0]*Math.cos(line.rotation*(Math.PI/180));
    let invy=line.y+line.freeDistances[0]*Math.sin(line.rotation*(Math.PI/180));
    let ecart_min=Math.sqrt((invx-shape.x)**2+(invy-shape.y)**2)
    let indice=0;
    for(let i=0;i<line.freeDistances.length;i++){
      invx=line.x+line.freeDistances[i]*Math.cos(line.rotation*(Math.PI/180));
      invy=line.y+line.freeDistances[i]*Math.sin(line.rotation*(Math.PI/180));
      ecart=Math.sqrt((invx-shape.x)**2+(invy-shape.y)**2)
      if(ecart<ecart_min){
        //res=freeDistances[i];
        ecart_min=ecart;
        indice=i;
      }
    }
    return indice;
    */
    /*
    if(shapeDistance>=0){
      for(let i=0;i<freeDistances.length;i++){
        if(freeDistances[i]>shapeDistance){
          return i;
        }
      }
      return freeDistances.length-1;
    }else{
      let ecart_min=Math.abs(Math.abs(freeDistances[0])-Math.abs(shapeDistance))
      let indice=0;
      for(let i=0;i<freeDistances.length;i++){
        let ecart=Math.abs(Math.abs(freeDistances[i])-Math.abs(shapeDistance));
        if(ecart<ecart_min){
          //res=freeDistances[i];
          ecart_min=ecart;
          indice=i;
        }
      }
      return indice;
    }
    */
    /*
    //let res=freeDistances[0];
    let ecart_min=Math.abs(Math.abs(freeDistances[0])-Math.abs(shapeDistance))
    let indice=0;
    for(let i=0;i<freeDistances.length;i++){
      let ecart=Math.abs(Math.abs(freeDistances[i])-Math.abs(shapeDistance));
      if(ecart<ecart_min){
        //res=freeDistances[i];
        ecart_min=ecart;
        indice=i;
      }
    }
    return indice;
    */
   },
   

   sortByDistToLineCenter(grp){
    //this.updateAllPosInGrp(grp.id)
    //let last_distX=new Array(grp.shapes_g.length);
    
    //let distX;
    //let distY;
    //let sign;
    //let dist=new Array(grp.shapes_g.length);
    //let angle;
    if(grp.line.keepDistribution){
      for (let l=0;l<grp.shapes_g.length;l++){
          let distX=grp.shapes_g[l].x-grp.line.x;
          let distY=grp.shapes_g[l].y-grp.line.y;
          //dist[l]=this.GiveSignOfDistance(grp.shapes_g[l],grp.line)*Math.sqrt((distX)**2+(distY)**2);
          grp.shapes_g[l].distance_to_line_center=this.GiveSignOfDistance(grp.shapes_g[l],grp.line)*Math.sqrt((distX)**2+(distY)**2);
          //last_distX[l]=distX;
        }
    }
    for(let i=1;i<grp.shapes_g.length;i++){
      
     
      let shape=grp.shapes_g[i];
      //let distance=dist[i];
      let j=i
      while(j>0 && grp.shapes_g[j-1].distance_to_line_center>shape.distance_to_line_center){
        grp.shapes_g[j]=grp.shapes_g[j-1];
        //dist[j]=dist[j-1]
        j=j-1;
      }
      grp.shapes_g[j]=shape;
      //dist[j]=distance;
    }
   },
   

   sortAnyShapesByDistToLineCenter(shapes,line){
    //this.updateAllPosInGrp(grp.id)
    //let last_distX=new Array(grp.shapes_g.length);
    
    //let distX;
    //let distY;
    //let sign;
    //let dist=new Array(grp.shapes_g.length);
    //let angle;
    for (let l=0;l<shapes.length;l++){
        let distX=shapes[l].x-line.x;
        let distY=shapes[l].y-line.y;
        /*
        angle=grp.shapes_g[l].rotation*(Math.PI/180);

      
      if(angle<=-Math.PI/4 || angle>=-Math.PI/2){
        sign=-Math.sign(distY);
      }
      else if(angle<=-Math.PI/2 || angle>=-3*Math.PI/4){
        sign=Math.sign(distY);
      }
      else if(angle<=-3*Math.PI/4 || angle>=-Math.PI){
        sign=-Math.sign(distX);
      }else if(angle>=3*Math.PI/4 || angle<=Math.PI){
        sign=Math.sign(distX);
      }else if(angle>=Math.PI/2 || angle<3*Math.PI/4){
        sign=-Math.sign(distY);
      } else if(angle<=Math.PI/2 || angle>Math.PI/4){
        sign=-Math.sign(distY);
      } else if(angle<=Math.PI/4 || angle>=0){
        sign=Math.sign(distX);
      }
       console.log(sign);
        */
       
        /*
        if(Math.sin(grp.line.rotation*(Math.PI/180))==0){
            grp.shapes_g[l].distance_to_line_center=grp.shapes_g[l].x-grp.line.x;
        }else{
            grp.shapes_g[l].distance_to_line_center=Math.sign(distX)*Math.sqrt((distX)**2+(distY)**2);
          
            if(grp.line.rotation*(Math.PI/180)<=-Math.PI/2 || grp.line.rotation*(Math.PI/180)<=Math.PI/2 &&grp.line.rotation*(Math.PI/180)>=0){
              grp.shapes_g[l].distance_to_line_center=-grp.shapes_g[l].distance_to_line_center
            }
        }
        */
        //dist[l]=this.GiveSignOfDistance(grp.shapes_g[l],grp.line)*Math.sqrt((distX)**2+(distY)**2);
        shapes.distance_to_line_center=this.GiveSignOfDistance(shapes,line)*Math.sqrt((distX)**2+(distY)**2);
        /*
        if((grp.line.rotation*(Math.PI/180)<=-Math.PI/2 || (grp.line.rotation*(Math.PI/180)<=Math.PI/2 && grp.line.rotation*(Math.PI/180)>=0)) && (Math.sign(last_distX[l])!=Math.sign(distX))){
          grp.shapes_g[l].distance_to_line_center=-grp.shapes_g[l].distance_to_line_center
        }
        */
        //last_distX[l]=distX;
      }
    for(let i=1;i<shapes.length;i++){
      
     
      let shape=shapes[i];
      //let distance=dist[i];
      let j=i
      while(j>0 && shapes[j-1].distance_to_line_center>shape.distance_to_line_center){
        shapes[j]=shapes[j-1];
        //dist[j]=dist[j-1]
        j=j-1;
      }
      shapes[j]=shape;
      //dist[j]=distance;
    }
   },

  

   /*
   update the drag function of a shape which is on a line. 
   */
   updateDragFunc(shape,line){
          let angle=line.rotation*(Math.PI/180);
          if (angle<=0 && angle>=-Math.PI/4){
            shape.dragBoundFunc= function (pos) {
              return {
                x: line.x +(pos.x-line.x)*Math.cos(angle),
                y: line.y+(pos.x-line.x)*Math.sin(angle),
              };
            }
          } else if (angle<-Math.PI/4 && angle>=-Math.PI/2){
            // We prefer, in this case, moving the shape of the line regarding the y of the mouse position instead of the x.
            // So that the user can move the shape more intuitively
            shape.dragBoundFunc= function (pos) {
              return {
                x: line.x-(pos.y-line.y)*Math.cos(angle),
                y: line.y-(pos.y-line.y)*Math.sin(angle),
              };
            }
          }
          else if (angle<-Math.PI/2 && angle>=-3*Math.PI/4){
            shape.dragBoundFunc= function (pos) {
              return {
                x: line.x-(pos.y-line.y)*Math.cos(angle),
                y: line.y-(pos.y-line.y)*Math.sin(angle),
              };
            }
          } else if (angle<-3*Math.PI/4 && angle>=-Math.PI){
            shape.dragBoundFunc= function (pos) {
              return {
                x: line.x-(pos.x-line.x)*Math.cos(angle),
                y: line.y-(pos.x-line.x)*Math.sin(angle),
              };
            }
          }else if (angle<=Math.PI && angle>=3*Math.PI/4){
            shape.dragBoundFunc= function (pos) {
              return {
                x: line.x-(pos.x-line.x)*Math.cos(angle),
                y: line.y-(pos.x-line.x)*Math.sin(angle),
              };
            }
          } else if (angle<3*Math.PI/4 && angle>=Math.PI/2){
            shape.dragBoundFunc= function (pos) {
              return {
                x: line.x+(pos.y-line.y)*Math.cos(angle),
                y: line.y+(pos.y-line.y)*Math.sin(angle),
              };
            }
          } else if (angle<Math.PI/2 && angle>=Math.PI/4){
            shape.dragBoundFunc= function (pos) {
              return {
                x: line.x+(pos.y-line.y)*Math.cos(angle),
                y: line.y+(pos.y-line.y)*Math.sin(angle),
              };
            }
          }else if (angle<Math.PI/4 && angle>=0){
            shape.dragBoundFunc= function (pos) {
              return {
                x: line.x+(pos.x-line.x)*Math.cos(angle),
                y: line.y+(pos.x-line.x)*Math.sin(angle),
              };
            }
          }
   },

   /*
   Update the position of a free shape when it is dragging.
   */
    updatePos(e){
      const shape = this.shapes.find(i => i.id === e.target.id());
      shape.x=e.target.x();
      shape.y=e.target.y();
      this.center.x=e.target.x();
      this.center.y=e.target.y();

      let pos = { x: shape.x, y: shape.y };
      e.target.position(pos);
      e.target.getLayer().batchDraw();
      
    },

    /*
    Update the positio  of shape attached to a line (from the group with id=id_grp) when it is dragging.
     */
    updatePosInGrp(e,id_grp){
      let distX;
      let distY;
      let distance_to_line_center;
      const grp=this.groups.find((r)=> r.id===id_grp);
      
      if(grp.aShapeHasBeenDetach==1){
        grp.aShapeHasBeenDetach=0;
        return;
      }
      const line=grp.line;
      const shape = grp.shapes_g.find(i => i.id === e.target.id());
      const shapes_g = grp.shapes_g; 
      //const lengthToDetach=10;
      if(shape.needToBeDetach==1){
        shape.needToBeDetach=0;
        this.DetachShape(shape);
        this.updateAllPosInGrp(e.target.getParent().attrs.id);
      }
      if(line.keepDistribution){
        if(this.isCoordinateOnLine(e.target.x(),e.target.y(),line.id)){
          distX=shape.x-e.target.x();
          distY=shape.y -e.target.y();
          let L=grp.line.points[4];
          let nb_shapes=grp.shapes_g.length;
          let d=(L/(nb_shapes-1))*grp.line.scaleX;
          let dist=Math.sqrt(distX**2 +distY**2);
          if(dist>=d){
            shape.x=e.target.x();
            shape.y=e.target.y();
            this.updateOccupiedDistance(line.id)
            shape.x=line.x+line.occupiedDistances[shapes_g.indexOf(shape)]*Math.cos(line.rotation*(Math.PI/180));
            shape.y=line.y+line.occupiedDistances[shapes_g.indexOf(shape)]*Math.sin(line.rotation*(Math.PI/180));
            shape.distance_to_line_center=line.occupiedDistances[shapes_g.indexOf(shape)];
            shape.rotation=line.rotation;
            this.updateAllPosInGrp(line.id);
          }else{
            shape.x=line.x+line.occupiedDistances[shapes_g.indexOf(shape)]*Math.cos(line.rotation*(Math.PI/180));
            shape.y=line.y+line.occupiedDistances[shapes_g.indexOf(shape)]*Math.sin(line.rotation*(Math.PI/180));
            shape.distance_to_line_center=line.occupiedDistances[shapes_g.indexOf(shape)];
            shape.rotation=line.rotation; 
          }   
        }else{
          shape.x=e.target.x();
          shape.y=e.target.y();
        }
        line.positionPoints[grp.shapes_g.indexOf(shape)].x=shape.x;
        line.positionPoints[grp.shapes_g.indexOf(shape)].y=shape.y;
        line.positionPoints[grp.shapes_g.indexOf(shape)].distance_to_line_center=shape.distance_to_line_center; 
      } else{
        
          line.positionPoints[grp.shapes_g.indexOf(shape)].x=shape.x;
          line.positionPoints[grp.shapes_g.indexOf(shape)].y=shape.y;
          shape.x=e.target.x();
          shape.y=e.target.y();
          
          if(Math.sin(line.rotation*(Math.PI/180))==0){
            distance_to_line_center=shape.x-line.x;
          }else{
            if(Math.sign(shape.x-line.x)!=0){
              distance_to_line_center=Math.sign(-shape.rotation)*Math.sign(shape.x-line.x)*Math.sqrt((shape.x-line.x)**2+(shape.y-line.y)**2);
            } else{
             distance_to_line_center=Math.sign(-shape.rotation)*Math.sign(shape.y-line.y)*Math.sqrt((shape.x-line.x)**2+(shape.y-line.y)**2); 
            }
          
            if(shape.rotation*(Math.PI/180)<=-Math.PI/2 || (shape.rotation*(Math.PI/180)<=Math.PI/2 && shape.rotation*(Math.PI/180)>=0)){
              distance_to_line_center=-distance_to_line_center
            }
          }
          //shape.distance_to_line_center=distance_to_line_center;
          //grp.line.occupiedDistances[shapes_g.indexOf(shape)]=shape.distance_to_line_center;
        line.positionPoints[grp.shapes_g.indexOf(shape)].distance_to_line_center=shape.distance_to_line_center;
          
      }
      let pos = { x: shape.x, y: shape.y };
      this.center.x=shape.x;
      this.center.y=shape.y;
      e.target.position(pos);
      e.target.getLayer().batchDraw();
      if(!this.isCoordinateOnLine(shape.x,shape.y,line.id)){
        shape.dragBoundFunc= dragFunc;
        shape.isGrouped=0;
        this.shapes.push(shape,)
        for (let i=0;i<shapes_g.length;i++){
          if(shapes_g[i].id==shape.id){
            line.freeDistances.push(line.occupiedDistances[i]);
            line.occupiedDistances.splice(i,1);
            shapes_g.splice(i,1);
            console.log("a shape has been removed from the line");
          }
        } 
      }else{
        if(!line.keepDistribution){
          grp.line.occupiedDistances[shapes_g.indexOf(shape)]=distance_to_line_center;
        }else{
        grp.line.occupiedDistances[shapes_g.indexOf(shape)]=shape.distance_to_line_center;
        }
        
      line.positionPoints[grp.shapes_g.indexOf(shape)].x=shape.x;
      line.positionPoints[grp.shapes_g.indexOf(shape)].y=shape.y;
      line.positionPoints[grp.shapes_g.indexOf(shape)].distance_to_line_center=shape.distance_to_line_center;
       
      }
      /*
      let coord_y1=line.y-line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180));
      let coord_x1=line.x+line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180));
      let coord_y2= line.y+line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180));
      let coord_x2=line.x-line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180));
      let a=(coord_y1-coord_y2)/(coord_x2-coord_x1);
      let b=line.y-a*line.x;
      let is_on_straight_line=false;
      if(Math.abs(coord_x1-coord_x2)>=1){
        is_on_straight_line=(Math.abs(a*shape.x+b-shape.y)<1);
      }else{
        is_on_straight_line=(Math.abs(shape.x-line.x)<1);
      }
      if(
        !(is_on_straight_line)
      ||((line.y-line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180))+this.lengthToDetach<shape.y
        ||line.y+line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180))-this.lengthToDetach>shape.y)
      && ((line.rotation*(Math.PI/180)<=0 && line.rotation*(Math.PI/180)>-Math.PI/2)))

      ||((line.x+line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180))+this.lengthToDetach<shape.x
      ||line.x-line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180))-this.lengthToDetach>shape.x)
      &&((line.rotation*(Math.PI/180)<=0 && line.rotation*(Math.PI/180)>-Math.PI/2)))

      ||((line.y+line.points[4]*(1/2)*line.scaleX*Math.sin(Math.PI+line.rotation*(Math.PI/180))+this.lengthToDetach<shape.y
      ||line.y-line.points[4]*(1/2)*line.scaleX*Math.sin(Math.PI+line.rotation*(Math.PI/180))-this.lengthToDetach>shape.y)
      &&((line.rotation*(Math.PI/180)<=-Math.PI/2 && line.rotation*(Math.PI/180)>-Math.PI)))

      ||((line.x+line.points[4]*(1/2)*line.scaleX*Math.cos(Math.PI+line.rotation*(Math.PI/180))+this.lengthToDetach<shape.x
      ||line.x-line.points[4]*(1/2)*line.scaleX*Math.cos(Math.PI+line.rotation*(Math.PI/180))-this.lengthToDetach>shape.x)
      &&((line.rotation*(Math.PI/180)<=-Math.PI/2 && line.rotation*(Math.PI/180)>-Math.PI)))

      ||((line.y+line.points[4]*(1/2)*line.scaleX*Math.sin(Math.PI-line.rotation*(Math.PI/180))+this.lengthToDetach<shape.y
      ||line.y-line.points[4]*(1/2)*line.scaleX*Math.sin(Math.PI-line.rotation*(Math.PI/180))-this.lengthToDetach>shape.y)
      &&((line.rotation*(Math.PI/180)<=Math.PI && line.rotation*(Math.PI/180)>Math.PI/2)))

      ||((line.x+line.points[4]*(1/2)*line.scaleX*Math.cos(Math.PI-line.rotation*(Math.PI/180))+this.lengthToDetach<shape.x
      ||line.x-line.points[4]*(1/2)*line.scaleX*Math.cos(Math.PI-line.rotation*(Math.PI/180))-this.lengthToDetach>shape.x)
      &&((line.rotation*(Math.PI/180)<=Math.PI && line.rotation*(Math.PI/180)>Math.PI/2)))

      ||((line.y+line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180))+this.lengthToDetach<shape.y
      ||line.y-line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180))-this.lengthToDetach>shape.y)
      &&((line.rotation*(Math.PI/180)<=Math.PI/2 && line.rotation*(Math.PI/180)>=0)))

      ||((line.x+line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180))+this.lengthToDetach<shape.x
      ||line.x-line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180))-this.lengthToDetach>shape.x)
      &&((line.rotation*(Math.PI/180)<=Math.PI/2 && line.rotation*(Math.PI/180)>=0)))
      )
      {
        shape.dragBoundFunc= dragFunc;
        this.shapes.push(shape,)
        for (let i=0;i<shapes_g.length;i++){
          if(shapes_g[i].id==shape.id){
            line.freeDistances.push(line.occupiedDistances[i]);
            line.occupiedDistances.splice(i,1);
            shapes_g.splice(i,1);
            console.log("a shape has been removed from the line");
          }
        } 
      }else{
        if(!line.keepDistribution){
          grp.line.occupiedDistances[shapes_g.indexOf(shape)]=distance_to_line_center;
        }else{
        grp.line.occupiedDistances[shapes_g.indexOf(shape)]=shape.distance_to_line_center;
        }
      }
      */
      //this.updateOccupiedDistance(line.id);
      
          if(line.keepDistribution){
            this.updateOccupiedDistance(line.id);
          }
          
          this.updateAllPosInGrp(line.id);
          this.updateNaration(grp)
    },
    
    /*
    Function called when the transformation of a shape with a transfomer is finished.
    */
    updateTransformedShape(e) {
      

      let res;
      let shape; //Object concerned by the transformation
      if(e.target.className=="Line"){
        shape=this.groups.find(
        (r) => r.id === this.selectedShapeId
      ).line;
      }else{
        res=this.findShape(this.selectedShapeId)
        shape=res.shape_data;
        if(shape== undefined){
          return;
        }
      }

      
      let last_shapex= shape.x;
      let last_shapey= shape.y;

      //update data of the transformed object.
      shape.x = e.target.x();
      shape.y = e.target.y();
      shape.rotation = e.target.rotation();
      let last_scaleX= shape.scaleX;
      shape.scaleX = e.target.scaleX();
      shape.scaleY = e.target.scaleY();

      if(e.target.className=="Line"){
        const grp=this.groups.find((r)=> r.id===shape.id);
        if(shape.keepDistribution){
          for (let i=0;i<shape.occupiedDistances.length;i++){
            shape.occupiedDistances[i]=(shape.occupiedDistances[i]/last_scaleX)*shape.scaleX;
          }
          /*
          for (let i=0;i<shape.freeDistances.length;i++){
            shape.freeDistances[i]=(shape.freeDistances[i]/last_scaleX)*shape.scaleX;
          }
          */
          
          //this.updateOccupiedDistance(shape.id)
          this.update();
          this.updateGrp(e, this.selectedShapeId);
          this.checkIfShapesOnLine(this.selectedShapeId);        
        }else{
          
          
          
         if(last_scaleX!=shape.scaleX){
          for(let i=0;i<grp.shapes_g.length;i++){
          
          //If the width of the line has been changed, we update the distance from the shape to the center of the line
            
              let distX=grp.shapes_g[i].x-shape.x;
              let distY=grp.shapes_g[i].y-shape.y;
              /*
              if(Math.sign(grp.shapes_g[i].distance_to_line_center)==0){
                grp.shapes_g[i].distance_to_line_center=-this.GiveSignOfDistance(grp.shapes_g[i],shape)*Math.sqrt((distX)**2 +(distY)**2);
              
              }else{
                grp.shapes_g[i].distance_to_line_center=Math.sign(grp.shapes_g[i].distance_to_line_center)*Math.sqrt((distX)**2 +(distY)**2);
              }
              if(Math.sign((grp.shapes_g[i].x-last_shapex))!=Math.sign(distX)){
                grp.shapes_g[i].distance_to_line_center=-grp.shapes_g[i].distance_to_line_center;
              }
              */
             if(Math.sign(grp.line.occupiedDistances[i])==0){
                //if(grp.line.rotation!=-90 && grp.line.rotation!=90){
                  //grp.line.occupiedDistances[i]=-this.GiveSignOfDistance(grp.shapes_g[i],shape)*Math.sqrt((distX)**2 +(distY)**2);
                //}else{
                  grp.line.occupiedDistances[i]=this.GiveSignOfDistance(grp.shapes_g[i],shape)*Math.sqrt((distX)**2 +(distY)**2);
                  
                //}
              
              }else{
                grp.line.occupiedDistances[i]=Math.sign(grp.line.occupiedDistances[i])*Math.sqrt((distX)**2 +(distY)**2);
              }

              
              if(Math.sign((grp.shapes_g[i].x-last_shapex))!=Math.sign(distX) && Math.sign((grp.shapes_g[i].x-last_shapex))!=0 && grp.line.rotation!=90 && grp.line.rotation!=-90){
                
                grp.line.occupiedDistances[i]=-grp.line.occupiedDistances[i];
              }
              if(Math.sign((grp.shapes_g[i].y-last_shapey))!=Math.sign(distY) && Math.sign((grp.shapes_g[i].y-last_shapey))!=0 && (grp.line.rotation==90 || grp.line.rotation==-90)){
                grp.line.occupiedDistances[i]=-grp.line.occupiedDistances[i];
              }
              //this.checkIfShapesOnLine(this.selectedShapeId);  
            
            //this.checkIfShapesOnLine(this.selectedShapeId);
            //grp.line.occupiedDistances[i]=grp.shapes_g[i].distance_to_line_center;
            
          }
          for (let i=0;i<shape.freeDistances.length;i++){
            let distX=last_shapex-shape.x;
            let distY=last_shapey-shape.y; 
            let dist=Math.sqrt(distX**2+distY**2);
            if(shape.rotation<-90 ||shape.rotation>90){
              shape.freeDistances[i]=shape.freeDistances[i]-Math.sign(last_shapex-shape.x)*dist;
            } else if(shape.rotation==90 || shape.rotation==-90){
              shape.freeDistances[i]=shape.freeDistances[i]-distY
            } else{
              shape.freeDistances[i]=shape.freeDistances[i]+Math.sign(last_shapex-shape.x)*dist;
            
            }
          }
         }
          this.update();
          this.updateGrp(e, this.selectedShapeId);
          this.checkIfShapesOnLine(this.selectedShapeId);

          // We now see if freeDistances need to be delete(so if they are bigger than the half of the stickyline);
          
        }
        for(let i=0;i<grp.shapes_g.length;i++){
            
          this.updateDragFunc(grp.shapes_g[i],shape);

        }
      }else if(res.grp_id!='-1'){
        //this.update();
        //let layer=e.target.getParent().getLayer();
        //layer.batchDraw();
        this.updateAllPosInGrp(res.grp_id);
        this.updateOccupiedDistance(res.grp_id);
        e.target.x(e.target.getParent().attrs.shapes_g.find((r)=>r.id===e.target.id()).x);
        e.target.y(e.target.getParent().attrs.shapes_g.find((r)=>r.id===e.target.id()).y);
        this.groups.find((r)=>r.id===res.grp_id).shapes_g.find((r)=>r.id===e.target.id()).personalRotation=e.target.rotation()-e.target.getParent().attrs.line.rotation;
        
        
        this.updateAllPosInGrp(res.grp_id);
        this.checkIfShapesOnLine(res.grp_id);
        this.updateDragFuncOfCenter();
      
      }
      else{
        this.update();
        
        this.updateDragFuncOfCenter();
      }
      this.center.x=e.target.attrs.x;
      this.center.y=e.target.attrs.y;
    },
    
    handleTransformation(e) {
      if (e.evt==undefined) {
        return;
      }
      if(this.eraseMode==1){
        this.eraserAction(e);
        return;
      }
      
      //If we click on the stage, we have to remove the transformer from the node where it was.
      if (e.target === e.target.getStage()) {
        this.selectedShapeId = 'NoId';
        this.eraseNodefromTransformer("lineTransformer");
        this.eraseNodefromTransformer("shapeTransformer");
        this.center.opacity=0;
        return;
      }

      // If we click on a transformer, nothing happen.
      const clickedOnTransformer = e.target.getParent().className === 'Transformer';
      if (clickedOnTransformer) {
        return;
      }
      
      const id = e.target.id();
      let transformer_id;
      let shape=this.findShape(id).shape_data;

      //if it is a line, we need the transformer dedicated to the line (ie transformer with id="lineTransformer")
      //if it is a classic shape, we need the transformer dedicated to the shape (ie transformer with id="shapeTransformer")
      if(e.target.attrs.id=="center"){
        return;
      }
      if(e.target.className=="Line"){
        transformer_id="lineTransformer"
        shape = this.groups.find((r) => r.id === id).line;
        this.center.draggable=false;
        this.selectedShapeAlignment=shape.defaultAlignment;
        this.eraseNodefromTransformer("shapeTransformer");
      }else{
        transformer_id="shapeTransformer"
        this.center.draggable=true;
        this.selectedShapeAlignment=shape.centerPosition;
        this.eraseNodefromTransformer("lineTransformer");
      }
      
      if (shape!=undefined) {
        this.selectedShapeId = id;
        this.center.opacity=1;
        this.updateTransformer(transformer_id);
      } else{
        /*Only if the center is not selected.
        When the center is dragged, this function is called.
        But a shape is actualy selected (the one of the center).
        */
        this.selectedShapeId = 'NoId';
      }
      //this.updateTransformer(transformer_id);
      
      this.updateDragFuncOfCenter()
    },

    //remove node from transformer with id=transformer_id
    eraseNodefromTransformer(transformer_id) {
      let stage= this.$refs.stage.getStage();      
      const transformerNode = stage.find("#"+transformer_id)[0]; 
      transformerNode.nodes([]);
    },

    //Update transformer with id=transformer_id
    //It places the transformer regarding what node is selected
    updateTransformer(transformer_id) {

      let stage= this.$refs.stage.getStage();
      const transformerNode = stage.find("#"+transformer_id)[0];
      let selectedNode;
      if (transformer_id=="lineTransformer"){
        selectedNode = stage.children[0].getChildren().filter((r)=> r.attrs.className=="Group" && r.attrs.id==this.selectedShapeId)[0]
        .getChildren().filter(r=>r.attrs.className=="Line" && r.attrs.id==this.selectedShapeId)[0];
      }else{
      selectedNode = stage.children[0].getChildren().filter((r)=>r.attrs.className!="Group" && r.attrs.id==this.selectedShapeId)[0];

      let isFunded=true;
      if(selectedNode==undefined){
        isFunded=false;
      }
      let i=0;
      while(!isFunded){
        if(i<this.groups.length){
          selectedNode=stage.children[0].getChildren().filter((r)=>r.attrs.className=="Group")[i].getChildren().find((r)=>r.attrs.id==this.selectedShapeId && r.attrs.className!="Line");
        if(selectedNode==undefined){
          isFunded=false;
        }else{
          isFunded=true;
        }
        i++;
        }else{        
          isFunded=true;
        }
      }
      }
      /*
      if (transformer_id=="lineTransformer"){
        selectedNode = stage.children[0].getChildren().filter((r)=> r.attrs.className=="Group" && r.attrs.id==this.selectedShapeId)[0]
        .getChildren().filter(r=>r.attrs.className=="Line" && r.attrs.id==this.selectedShapeId)[0];
      }
      */
     
      //If the selected node has already the transformer on it, nothing happen
      if (selectedNode === transformerNode.node()) {
        return;
      }

      //If a node is selected
      if (selectedNode!=undefined) {
        //We attach the transformer to the node
        transformerNode.nodes([selectedNode]);
      } else {
        //if no node is selected, we remove the transformer from its node.
        transformerNode.nodes([]);
      }
      this.center.x=selectedNode.attrs.x;
      this.center.y=selectedNode.attrs.y;
      
    },
/*
  DisplayCenterMenu(e){
    CenterMenu.props.ConcernedShape=e.target;
   document.getElementById("center_menu").style.display="initial";
   document.getElementById("center_menu").style.top=e.target.getStage().getPointerPosition().y+8+"px";
  document.getElementById("center_menu").style.left=e.target.getStage().getPointerPosition().x+8+"px";
  },
  */

  //display context menu according to the target
  
  DisplayContextMenu(e){
    e.evt.preventDefault()
    if (e.target.className!=undefined && e.target.attrs.id!="center"){
      this.isStageOnlySelected=false;
      ContextMenu.data().dM='initial';
      this.$emit('needmenu');
      this.needMenu=true;
      ContextMenu.props.ConcernedShape=e.target;
      if (e.target.attrs.className=="Line"){
        this.isALineSelected=true;
        this.isAGroupedShapeSelected=true;
        //We precise the text which depends on the line where we clicked.
        this.keepDistanceButtonText=e.target.attrs.keepDistanceButtonText;
      } else if(e.target.getParent().attrs.className=="Group"){
        this.isAGroupedShapeSelected=true;
      }
      else{
        this.isALineSelected=false;
        this.isAGroupedShapeSelected=false;
      }
      document.getElementById("activeReuse").style.display="initial";
      document.getElementById("activeReuse").style.top=document.getElementById("reusedemo").getBoundingClientRect().top+document.documentElement.scrollTop+e.target.getStage().getPointerPosition().y+"px";
      document.getElementById("activeReuse").style.left=document.getElementById("reusedemo").getBoundingClientRect().left+document.documentElement.scrollLeft+e.target.getStage().getPointerPosition().x+"px";
    }
    if (e.target === e.target.getStage()) {
      this.needMenu=true;
      this.isALineSelected=false;
      this.isAGroupedShapeSelected=false;
      this.isStageOnlySelected=true;
      document.getElementById("activeReuse").style.display="initial";
      document.getElementById("activeReuse").style.top=document.getElementById("reusedemo").getBoundingClientRect().top+document.documentElement.scrollTop+e.target.getStage().getPointerPosition().y+"px";
      document.getElementById("activeReuse").style.left=document.getElementById("reusedemo").getBoundingClientRect().left+document.documentElement.scrollLeft+e.target.getStage().getPointerPosition().x+"px";
    }
  },

  //hide context menu
  HideContextMenu(){
    this.needMenu=false;
    document.getElementById("activeReuse").style.display="none";
  },


  
 ChangeCenter(e){
  let res=this.findShape(this.selectedShapeId);
  let shape=res.shape_data;
  let threshold1;
  let threshold2;
  let dist=this.GiveSignOfDistanceBtwCenterAndShape(e.target.attrs,shape)*Math.sqrt((e.target.y()-(shape.y))**2+(e.target.x()-shape.x)**2)+shape.offsetY*shape.scaleY;
  
  //let last_offsetX=shape.offsetX;
  let last_offsetY=shape.offsetY;
  if(shape==undefined){
    shape=this.groups.find((r)=>r.id==this.selectedShapeId).line;

  }else{
    
      if(shape.className=="Rect") {
        threshold1=shape.height*shape.scaleY/3;
        threshold2=shape.height*shape.scaleY*2/3;
        if(dist>=threshold1 && dist<=threshold2){
          shape.offsetX=shape.width/2;
          shape.offsetY=shape.height/2;
          shape.centerPosition="Middle";
        }else if(dist>threshold2){
          shape.offsetX=shape.width/2;
          shape.offsetY=shape.height;
          shape.centerPosition="Bottom";
        }
        else{
          shape.offsetX=shape.width/2;
          shape.offsetY=0;
          shape.centerPosition="Top";
        }
      }
      else if(shape.className=="Circle") {
        dist=dist+shape.radius*shape.scaleY;
        threshold1=shape.radius*shape.scaleY*2/3;
        threshold2=shape.radius*shape.scaleY*4/3;
        if(dist>=threshold1 && dist<=threshold2){
          shape.offsetX=0;
          shape.offsetY=0;
          shape.centerPosition="Middle";
        }else if(dist>threshold2){
          shape.offsetX=0;
          shape.offsetY=shape.radius;
          shape.centerPosition="Bottom";
        }else{
          shape.offsetX=0;
          shape.offsetY=-shape.radius;
          shape.centerPosition="Top";
        } 
      }
      else if(shape.className=="Image") {
        threshold1=shape.image.height*shape.scaleY/3;
        threshold2=shape.image.height*shape.scaleY*2/3;
        if(dist>=threshold1 && dist<=threshold2){
          shape.offsetX=shape.image.width/2;
          shape.offsetY=shape.image.height/2;
          shape.centerPosition="Middle";
        }else if(dist>threshold2){
          shape.offsetX=shape.image.width/2;
          shape.offsetY=shape.image.height;
          shape.centerPosition="Bottom";
        }
        else {
          shape.offsetX=shape.image.width/2;
          shape.offsetY=0;
          shape.centerPosition="Top";
        }
      }
      else if(shape.className=="Text") {
        threshold1=shape.length_y*shape.scaleY/3;
        threshold2=shape.length_y*shape.scaleY*2/3;
        if(dist>=threshold1 && dist<=threshold2){
          shape.offsetX=shape.length_x/2;
          shape.offsetY=shape.length_y/2;
          shape.centerPosition="Middle";
        }else if(dist>threshold2){
          shape.offsetX=shape.length_x/2;
          shape.offsetY=shape.length_y;
          shape.centerPosition="Bottom";
        }
        else{
          shape.offsetX=shape.length_x/2;
          shape.offsetY=0;
          shape.centerPosition="Top";
        }
      }
      else if(shape.className=="Triangle") {
        dist=dist+shape.radius*shape.scaleY;
        threshold1=shape.radius*shape.scaleY/2;
        threshold2=shape.radius*shape.scaleY*5/4;
        if(dist>=threshold1 && dist<=threshold2){
          shape.offsetX=0;
          shape.offsetY=0;
        }else if(dist>threshold2){
          shape.offsetX=0;
          shape.offsetY=shape.radius/2
          shape.centerPosition="Bottom";
        }
        else{
          shape.offsetX=0;
          shape.offsetY=-shape.radius;
          shape.centerPosition="Top";
        }
      }
      shape.y=shape.y-(last_offsetY-shape.offsetY)*shape.scaleY*Math.cos(shape.rotation*(Math.PI/180));
      shape.x=shape.x+(last_offsetY-shape.offsetY)*shape.scaleY*Math.sin(shape.rotation*(Math.PI/180));
      this.selectedShapeAlignment=shape.centerPosition;

      if (res.grp_id!='-1'){
        this.updateAllPosInGrp(res.grp_id);
      }
        
      e.target.x(shape.x);
      e.target.y(shape.y);

     

      
  }
  },
  /*
  ChangeAlignCenter(align_choice){
    let center=CenterMenu.props.ConcernedShape;
    let grp=this.groups.find((r)=>r.id===this.selectedShapeId);
    let shape;
    if(grp!=undefined){
      for(let i=0;i<grp.shapes_g.length;i++){
        this.ChangeCenterRegardingCommand(grp.shapes_g[i].id,align_choice)
      }
      center.x(grp.line.x);
      center.y(grp.line.y);
      if(grp.line.defaultAlignment==align_choice){
        grp.line.defaultAlignment='' //If we select again the same alogn_choice, we deselect it, no alignement center is fixed.
      }else{
        grp.line.defaultAlignment=align_choice;
      }
      this.selectedShapeAlignment=grp.line.defaultAlignment;
    }else{
      shape=this.findShape(this.selectedShapeId).shape_data;
      this.ChangeCenterRegardingCommand(shape.id,align_choice)
      this.selectedShapeAlignment=shape.centerPosition;
      center.x(shape.x);
      center.y(shape.y);
    }
  },
  */
  //Allow to change the center regarding a text command (Top,Middle or Bottom)
  ChangeCenterRegardingCommand(shape_id,command){
    let res=this.findShape(shape_id);
    let shape=res.shape_data;
    let last_offsetY=shape.offsetY;
    if(shape.className=="Rect" ){
      if(command=="Top"){
        shape.offsetY=0;
        shape.offsetX=shape.width/2;
      }
      else if(command=="Middle"){
          shape.offsetX=shape.width/2;
          shape.offsetY=shape.height/2;
      }else if(command=="Bottom"){
            shape.offsetX=shape.width/2;
            shape.offsetY=shape.height;
      }
    }
      else if(shape.className=="Circle") {
        if(command=="Top"){
          shape.offsetX=0;
          shape.offsetY=-shape.radius;
        }else if(command=="Middle"){
          shape.offsetX=0;
          shape.offsetY=0
        }else if(command=="Bottom"){
          shape.offsetX=0;
          shape.offsetY=shape.radius;
        } 
      }
      else if(shape.className=="Image") {
        if(command=="Middle"){
          shape.offsetX=shape.image.width/2;
          shape.offsetY=shape.image.height/2;
        }else if(command=="Bottom"){
          shape.offsetX=shape.image.width/2;
          shape.offsetY=shape.image.height;
        }
        else if (command=="Top"){
          shape.offsetX=shape.image.width/2;
          shape.offsetY=0;
        }
      }
      else if(shape.className=="Text") {
        if(command=="Middle"){
          shape.offsetX=shape.length_x/2;
          shape.offsetY=shape.length_y/2;
        }else if(command=="Bottom"){
          shape.offsetX=shape.length_x/2;
          shape.offsetY=shape.length_y;
        }
        else if(command=="Top"){
          shape.offsetX=shape.length_x/2;
          shape.offsetY=0;
        }
      }
      else if(shape.className=="Triangle") {
        if(command=="Middle"){
          shape.offsetX=0;
          shape.offsetY=0;
        }else if(command=="Bottom"){
          shape.offsetX=0;
          shape.offsetY=shape.radius/2;
        }
        else if(command=="Top"){
          shape.offsetX=0;
          shape.offsetY=-shape.radius;
        }
      }
      shape.centerPosition=command;
      shape.y=shape.y-(last_offsetY-shape.offsetY)*shape.scaleY*Math.cos(shape.rotation*(Math.PI/180));
      shape.x=shape.x+(last_offsetY-shape.offsetY)*shape.scaleY*Math.sin(shape.rotation*(Math.PI/180));

      if (res.grp_id!='-1'){
        this.updateAllPosInGrp(res.grp_id);
      }
        
      //center.x(shape.x);
      //center.y(shape.y);
  },
  updateDragFuncOfCenter(){
    let shape=this.findShape(this.selectedShapeId).shape_data
    let center=this.center;
    let angle=shape.rotation*(Math.PI/180);
    if(angle>=-Math.PI/2 && angle<=0){
      angle-=90*(Math.PI/180);
    }else if(angle<-Math.PI/2){
      angle+=(Math.PI/2);
      angle=Math.PI+angle;
    } else if(angle<=Math.PI && angle>0){
      angle-=90*(Math.PI/180);
    } 
    if (angle<=0 && angle>=-Math.PI/4){
      center.dragBoundFunc= function (pos) {
        return {
          x: shape.x +(pos.x-shape.x)*Math.cos(angle),
          y: shape.y+(pos.x-shape.x)*Math.sin(angle),
        };
      }
    } else if (angle<-Math.PI/4 && angle>=-Math.PI/2){
      center.dragBoundFunc= function (pos) {
        return {
          x: shape.x-(pos.y-shape.y)*Math.cos(angle),
          y: shape.y-(pos.y-shape.y)*Math.sin(angle),
        };
      }
    }
    else if (angle<-Math.PI/2 && angle>=-3*Math.PI/4){
      center.dragBoundFunc= function (pos) {
        return {
          x: shape.x-(pos.y-shape.y)*Math.cos(angle),
          y: shape.y-(pos.y-shape.y)*Math.sin(angle),
        };
      }
    } else if (angle<-3*Math.PI/4 && angle>=-Math.PI){
      center.dragBoundFunc= function (pos) {
        return {
          x: shape.x-(pos.x-shape.x)*Math.cos(angle),
          y: shape.y-(pos.x-shape.x)*Math.sin(angle),
        };
      }
    }else if (angle<=Math.PI && angle>=3*Math.PI/4){
      center.dragBoundFunc= function (pos) {
        return {
          x: shape.x-(pos.x-shape.x)*Math.cos(angle),
          y: shape.y-(pos.x-shape.x)*Math.sin(angle),
        };
      }
    } else if (angle<3*Math.PI/4 && angle>=Math.PI/2){
      center.dragBoundFunc= function (pos) {
        return {
          x: shape.x+(pos.y-shape.y)*Math.cos(angle),
          y: shape.y+(pos.y-shape.y)*Math.sin(angle),
        };
      }
    } else if (angle<Math.PI/2 && angle>=Math.PI/4){
      center.dragBoundFunc= function (pos) {
        return {
          x: shape.x+(pos.y-shape.y)*Math.cos(angle),
          y: shape.y+(pos.y-shape.y)*Math.sin(angle),
        };
      }
    }else if (angle<Math.PI/4 && angle>=0){
      center.dragBoundFunc= function (pos) {
        return {
          x: shape.x+(pos.x-shape.x)*Math.cos(angle),
          y: shape.y+(pos.x-shape.x)*Math.sin(angle),
        };
      }
    }
  },
  MovingCenter(){
    //let shape=this.findShape(this.selectedShapeId)
    //console.log(e.target)
  },
  /*
  //called when the "Change Center" button is clicked
  ChangeCenterButtonAction(){
      let shape= ContextMenu.props.ConcernedShape;
      if(shape.attrs.className=="Line"){
        let shapes_g=shape.getParent().attrs.shapes_g //the list of the shapes which are on the line is in the corresponding group.
        for (let j=0;j<shapes_g.length;j++){
          this.ChangeCenter(shapes_g[j]);
        }
      }else{
        let shape_data=this.shapes.find(i => i.id ===shape.attrs.id);
        let isFunded=true;
        if(shape_data==undefined){
          isFunded=false;
        }
        let i=0;
        while(!isFunded){
          if(i<this.groups.length){
            shape_data=this.groups[i].shapes_g.find(i => i.id === shape.attrs.id);
          if(shape_data==undefined){
            isFunded=false;
          }else{
            isFunded=true;
          }
          i++;
          }else{        
            isFunded=true;
          }
        }
        this.ChangeCenter(shape_data)
      }
    },
    */
    
    //allow to copy a target
    
    Copy(){
      ContextMenu.props.CopiedShape=ContextMenu.props.ConcernedShape;
      ContextMenu.props.pastOneObject=true;
    },
    /*
    CopyAll(){
      ContextMenu.props.CopiedShape=ContextMenu.props.ConcernedShape;
      ContextMenu.props.pastOneObject=false;
    },
    */
    Past(){   
      //Prevent error when no shape is copied
      if(ContextMenu.props.CopiedShape.attrs==undefined){
        return;
      }
      let clone=ContextMenu.props.CopiedShape.clone({
        id: ''+this.max_id_figures,
      })
      //let layer=ContextMenu.props.CopiedShape.getLayer();
      let i= this.groups.length
      //let new_id=i+1;
      if(ContextMenu.props.CopiedShape.attrs.className=="Line"){
        this.max_id_figures=this.max_id_figures+1;
        if(!ContextMenu.props.pastOneObject){
          //let i= this.groups.length;
          //let new_id=i+1;
        
          clone=ContextMenu.props.CopiedShape.getParent().clone({
            id: ''+ this.max_id_figures,
            name: "group"+this.max_id_figures,
            shapes_g:[],
          })
          clone.attrs.line.id=''+this.max_id_figures;
          clone.attrs.line.x=ContextMenu.props.ConcernedShape.getStage().getPointerPosition().x;
          clone.attrs.line.y=ContextMenu.props.ConcernedShape.getStage().getPointerPosition().y;
          let positionPoints=Object.assign([],clone.attrs.line.positionPoints);
            let length=positionPoints.length;
            clone.attrs.line.positionPoints=[];
            for(let i=0;i<length.valueOf();i++){
              let clone_positionPoint=ContextMenu.props.CopiedShape.getParent().getChildren().find((r)=>r.attrs.id===positionPoints[i].id).clone({
              id:'positionPoint'+clone.attrs.line.id+i,
              });
              clone.attrs.line.positionPoints.push(clone_positionPoint.attrs,);
            }
          
          //layer= ContextMenu.props.CopiedShape.getParent().getLayer();
          this.groups.push(clone.attrs,);
          let shapesg=this.groups[this.groups.indexOf(this.groups.find((r)=> r.id==ContextMenu.props.CopiedShape.getParent().attrs.id))].shapes_g;
          let shapesg_length=shapesg.length;
          for (let j=0; j<shapesg_length;j++){
            this.max_id_figures=this.max_id_figures + 1;
            let clone_shape=ContextMenu.props.CopiedShape.getParent().getChildren().find((r)=>r.attrs.id===shapesg[j].id).clone({
              id:''+this.max_id_figures,
            });
           // this.updateDragFunc(clone_shape,clone_line);
            this.groups[i].shapes_g.push(clone_shape.attrs,);
            this.updateDragFunc(this.groups[i].shapes_g[this.groups[i].shapes_g.length-1],this.groups[i].line);
          }
          this.updateAllPosInGrp(clone.attrs.id);
        }else{
          //let i= this.groups.length;
          //let new_id=i+1;
        
          clone=ContextMenu.props.CopiedShape.getParent().clone({
            id: ''+this.max_id_figures,
            name: "group"+this.max_id_figures,
            shapes_g:[],
          })
          clone.attrs.line.id=''+this.max_id_figures;
          clone.attrs.line.x=ContextMenu.props.ConcernedShape.getStage().getPointerPosition().x;
          clone.attrs.line.y=ContextMenu.props.ConcernedShape.getStage().getPointerPosition().y;
          for(let j=0;j<clone.attrs.line.occupiedDistances.length;j++){
            clone.attrs.line.freeDistances.push(clone.attrs.line.occupiedDistances[j],);
          }
          clone.attrs.line.occupiedDistances=[];
          if(clone.attrs.line.keepDistribution!=1){
            let positionPoints=Object.assign([],clone.attrs.line.positionPoints);
            let length=positionPoints.length;
            clone.attrs.line.positionPoints=[];
            for(let i=0;i<length.valueOf();i++){
              let clone_positionPoint=ContextMenu.props.CopiedShape.getParent().getChildren().find((r)=>r.attrs.id===positionPoints[i].id).clone({
              id:'positionPoint'+clone.attrs.line.id+i,
              });
              clone.attrs.line.positionPoints.push(clone_positionPoint.attrs,);
            }
          }
          //layer= ContextMenu.props.CopiedShape.getParent().getLayer();
          this.groups.push(clone.attrs,)
        }
        this.updateNaration(this.groups[this.groups.length-1])
        //In order to actualize the new line (in particular to show the positionPoints):
        this.updateAllPosInGrp(clone.attrs.id)
      } 
      else{
        this.max_id_figures=this.max_id_figures + 1;
        clone=ContextMenu.props.CopiedShape.clone({
          id: ''+this.max_id_figures,  
          x:ContextMenu.props.ConcernedShape.getStage().getPointerPosition().x,
          y:ContextMenu.props.ConcernedShape.getStage().getPointerPosition().y,
        });
        clone.attrs.dragBoundFunc=function (pos) {
          return {
            x: pos.x,
            y: pos.y,
          };
        };
        clone.attrs.isGrouped=0;
        this.shapes.push(clone.attrs,); 
         
      }
      //layer.batchDraw(); 
      
    },
    //RemoveShape(shape)
    Remove(shape){
      //let shape=ContextMenu.props.ConcernedShape;
      if(shape.attrs.className=="Line"){
        let grp=this.groups.find((r)=>r.id===shape.attrs.id);
        const length=grp.shapes_g.length;
        for(let i=0;i<length;i++){
          grp.shapes_g[i].dragBoundFunc= dragFunc;
          grp.shapes_g[i].isGrouped=0;
          this.shapes.push(grp.shapes_g[i],);
        }
        this.eraseNodefromTransformer("lineTransformer");
        this.groups.splice(this.groups.indexOf(grp),1);
        shape.getParent().destroy();

        //We give to the circle (representing center of shapes) a default position
        if(this.groups[0]!=undefined){
          this.center.x=this.groups[0].line.x;
          this.center.y=this.groups[0].line.y;
        } else if(this.shapes[0]!=undefined){
          this.center.x=this.shapes[0].x;
          this.center.y=this.shapes[0].y;
        }
        this.center.opacity=0;
        
      }else if(shape.attrs.className=="positionPoint"){
        let line=shape.getParent().attrs.line;
        let target_positionPoint=line.positionPoints.find((r)=>r.id===shape.attrs.id);
        let index=line.freeDistances.indexOf(shape.attrs.distance_to_line_center);
        
        if(line.keepDistribution!=1 && index!=-1){
          line.freeDistances.splice(index,1);
          line.positionPoints.splice(line.positionPoints.indexOf(target_positionPoint),1)
        }
      }
      else{
        let res=this.findShape(shape.attrs.id)
        let shape_data=res.shape_data;
        let grp_id=res.grp_id;
        if(shape_data!=undefined){
        if(grp_id!='-1'){
        //let shape_data=this.shapes.find(i => i.id ===shape.attrs.id);
        let grp=this.groups.find((r)=>r.id===grp_id);
          grp.line.freeDistances.push(grp.line.occupiedDistances[grp.shapes_g.indexOf(shape_data)],)
          grp.line.occupiedDistances.splice(grp.shapes_g.indexOf(shape_data),1)
          
          grp.shapes_g.splice(grp.shapes_g.indexOf(shape_data),1);
          this.updateOccupiedDistance(grp.id);
          
          this.updateAllPosInGrp(grp.id);
          
      
        } else{
          this.eraseNodefromTransformer("shapeTransformer");
          this.shapes.splice(this.shapes.indexOf(shape_data),1);
          //We give to the circle (representing center of shapes) a default position
          if(this.groups[0]!=undefined){
            this.center.x=this.groups[0].line.x;
            this.center.y=this.groups[0].line.y;
          } else if(this.shapes[0]!=undefined){
            this.center.x=this.shapes[0].x;
            this.center.y=this.shapes[0].y;
          }
          this.center.opacity=0;
        }
        shape.destroy();
        }
      }
    },

    RemoveAll(){
      let shape=ContextMenu.props.ConcernedShape;
      if(shape.className=="Line"){
        let grp=this.groups.find((r)=>r.id===shape.attrs.id);
        while(grp.shapes_g.length!=0){
          grp.shapes_g[0].dragBoundFunc= dragFunc;
          grp.shapes_g.splice(0,1);
        }
        this.eraseNodefromTransformer("lineTransformer");
        this.groups.splice(this.groups.indexOf(grp),1);
        shape.getParent().destroy();

        //We give to the circle (representing center of shapes) a default position
        if(this.groups[0]!=undefined){
          this.center.x=this.groups[0].line.x;
          this.center.y=this.groups[0].line.y;
        } else if(this.shapes[0]!=undefined){
          this.center.x=this.shapes[0].x;
          this.center.y=this.shapes[0].y;
        }
        
      }else{
        return;
      }
    },
    

    findShape(id){
      let shape_data=this.shapes.find(i => i.id ===id);
      let grp_id='-1'; // return grp_id=-1 if the shape doesn't belong to attached group.
      let isFunded=true;
      if(shape_data==undefined){
        isFunded=false;
      }
      let i=0;
      while(!isFunded){
        if(i<this.groups.length){
          shape_data=this.groups[i].shapes_g.find(i => i.id === id);
        if(shape_data==undefined){
          isFunded=false;
        }else{
          grp_id=this.groups[i].id; 
          isFunded=true;
        }
        i++;
        }else{        
          isFunded=true;
        }
      }
      return {shape_data, grp_id}
    },

    //detach a shape from its line.
     DetachShape(shape,target_x,target_y){
      
      
      const added_distance=this.lengthToCapture+5;
      let grp=this.groups.find((r)=>r.shapes_g.indexOf(shape)!=-1);
      let i=grp.shapes_g.indexOf(shape);
      
      shape.dragBoundFunc= dragFunc;

      let coord_y1=grp.line.y-grp.line.points[4]*(1/2)*grp.line.scaleX*Math.sin(grp.line.rotation*(Math.PI/180));
      let coord_x2=grp.line.x+grp.line.points[4]*(1/2)*grp.line.scaleX*Math.cos(grp.line.rotation*(Math.PI/180));
      let coord_y2= grp.line.y+grp.line.points[4]*(1/2)*grp.line.scaleX*Math.sin(grp.line.rotation*(Math.PI/180));
      let coord_x1=grp.line.x-grp.line.points[4]*(1/2)*grp.line.scaleX*Math.cos(grp.line.rotation*(Math.PI/180));
      let a=(coord_y2-coord_y1)/(coord_x2-coord_x1);
      //let b=grp.line.y-a*grp.line.x;
      let b=shape.x*(1/a)+shape.y;
      if (grp.line.rotation<0 && grp.line.rotation>-45){
        
        shape.x=shape.x+Math.sign(shape.y-target_y)*added_distance*Math.sin(grp.line.rotation*(Math.PI/180))
        shape.y=-(1/a)*shape.x+b
      } else if (grp.line.rotation<=-45 && grp.line.rotation>-90){
        
        shape.x=shape.x+Math.sign(shape.x-target_x)*added_distance*Math.sin(grp.line.rotation*(Math.PI/180))
        shape.y=-(1/a)*shape.x+b
      }
      
      else if(grp.line.rotation<-90 && grp.line.rotation>-135){
        shape.x=shape.x+Math.sign(shape.x-target_x)*added_distance*Math.sin(grp.line.rotation*(Math.PI/180))
        shape.y=-(1/a)*shape.x+b
      } 
      else if(grp.line.rotation<=-135 && grp.line.rotation>-180){
        shape.x=shape.x-Math.sign(shape.y-target_y)*added_distance*Math.sin(grp.line.rotation*(Math.PI/180))
        shape.y=-(1/a)*shape.x+b
      } 
      
      else if( grp.line.rotation>135 && grp.line.rotation<180){
        
        shape.x=shape.x-Math.sign(shape.y-target_y)*added_distance*Math.sin(grp.line.rotation*(Math.PI/180))
        shape.y=-(1/a)*shape.x+b
      } else if( grp.line.rotation>90 && grp.line.rotation<=135){
        
        shape.x=shape.x-Math.sign(shape.x-target_x)*added_distance*Math.sin(grp.line.rotation*(Math.PI/180))
        shape.y=-(1/a)*shape.x+b
      } else if( grp.line.rotation>45 && grp.line.rotation<=90){
        
        shape.x=shape.x-Math.sign(shape.x-target_x)*added_distance*Math.sin(grp.line.rotation*(Math.PI/180))
        shape.y=-(1/a)*shape.x+b
      } else if( grp.line.rotation>0 && grp.line.rotation<=45){
        
        shape.x=shape.x+Math.sign(shape.y-target_y)*added_distance*Math.sin(grp.line.rotation*(Math.PI/180))
        shape.y=-(1/a)*shape.x+b
      } 
      else if(grp.line.rotation==-90){
        shape.x=shape.x-Math.sign(shape.x-target_x)*added_distance
      } else if(grp.line.rotation==90){
        shape.x=shape.x+Math.sign(shape.x-target_x)*added_distance
      } else if(grp.line.rotation==180 || grp.line.rotation==-180){
        shape.y=shape.y-Math.sign(shape.y-target_y)*added_distance
      } else if(grp.line.rotation==0){
        shape.y=shape.y-Math.sign(shape.y-target_y)*added_distance
      }  
      //shape.rotation=shape.rotation+shape.personalRotation;
      shape.isGrouped=0;
      this.shapes.push(shape,)
      this.center.x=shape.x;
      this.center.y=shape.y;
      grp.line.freeDistances.push(grp.line.occupiedDistances[i]);
      grp.line.occupiedDistances.splice(i,1);
      grp.shapes_g.splice(i,1);
      if(grp.line.keepDistribution){
        grp.line.positionPoints.splice(i,1)
      }
      this.updateOccupiedDistance(grp.id)
      this.updateAllPosInGrp(grp.id)
      this.updateNaration(grp)
      
      this.eraseNodefromTransformer("shapeTransformer");
    
    }, 
    /*
    DetachShape(shape){
      
      
      const added_distance=this.lengthToCapture+5;
      let grp=this.groups.find((r)=>r.shapes_g.indexOf(shape)!=-1);
      let i=grp.shapes_g.indexOf(shape);
      
      shape.dragBoundFunc= dragFunc;

      let coord_y1=grp.line.y-grp.line.points[4]*(1/2)*grp.line.scaleX*Math.sin(grp.line.rotation*(Math.PI/180));
      let coord_x2=grp.line.x+grp.line.points[4]*(1/2)*grp.line.scaleX*Math.cos(grp.line.rotation*(Math.PI/180));
      let coord_y2= grp.line.y+grp.line.points[4]*(1/2)*grp.line.scaleX*Math.sin(grp.line.rotation*(Math.PI/180));
      let coord_x1=grp.line.x-grp.line.points[4]*(1/2)*grp.line.scaleX*Math.cos(grp.line.rotation*(Math.PI/180));
      let a=(coord_y2-coord_y1)/(coord_x2-coord_x1);
      //let b=grp.line.y-a*grp.line.x;
      let b=shape.x*(1/a)+shape.y;
      if (grp.line.rotation<0 && grp.line.rotation>-90){
        
        shape.x=shape.x-added_distance*Math.sin(grp.line.rotation*(Math.PI/180))
        shape.y=-(1/a)*shape.x+b
      } else if(grp.line.rotation<-90){
        shape.x=shape.x-added_distance*Math.sin(grp.line.rotation*(Math.PI/180))
        shape.y=-(1/a)*shape.x+b
      } else if( grp.line.rotation>0 && grp.line.rotation<180){
        
        shape.x=shape.x+added_distance*Math.sin(grp.line.rotation*(Math.PI/180))
        shape.y=-(1/a)*shape.x+b
      } 
      else if(grp.line.rotation==-90){
        shape.x=shape.x+added_distance
      } else if(grp.line.rotation==90){
        shape.x=shape.x-added_distance
      } else if(grp.line.rotation==180 || grp.line.rotation==-180){
        shape.y=shape.y-added_distance
      } else if(grp.line.rotation==0){
        shape.y=shape.y+added_distance
      } 
      //shape.rotation=shape.rotation+shape.personalRotation;
      shape.isGrouped=0;
      this.shapes.push(shape,)
      this.center.x=shape.x;
      this.center.y=shape.y;
      grp.line.freeDistances.push(grp.line.occupiedDistances[i]);
      grp.line.occupiedDistances.splice(i,1);
      grp.shapes_g.splice(i,1);
      if(grp.line.keepDistribution){
        grp.line.positionPoints.splice(i,1)
      }
      this.updateOccupiedDistance(grp.id)
      this.updateAllPosInGrp(grp.id)
    
    }, 
    */
    /*

    //called when the button "Detach Shape" is clicked
    DetachShapeButtonAction(){
      let shape= ContextMenu.props.ConcernedShape;
      if(shape.attrs.className=="Line"){
        let shapes_g=shape.getParent().attrs.shapes_g;
        while(shapes_g.length!=0){
          this.DetachShape(shapes_g[0]);
        }
      }else{
        let shape_data=this.shapes.find(i => i.id ===shape.attrs.id);
        let isFunded=true;
        if(shape_data==undefined){
          isFunded=false;
        }
        let i=0;
        while(!isFunded){
          if(i<this.groups.length){
            shape_data=this.groups[i].shapes_g.find(i => i.id === shape.attrs.id);
          if(shape_data==undefined){
            isFunded=false;
          }else{
            isFunded=true;
          }
          i++;
          }else{        
            isFunded=true;
          }
        }
        this.DetachShape(shape_data)
      }
    },

    //called when the button "keep/liberate distribution" is clicked.
    KeepDistribution(){
      let grp=this.groups.find(i => i.id === ContextMenu.props.ConcernedShape.attrs.id);
      let line=grp.line;
      if(line==undefined){
        return;
      }else{
        if(line.keepDistribution){
          line.keepDistribution=false;
          for (let i=0;i<grp.shapes_g.length;i++){
            grp.shapes_g[i].distance_to_line_center=line.occupiedDistances[i]
          }
          line.freeDistances=[];

          line.stroke='blue'
          grp.line.keepDistanceButtonText="Keep Distribution";
          //ContextMenu.props.ConcernedShape.attrs.keepDistanceButtonText="Keep Distribution";
        }else{
          line.keepDistribution=true;
          for (let i=0;i<grp.shapes_g.length;i++){
            line.occupiedDistances[i]=grp.shapes_g[i].distance_to_line_center;
          }
          line.stroke='black'
          grp.line.keepDistanceButtonText="Liberate Distribution";
          //ContextMenu.props.ConcernedShape.attrs.keepDistanceButtonText="Liberate Distribution";
          this.updateOccupiedDistance(line.id);
          this.updateAllPosInGrp(line.id);
        }
      }
    },
    */
    createNewShape(shape){
      if(shape.attrs.className=="Line"){
        
        this.max_id_figures=this.max_id_figures+1;

          let clone=shape.getParent().clone({
            id: ''+this.max_id_figures,
            name: "group"+this.max_id_figures,
            shapes_g:[],
          })
          clone.attrs.line.id=''+this.max_id_figures;
          clone.attrs.line.x=shape.getStage().getPointerPosition().x;
          clone.attrs.line.y=shape.getStage().getPointerPosition().y;
          clone.attrs.line.draggable=true;
          this.groups.push(clone.attrs,)
          
        
      }else{
        
        this.max_id_figures=this.max_id_figures+1
        let clone=shape.clone({
          id: ''+this.max_id_figures,
          draggable: true,
        })
        clone.attrs.isGrouped=0;
        this.shapes.push(clone.attrs,);
      }
      

    },
    
  
  eraserAction(e){
    this.Remove(e.target);
    
  },
  unshowSelectedShape(e){
    if(e.target.attrs.className=="Line" && this.eraseMode==0){
      e.target.opacity(0.5)
    }
    else if(e.target.attrs.className=="Line" && this.eraseMode==1){
      if(e.target.attrs.keepDistribution==1){
        e.target.stroke("rgb(48,48,48)")
      }else{
        e.target.stroke("blue")
      }
    }
    else if(e.target.attrs.className=="positionPoint" && this.eraseMode==1){
      if(e.target.getParent().attrs.line.keepDistribution!=1){
        e.target.strokeWidth(0)
      }
    }
    else if(this.eraseMode==1){
      e.target.strokeWidth(0)
    }
  },
  showSelectedShape(e){
    if(e.target.attrs.className=="Line" && this.eraseMode==0){
      e.target.opacity(1)
    }
    else if(e.target.attrs.className=="Line" && this.eraseMode==1){
      e.target.stroke('rgb(200, 59, 218)')
    }
    else if(e.target.attrs.className=="positionPoint" && this.eraseMode==1){
      let line=e.target.getParent().attrs.line;
      if(line.freeDistances.indexOf(e.target.attrs.distance_to_line_center)!=-1){
        if(line.keepDistribution!=1){
          e.target.stroke('rgb(200, 59, 218)')
          e.target.strokeWidth(3)
        }
      }
    }
    else if(this.eraseMode==1){
      e.target.stroke('rgb(200, 59, 218)')
      e.target.strokeWidth(3)
    }
    /*
    let shape=e.target;
    if(this.eraseMode==1){
    let shape_data=this.shapes.find(i => i.id ===shape.attrs.id);
    let isFunded=true;
    if(shape_data==undefined){
      isFunded=false;
      let i=0;
      while(!isFunded){
        if(i<this.groups.length){
          shape_data=this.groups[i].shapes_g.find(i => i.id === shape.attrs.id);
        if(shape_data==undefined){
          isFunded=false;
          i++;
        }else{
          isFunded=true;
        }
        }else{        
          isFunded=true;
        }
      }
    }
    if (shape_data!=undefined){
      shape_data.opacity=0.3
    }
    */

  },
  editText(e){
    //let valuey=document.getElementById("stage").style.top+e.target.y()
    //let valuex=document.getElementById("stage").style.left+e.target.x()
    let stageBox=e.target.getStage().attrs.container.getBoundingClientRect();
    document.getElementById("input").style.top=stageBox.y+e.target.getAbsolutePosition().y+'px';
    document.getElementById("input").style.left=stageBox.x+e.target.getAbsolutePosition().x-document.getElementById("input").size*5+'px';
    document.getElementById("input").style.display="initial"
    this.editedText=e.target
  },
  updateText(e){
    let shape=this.shapes.find(i => i.id ===this.editedText.attrs.id);
    let isFunded=true;
    if(shape==undefined){
      isFunded=false;
    }
    let i=0;
    while(!isFunded){
      if(i<this.groups.length){
        shape=this.groups[i].shapes_g.find(i => i.id === this.editedText.attrs.id);
      if(shape==undefined){
        isFunded=false;
      }else{
        isFunded=true;
      }
      i++;
      }else{        
        isFunded=true;
      }
    }
    if(shape!=undefined){
    let last_width;
    let last_height;
    let diff_width;
    let diff_height;

    last_width=this.editedText.width();
    last_height=this.editedText.height();

    shape.text=e.target.value;

    this.editedText.text(e.target.value);
    diff_width=this.editedText.width()-last_width;
    diff_height=this.editedText.height()-last_height;

    
    shape.offsetX=shape.offsetX+diff_width/2
    shape.offsetY=shape.offsetY+diff_height/2
    shape.length_x=this.editedText.width()
    shape.length_y=this.editedText.height()
    document.getElementById("input").style.display="none"
    }

  },
  updateNaration(grp){
      let text="<strong>Substrate with id="+grp.id+":</strong><br>"
      if(grp.line.id==1){
      text=text+"- <mark class='blue'> StickyLine"+" with id="+ grp.line.id+"</mark><br>";
      }else{
       text=text+"- <mark class='blue'> copied StickyLine"+" with id="+ grp.line.id+"</mark><br>"; 
      }
      text=text+"Relation: <i>alignement and distance with</i>:";
      for(let j=0;j<grp.shapes_g.length;j++){
        text=text+"<br>"+"- "+grp.shapes_g[j].className+" with id="+grp.shapes_g[j].id
      }
      text=text+"<br>Distance kept in memory:"
      //+grp.line.occupiedDistances+",<mark class='green'>"+grp.line.freeDistances+"</mark>";
      for(let i=0;i<grp.line.occupiedDistances.length;i++){
        text=text+grp.line.occupiedDistances[i].toFixed(1)+",";
      }
      text=text+"<mark class='green'>"
      for(let i=0;i<grp.line.freeDistances.length-1;i++){
        text=text+grp.line.freeDistances[i].toFixed(1)+",";
      }if(grp.line.freeDistances.length>0){
      text=text+grp.line.freeDistances[grp.line.freeDistances.length-1].toFixed(1);
      }
      text=text+"</mark>"
      this.$emit('explain',{origin:"Instrument - Reuse<br><mark class='blue'> The Stickyline preserves alignment and distances. </mark>",text:text});
      
  },
  //This function has been added so that when there is more than on groups and a mouseenter event occured, 
  //we show state of all the groups.
  initialNaration(groups){
    if(!this.narationHasBeenInitialized){
      let grp; 
      let text='';
    for(let i=0;i<groups.length-1;i++){
      grp=groups[i];
      if(grp.line.id==1){
      text=text+"<strong>Substrate with id="+grp.id+":</strong><br>"
      text=text+"- <mark class='blue'> StickyLine"+" with id="+ grp.line.id+"</mark><br>";
      }else{
       text=text+"<strong>Substrate with id="+grp.id+":</strong><br>";
       text=text+"- <mark class='blue'> copied StickyLine"+" with id="+ grp.line.id+"</mark><br>"; 
      }
      text=text+"Relation: <i>alignement and distance with</i>:";
      for(let j=0;j<grp.shapes_g.length;j++){
        text=text+"<br>"+"- "+grp.shapes_g[j].className+" with id="+grp.shapes_g[j].id
      }
      text=text+"<br>Distance kept in memory:"
      //+grp.line.occupiedDistances+",<mark class='green'>"+grp.line.freeDistances+"</mark>";
      for(let i=0;i<grp.line.occupiedDistances.length;i++){
        text=text+grp.line.occupiedDistances[i].toFixed(1)+",";
      }
      text=text+"<mark class='green'>"
      for(let i=0;i<grp.line.freeDistances.length-1;i++){
        text=text+grp.line.freeDistances[i].toFixed(1)+",";
      }if(grp.line.freeDistances.length>0){
      text=text+grp.line.freeDistances[grp.line.freeDistances.length-1].toFixed(1);
      }
      text=text+"</mark>"
      text=text+"<br>***<br>"
    }
    grp=groups[groups.length-1]
      if(grp.line.id==1){
      text=text+"<strong>Substrate with id="+grp.id+":</strong><br>"
      text=text+"- <mark class='blue'> StickyLine"+" with id="+ grp.line.id+"</mark><br>";
      }else{
       text=text+"<strong>Substrate with id="+grp.id+":</strong><br>";
       text=text+"- <mark class='blue'> copied StickyLine"+" with id="+ grp.line.id+"</mark><br>"; 
      }
      text=text+"Relation: <i>alignement and distance with</i>:";
      for(let j=0;j<grp.shapes_g.length;j++){
        text=text+"<br>"+"- "+grp.shapes_g[j].className+" with id="+grp.shapes_g[j].id
      }
      text=text+"<br>Distance kept in memory:"
      //+grp.line.occupiedDistances+",<mark class='green'>"+grp.line.freeDistances+"</mark>";
      for(let i=0;i<grp.line.occupiedDistances.length;i++){
        text=text+grp.line.occupiedDistances[i].toFixed(1)+",";
      }
      text=text+"<mark class='green'>"
      for(let i=0;i<grp.line.freeDistances.length-1;i++){
        text=text+grp.line.freeDistances[i].toFixed(1)+",";
      }if(grp.line.freeDistances.length>0){
      text=text+grp.line.freeDistances[grp.line.freeDistances.length-1].toFixed(1);
      }
      text=text+"</mark>"
      
      
    this.narationHasBeenInitialized=true;
      this.$emit('explain',{origin:"Instrument - Reuse<br><mark class='blue'> The Stickyline preserves alignment and distances. </mark>",text:text});
      //In order to avoid the copy of things from one cell to another.
      //ContextMenu.props.CopiedShape=undefined;
    }
  },
  stopInitialisation(e){
      //this.narationHasBeenInitialized=true;
      //console.log(e)
      e.stopPropagation(); 
    },
},
};

</script>
<style>
#playground{
  cursor: default
}
#activeReuse{
  position:absolute;
  display: none;
  top: 0px;
  left: 0px;
  width: 60px;
  background-color: white;
  box-shadow: 0 0 5px grey;
  border-radius: 3px;
}
#center_menu{
  position: absolute;
  display: none;
  top: 0px;
  left: 0px;
  width: 60px;
  background-color: white;
  box-shadow: 0 0 5px grey;
  border-radius: 3px;
}
input{
  position:absolute;
  display: none;
  top:0px;
  left:0px; 
}
</style> 