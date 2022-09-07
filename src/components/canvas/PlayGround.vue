<template>

<!--Vue components for the playground-->

<div @click="HideContextMenu" id="playground">
  <ToolBar id="toolbar" :height="100" :width="400" 
  @need_new_shape="createNewShape" @eraser_is_selected="switchEraseMode"></ToolBar>
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
      <v-group ref="groups" v-for="step in groups" :key="step.id" :config="step">
      
      
      
        <v-rect
        v-for="item in step.shapes_g.filter(i=>i.className=='Rect')"
        :key="item.id"
        :config="item"
        
       
        @transformend="updateTransformedShape"
        @dragend= "updatePosInGrp($event,step.id) "
        @dragmove="onDragging"
        @dragstart=" initializeDragging"
        @mouseenter="showSelectedShape"
        @mouseout="unshowSelectedShape"
        />
        <v-circle
        v-for="item in step.shapes_g.filter(i=>i.className=='Circle')"
        :key="item.id"
        :config="item"

        @transformend="updateTransformedShape"
        @dragend="updatePosInGrp($event,step.id)"
        @dragmove="onDragging"
        @dragstart=" initializeDragging"
        @mouseenter="showSelectedShape"
        @mouseout="unshowSelectedShape"
        />
        <v-image
        v-for="item in step.shapes_g.filter(i=>i.className=='Image')"
        :key="item.id"
        :config="item"

        @transformend="updateTransformedShape"
        @dragend="updatePosInGrp($event,step.id)"
        @dragmove="onDragging"
        @dragstart=" initializeDragging"
        @mouseenter="showSelectedShape"
        @mouseout="unshowSelectedShape"
        />
        <v-text
        v-for="item in step.shapes_g.filter(i=>i.className=='Text')"
        :key="item.id"
        :config="item"

        @transformend="updateTransformedShape"
        @dragend="updatePosInGrp($event,step.id)"
        @dragmove="onDragging"
        @dragstart=" initializeDragging"
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
        @dragmove="onDragging"
        @dragstart=" initializeDragging"
        @mouseenter="showSelectedShape"
        @mouseout="unshowSelectedShape"
        />


        <v-rect
          v-for="item in step.ghosts.filter(i=>i.className=='Rect')"
          :key="item.id"
          :config="item"
        />
        <v-circle
          v-for="item in step.ghosts.filter(i=>i.className=='Circle')"
          :key="item.id"
          :config="item"
        />
        <v-image
          v-for="item in step.ghosts.filter(i=>i.className=='Image')"
          :key="item.id"
          :config="item"
        />
        <v-text
          v-for="item in step.ghosts.filter(i=>i.className=='Text')"
          :key="item.id"
          :config="item"
        />
        <v-regular-polygon
          v-for="item in step.ghosts.filter(i=>i.className=='Triangle')"
          :key="item.id"
          :config="item"
        />

        <v-line 
        :key="step.line.id"
        :config="step.line"
        @transformend="updateTransformedShape"
        @dragmove="updateGrp($event)"
        @mouseout="unshowSelectedShape"
        @mouseenter="showSelectedShape"
        />

        <v-circle
          v-for="item in step.line.positionPoints"
          :key="item.id"
          :config="item"
          
          @mouseenter="showSelectedShape"
          @mouseout="unshowSelectedShape"
          @dragend="updateFreePositionInGrp($event,step.id)" 
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
      @click="DisplayCenterMenu"
      />
    </v-layer>
  </v-stage>
  
  <div id="active">
    <ContextMenu :menu-of-stage="isStageOnlySelected" :menu-of-line=isALineSelected :menu-of-grouped-shape=isAGroupedShapeSelected :keep-distance-button-text="this.keepDistanceButtonText" 
    @keepdistance-button="switchStickylineMode"
    @copy-button="Copy" @copy-all-button="CopyAll" @past-button="Past"></ContextMenu>
  </div>

  <div id="center_menu">
    <CenterMenu :defaultAlignment="this.selectedShapeAlignment" @center-button="ChangeAlignCenter"></CenterMenu>
  </div>

  <input type="text" id="input" 
        size="10" value="a text"
       @keyup.enter="updateText"
  >

</div>
</template>

<script>
import ContextMenu from "@/components/interactive-components-for-canvas/ContextMenu.vue"
import CenterMenu from "@/components/interactive-components-for-canvas/CenterMenu.vue"
import ToolBar from "@/components/interactive-components-for-canvas/ToolBar.vue";

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
  components:{
    ContextMenu,
    CenterMenu,
    ToolBar,
},

  //Please read commentaries in order to undersand all parameters.
  data() {
    return {
      stageSize: {
        width: this.width,
        height: this.height,
      },

      lengthToCapture:10, //distance btw a shape and a stickyline from which the shape is considered as captured by the stickyline.
      lengthToDetach:15, //added distance between a shape and a stickyline when the shape is detached from the stickyline.
      editedText:null, //When we dbl click one a text to change it, this parameter is updated by taking data of the target text.

      eraseMode:0, //eraseMode=1 if the eraser is used, =0 otherwise.

      selectedShapeAlignment:'', //give the position of the selected object's center (Top, Middle or Bottom)

      neighbour:null, //closest neighbour of a selected shape which is attached to a stickyline.
      dist_with_neighbour:null, //distance between a selected attached shape and his closest neighbour
      
      needMenu: 'initial', //say if the context menu has to be "active" or not.
      isALineSelected:false, //say if a stickyline is selected or not
      isAGroupedShapeSelected:false, //say if a shape attached to a stickyline is selected
      isStageOnlySelected: false,//say if the selection is done on no shape or stickylines
      
      keepDistanceButtonText:"Liberate Distribution",//text which will appear on the button corresponding to the management of the distribution
      max_id_figures: 6, //max id among ids of shapes and stickylines since the canvas exist.

      //groups of shapes (a group contains a line with shapes on it)   
      groups:[{
        name: "group",
        className: "Group",
        id: '6',
        x:0,
        y:0,
        offsetX:0,
        offsetY:0,
        rotation: 0,
        draggable: false,
        shapes_g:[], //list of shapes that are on the line
        ghosts:[],/*Shadow of attached shapes created to show to the user the ouput 
        when it is dragging a shape on a stickyline with homogenous and equal distribution (ie keepDistribution=true)*/
        aShapeHasBeenDetach:0, /*=1 if a shape has been detach from the line when dragging it.
        It is used to not update a detached shape with the method updatePosInGrp (see the method in question)*/
        line:{
          x:200,
          y:200,
          points: [0, 0, 0, 0, 300, 0],
          positionPoints:[],/*List of "position points".A "position point" is a little circle (see the template positionPoint) 
          which shows a position (free or occupied) determined by a distance from the stickyline's center
          (see occupiedDistances and freeDistances).
          */
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
          name: "ligne",
          className: "Line",
          stroke: 'rgb(48,48,48)',
          id:'6',
          keepDistribution: true, /*if true, the distribution on the line is homogeneous and equal.
          If not, shapes can be move freely on the line and distances are kept in memory (see below)*/
          freeDistances:[], /*distance with the center of the line that can be taken by other shapes (if keepDistribution=false).
          It means that when we a new shape is attached, it will go to the position corresponding to
          one of the distances in freeDistances*/
          occupiedDistances:[], //distance with the center of the line already "taken" by shapes on the line.       
          keepDistanceButtonText:"Liberate Distribution",/*text which will appear 
          on the button of the context menu corresponding to the management of the distribution:*/
      
          defaultAlignment:"Middle",//text which describe the position of the center (Top,Middle or Bottom)
          dragBoundFunc: dragFunc,//function which determine how the line can be dragged
        },
      },
      {
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
        ghosts:[],
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
          name: "ligne",
          className: "Line",
          stroke: 'rgb(48,48,48)',
          id:'7',
          distShapesToCenter:[],
          keepDistribution: true,
          freeDistances:[],
          occupiedDistances:[],
          keepDistanceButtonText:"Liberate Distribution",
          defaultAlignment:"Middle",
          dragBoundFunc: dragFunc,
        },
      }],

      //transfomers which allow to modify size and rotation of shapes and stickyline
      transformers:[
        //transformer for stickyline
        {
          id: 'lineTransformer',
          enabledAnchors: ['middle-left', 'middle-right'],
          flipEnabled: false, // in order to not have a rotation of the transformer which lead to problem related to shapes position on a line
          nodes: [],

        },
        //transformer for shape
        {
          id: 'shapeTransformer',
          nodes: [],
        }
      ],

      //Shapes that are on the stage.
      shapes: [
        {
          rotation: 0,
          id: '1',
          x: 100,
          y: 10,
          width: 130,
          height: 100,
          scaleX: 1,
          scaleY: 1,
          opacity:1,
          strokeWidth: 0,
          stroke: 'black',
          fill: 'red',
          name: 'rect1',
          draggable: true,
          className:"Rect",
          isGrouped: 0, //if =0 the shape is not attached to a stickyline. if=1, it does.
          offsetX:130/2,
          offsetY:0,
          /*When it is on a line, a shape can be rotate by the user independently from the line.
          To keep the independant rotation of the attached shape, we add the parameter "personalRotation".
          So, when the shape is attached, its final rotation is the sum of this parameter with the rotation of the line.
          */
          personalRotation:0, 
          centerPosition:'Top',
          dragBoundFunc: dragFunc
          
        },
        
        {
          rotation: 0,
          id:'2',
          x: 150,
          y: 150,
          width: 100,
          height: 100,
          scaleX: 1,
          scaleY: 1,
          opacity:1,
          strokeWidth: 0,
          stroke: 'black',
          fill: 'green',
          name: 'rect2',
          draggable: true,
          className:"Rect",
          isGrouped: 0,
          dragBoundFunc: dragFunc,
          offsetX: 100/2,
          offsetY: 0,
          /*When it is on a line, a shape can be rotate by the user independently from the line.
          To keep the independant rotation of the attached shape, we add the parameter "personalRotation".
          So, when the shape is attached, is final rotation is the sum of this parameter with the rotation of the line.
          */
          personalRotation:0, 
          centerPosition:'Top',
        },

        {
          rotation:0,
          x: 300,
          y: 500,
          scaleX:1,
          scaleY:1,
          offsetX: 0,
          offsetY: -50,
          radius: 50,
          opacity:1,
          fill: 'orange',
          strokeWidth: 0,
          stroke: 'black',
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
          centerPosition:'Top',
        },

        {
          text: 'A text',
          rotation: 0,
          x: 400,
          y: 200,           
          scaleX:1,
          scaleY:1,
          offsetY:0,
          offsetX: 36,
          opacity:1,
          /*I cannot use height and width because otherwise they will fix the height
          and the width of the text box: We want a flexible box so that people can write the text they want.
          length_x and length_y are respectively the width and the height of the box.
          Those values will be update regarding the input text*/ 
          length_x:72,
          length_y:30,
          draggable: true,
          isGrouped: 0,
          className:"Text",    
          fontSize: 30,
          fontFamily: 'Calibri',
          /*When it is on a line, a shape can be rotate by the user independently from the line.
          To keep the independant rotation of the attached shape, we add the parameter "personalRotation".
          So, when the shape is attached, is final rotation is the sum of this parameter with the rotation of the line.
          */
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
          opacity:1,
          image: null,
          draggable: true,
          isGrouped: 0,
          className:"Image", 
              
          fontSize: 30,
          /*When it is on a line, a shape can be rotate by the user independently from the line.
          To keep the independant rotation of the attached shape, we add the parameter "personalRotation".
          So, when the shape is attached, is final rotation is the sum of this parameter with the rotation of the line.
          */
          personalRotation:0, 
          id:'5',
          dragBoundFunc:dragFunc,
          centerPosition:'Top',
        },
        {
          rotation: 0,
          id:'8',
          x: 300,
          y: 150,
          sides:3,
          radius:60,
          width: 120,
          height: 120,
          opacity:1,
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
          offsetY: 0,
          personalRotation:0, 
          centerPosition:'Middle',
        },{
          text: 'Try applying the 3 lenses \n to improve the playground :-) :\n analytical, critical and constructive',
          rotation: 0,
          x: 1250,
          y: 200,           
          scaleX:1,
          scaleY:1,
          offsetY:0,
          offsetX: 36,
          opacity:1,
          length_x:72,
          length_y:30,
          draggable: true,
          isGrouped: 0,
          className:"Text",    
          fontSize: 20,
          fontFamily: 'Calibri',
          personalRotation:0,
          id:'9',
          dragBoundFunc:dragFunc,
          centerPosition:'Top',
        },
      ],

      //circle which will represents the center of a selected object.
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
        visible: false,
      },

      //template to define a "position point" on the line
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
        dragBoundFunc:dragFunc,
      },
      selectedShapeId: '',
    };
  },
  mounted(){
    //We update length_x and length_y regarding the input text

    let texts=this.$refs.stage.getStage().getChildren()[0].getChildren().filter((r)=>r.attrs.className=='Text');
    let texts_data=this.shapes.filter((r)=>r.className=="Text")
    for(let i=0;i<texts_data.length;i++){
      texts_data[i].length_x=texts[i].width();
      texts_data[i].length_y=texts[i].height();
      texts[i].offsetX(texts_data[i].length_x/2);
      texts_data[i].offsetX=texts_data[i].length_x/2;
    }
  },

  created(){
    
    //We set the value of mx_id_figures
    this.max_id_figures=this.shapes.length +this.groups.length; 
    for(let i=0;i<this.groups.length;i++){
      this.max_id_figures= this.max_id_figures+this.groups[i].shapes_g.length;
    }
    
    //We set the image for the image shape already created on the canvas at the beginning.
    const image = new window.Image();
    image.src = require("@/assets/exsitu.png");

    
    image.height=150;
    image.width=150;
    //set image only when it is loaded
    image.onload = () => {
      this.shapes.find((r)=>r.className==="Image").image= image;
      this.shapes.find((r)=>r.className==="Image").offsetX=image.width/2;
      this.shapes.find((r)=>r.className==="Image").offsetY=0; 
    };
  },

  methods: {

    /*
    Method which switch the following modes: use of the eraser or not
    */
    switchEraseMode(){
      if(this.eraseMode==0){
        this.eraseMode=1;
        document.getElementById("playground").style.cursor='url('+require('@/assets/ugly_eraser.png')+'),default';
        this.center.visible=false;  
        this.eraseNodefromTransformer("shapeTransformer");
        this.eraseNodefromTransformer("lineTransformer");
      } else{
        this.eraseMode=0;
        document.getElementById("playground").style.cursor="default";
      }
    },

    /*
    Check if all shapes that are supposed to be on a line still in this line.
    If not, we remove them from the stickyline to recreate them on the stage.
    id_grp is the id of the group which contains the line.
    */
    checkIfShapesOnLine(id_grp){
      const grp= this.groups.find((r) => r.id===id_grp);
      const line=grp.line;
      const groupedShapes = grp.shapes_g;
      
     
      
      let i=0;
      while(i<groupedShapes.length){
       if(!this.isCoordinateOnLine(groupedShapes[i].x,groupedShapes[i].y,line.id)){
          //We erase ghosts or attached shapes and we make sure that their opacity is 1.
          grp.ghosts.splice(0,grp.ghosts.length);
          for (let i=0;i<groupedShapes.length;i++){
            groupedShapes[i].opacity=1;
          }

          console.log("a shape is not on a line");

          groupedShapes[i].dragBoundFunc= dragFunc;
          groupedShapes[i].isGrouped=0;
          if(line.keepDistribution){
            /*it is useless to keep position points when a shape is detach
            and the distribution on the stickyline is homegenous and equal(keepDistribution=1)*/
            line.positionPoints.splice(i,1)
          }
          this.shapes.push(groupedShapes[i],)
          line.freeDistances.push(line.occupiedDistances[i]);
          line.occupiedDistances.splice(i,1);
          groupedShapes.splice(i,1);
          
          //We make sure that the corresponding "position point" of the new free position 
          //is draggable and have the good drag bound func so that we can move it only on the line.
          if(!line.keepDistribution){
            this.updateAllPosInGrp(id_grp);     
            let positionPoint=line.positionPoints.find((r)=>r.distance_to_line_center==line.freeDistances[line.freeDistances.length-1]);
            positionPoint.draggable=true;
            this.updateDragFunc(positionPoint,line);
          }
        }else{
          i=i+1;
        }
      }
    },

    //Return a bollean to say if {x,y} is a point from the line or not.
    isCoordinateOnLine(x,y,id_grp){
      const grp=this.groups.find((r) => r.id===id_grp);
      const line=grp.line;
      let is_not_on_straight_line=true;

      //We determine de coefficients of the straight line where the stickyline is.
      let coord_y1=line.y-line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180));
      let coord_x1=line.x+line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180));
      let coord_y2= line.y+line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180));
      let coord_x2=line.x-line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180));
      let a=(coord_y1-coord_y2)/(coord_x2-coord_x1);
      let b=line.y-a*line.x;
      
      if(Math.abs(coord_x1-coord_x2)>1){
        is_not_on_straight_line=(Math.abs(a*x+b-y)>1);
      }else{
        /*if the difference between coord_x1 and coord_x2 is too big, it means that the stickyline
        is almost vertical. So to determine if a the point {x,y} is on the straight line of the stickyline
        we look only at the horitontal axis.
        */
        is_not_on_straight_line=(Math.abs(x-line.x)>1)
      }


      /*We now look if the point is not one of the straight line 
      or if it is outside the box determine by the coordinate of the extremities of the stickyline
      */
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

      
      )
      {
        return false; 
      } else{
        return true;
      }
    },

    //update a group corresponding to the one of the target stickyline (e.target)
    updateGrp(e){
      let id_grp=e.target.id();
      const grep=this.groups.find((r)=>r.id===id_grp);
      const line= grep.line;
      grep.offsetX=line.offsetX;
      grep.offsetY=line.offsetY;
      
      line.x=e.target.x();
      line.y=e.target.y();
      this.center.x=line.x;
      this.center.y=line.y;

      this.updateAllPosInGrp(line.id); 
      this.checkIfShapesOnLine(line.id);
    },


    //update the position of all shapes that are on the stickyline of the group with the id=id_grp.
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

          //We also update the position of the "position points" accordingly to the one of the attached shapes
          line.positionPoints[i].x=shapes_g[i].x;
          line.positionPoints[i].y=shapes_g[i].y;
          line.positionPoints[i].distance_to_line_center=shapes_g[i].distance_to_line_center;
      }
      /*If not all the "position points" have been update before, it means that they are "free distances"
      that need to be show by setting the position of those points.
      */
      let i=shapes_g.length;
      while(i<line.positionPoints.length){
        if(line.keepDistribution){
          //If we keep distribution there is no need for more positions points because there are not "free distances".
          line.positionPoints.splice(line.positionPoints.length-1,1);
        }else{
          line.positionPoints[i].x=line.x+line.freeDistances[i-shapes_g.length]*Math.cos(line.rotation*(Math.PI/180));
          line.positionPoints[i].y=line.y+line.freeDistances[i-shapes_g.length]*Math.sin(line.rotation*(Math.PI/180));
          line.positionPoints[i].distance_to_line_center=line.freeDistances[i-shapes_g.length];
          i++
        } 
      }
    },

    /*
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
    */
    
    //update the canvas
    update(){
      const shapes = this.shapes
      
      let is_on_straight_line=false;
      //For each shapes on the canvas we look if it is nearby a stickyline.
      for (let i=0;i<shapes.length;i++){
        let x=shapes[i].x;
        let y=shapes[i].y;
        for (let j=0;j<this.groups.length;j++){
      
          let line=this.groups[j].line;

          //as for isCoordinateOnLine we determine the coefficients of the straight line determined by the stickyline
          let coord_y1=line.y-line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180));
          let coord_x1=line.x+line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180));
          let coord_y2= line.y+line.points[4]*(1/2)*line.scaleX*Math.sin(line.rotation*(Math.PI/180));
          let coord_x2=line.x-line.points[4]*(1/2)*line.scaleX*Math.cos(line.rotation*(Math.PI/180));
          let a=(coord_y1-coord_y2)/(coord_x2-coord_x1);
          let b=line.y-a*line.x;

          if(Math.abs(coord_x1-coord_x2)>1){
            is_on_straight_line=(Math.abs(a*x+b-y)<=this.lengthToCapture);
          }else{
            //if the straight line is almost vertican we look only at the horizontal axis
            is_on_straight_line=(Math.abs(x-line.x)<=this.lengthToCapture);
          }
          /*We now look if the shape is on the straight line 
          and if it is inside the box determine by the coordinate of the extremities of the stickyline.
          If it is the case we add it to the group of the stickyline (see makeGroup).
          */
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

    //Called when the user start dragging a shape attached to the line.
    initializeDragging(e){
      //grp is the group of the target shape:
      
      let grp=this.groups.find((r)=>r.id==e.target.getParent().attrs.id);

      if(grp.shapes_g.length>1 && grp.line.keepDistribution==1){
        //the data of the neighbour of the target shape in the group grp.
        let neighbour=this.closestGroupedShape(grp,e);

        //the node corresponding to this neighbour
        this.neighbour=e.target.getParent().getChildren().find((r)=>r.attrs.id==neighbour.id);

        let position={x: e.target.x(),y: e.target.y()};

        //We create a ghosts of the neighbour of the target object to the position of this target object.
        this.createGhost(grp,position,this.neighbour)

        //We calculate the distance of the target shape with its neighbour
        this.dist_with_neighbour=this.distBtwShapes(e.target.attrs,this.neighbour.attrs);
      }
    },

    /*Give the closest shape that are attached to the group grp 
    compared to the position of a target shape e.target*/
    closestGroupedShape(grp,e){
      //When an attached shape has no opacity it means that it is not in the neighbourhood of the shape we drag.
      let neighbour=grp.shapes_g.find((r)=>r.id!=e.target.attrs.id && r.opacity!=0);
      for (let i=0;i<grp.shapes_g.length;i++){
        this.distBtwShapes(grp.shapes_g[i],e.target.attrs)
        if(this.distBtwShapes(grp.shapes_g[i],e.target.attrs)<this.distBtwShapes(neighbour,e.target.attrs)
        && grp.shapes_g[i].id!=e.target.attrs.id && grp.shapes_g[i].opacity!=0){
          neighbour=grp.shapes_g[i]
        }
      }
      
      return neighbour;
    },

    /*create a copy of the shape "neighbour" at the position "position"
    only if the distribution is kept on the stickyline of the group "grp"*/
    createGhost(grp,position,neighbour){
      if(grp.line.keepDistribution==1){
        let clone=neighbour.clone({
            id: 'clone'+neighbour.attrs.id,
            x:position.x,
            y:position.y,
            opacity:0,
            draggable:false,
        });
        grp.ghosts.push(clone.attrs,)
      }
    },

    //Give distance btw shape1 and shape2
    distBtwShapes(shape1,shape2){
      return Math.sqrt((shape2.y-shape1.y)**2+(shape2.x-shape1.x)**2);
      
    },

    /*Give distance btw a shape (considered as the start point when dragging)
    and the position of the actual target node which is dragged (e.target)*/
    distFromStartPoint(shape,e){
      return Math.sqrt((shape.y-e.target.y())**2+(shape.x-e.target.x())**2);
    },

    /*
    targetNeighbour(e){
      let grp= this.groups.find((r)=>r.id===e.target.getParent().attrs.id);
      let shape=grp.shapes_g.find((r)=>r.id==e.target.attrs.id)
      let index=grp.shapes_g.indexOf(shape);
      if(index==0){
        return grp.shapes_g[1];
      } else if(index==grp.shapes_g.length-1){
        return grp.shapes_g[index-1]
      } else{
        let distRight=this.distBtwShapes(e.target.attrs,grp.shapes_g[index+1]);
        let distLeft=this.distBtwShapes(e.target.attrs,grp.shapes_g[index-1]);
        if(distRight>distLeft){
          return grp.shapes_g[index-1];
        } else{
          return grp.shapes_g[index+1];
        }
      }
    },
    */

    //Called "continuously" when the user drag a shape which is on a stickyline.
    onDragging(e){
      
      let grp=this.groups.find((r)=>r.id===e.target.getParent().attrs.id);
      let shape= grp.shapes_g.find((r)=>r.id==e.target.id());
      
      
      //if we keep distribution on the stickyline, we will show to the user the output with ghost-shapes when dragging a shape on the line
      if(grp.line.keepDistribution==1 && grp.shapes_g.length>1){

        //"ghost" of the current neighbour
        let clone=grp.ghosts.find((r)=>r.id==('clone'+this.neighbour.attrs.id))

        let neighbour=grp.shapes_g.find((r)=>r.id===this.neighbour.attrs.id);
        
        //if there is more than one shape on the stickyline and if the dragged shape is not outside the stickyline
        if(grp.shapes_g.length>1 && this.isCoordinateOnLine(e.target.x(),e.target.y(),grp.id)){

          //Distance between the position of the shape before being dragged and its actual position.
          //let distFromStart= this.distFromStartPoint(shape,e);

          //distance between shapes on the stickyline where they are equaly and homogeneously distributed.
          let dist_btw_shapes=grp.line.points[4]*grp.line.scaleX/(grp.shapes_g.length-1);
          
          
          //if the closest shape from the dragged shape change
          if(this.closestGroupedShape(grp,e).id!=this.neighbour.attrs.id){
            
            let position;

            /*If the opacity of the neighbour is null in its current state, 
            it means that its place is currently considered as the one of the object we drag.*/
            if(this.neighbour.attrs.opacity==0){
              position={x: neighbour.x,y: neighbour.y};
            }else{
              position={x: shape.x,y: shape.y};
            }

            /*if the change of the closest shape has been made without fully make appear the ghost-shape
            of the previous closest shape, we can erase this ghost-shape.
            If not, it means that the dragged shape can take the position of the previous neighbour.
            And the previous neighbour can take the one of its clone*/
            if(clone.opacity<1 /*&& distFromStart<=(grp.line.points[4]*grp.line.scaleX/2)*/){
              grp.ghosts.splice(grp.ghosts.indexOf(clone),1)
            }
            else{ 
              shape.x=neighbour.x;
              shape.y=neighbour.y;
              neighbour.x=clone.x;
              neighbour.y=clone.y;
              neighbour.opacity=1;
              grp.ghosts.splice(grp.ghosts.indexOf(clone),1)
              this.sortByDistToLineCenter(grp) // in order to sort attached shapes because the position of one of them has been update
            }
            
            //We consider the new neighbour (ie the new closest shape) and create its ghost-shape.
            this.neighbour=e.target.getParent().getChildren().find((r)=>r.attrs.id==this.closestGroupedShape(grp,e).id); 
            this.createGhost(grp,position,this.neighbour)
            clone=grp.ghosts.find((r)=>r.id==('clone'+this.neighbour.attrs.id))  
          }

          /*Distance between the position of the shape before being dragged 
          (or the new position it took from its previous neighbour) 
          and its actual position.*/
          let distFromStart= this.distFromStartPoint(shape,e)

          this.dist_with_neighbour=this.distBtwShapes(e.target.attrs,this.neighbour.attrs);

          //We update the opacity of the neighbour and its ghost regarding how the dragged shape is moving.
          let x=distFromStart/dist_btw_shapes;
          let opacity_change=x;
          if (x>=0.3){
            opacity_change=0.3;
          }
          if(x>=1){
            opacity_change=1;
          }
          clone.opacity=opacity_change;
          this.neighbour.opacity(1-1*opacity_change)
          neighbour=grp.shapes_g.find((r)=>r.id===this.neighbour.attrs.id);
          neighbour.opacity=1-1*opacity_change

        }else{
          for (let i=0;i<grp.shapes_g.length;i++){
            grp.shapes_g[i].opacity=1;
          }
          clone.opacity=0;
        }
      }

      //distance btw the mouse pointer and the target shape (e.target)
      let dist=Math.sqrt((e.target.getStage().getPointerPosition().y-e.target.y())**2+(e.target.getStage().getPointerPosition().x-e.target.x())**2);
      
      // We substrate dist by the height of the shape.
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
      
      //if dist>50, we consider that the user want to detach the shape.
      if (dist>50){
        this.groups.find((r)=>r.id===e.target.getParent().attrs.id).aShapeHasBeenDetach=1;
        this.DetachShape(shape,e.target.getStage().getPointerPosition().x,e.target.getStage().getPointerPosition().y); 
      }
    },

    //Give the sign of the distance of a shape from the center of a line.
    GiveSignOfDistance(shape,line){
      let result;
      let angle=line.rotation*(Math.PI/180);
      let distX=shape.x-line.x;
      let distY=shape.y-line.y;
      
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

    /*Different from the previous function because 
    the straight line where the center is, is perdendicular to the stickyline.
    The center is the one of an attached shape (ie "shape" argument)*/
    GiveSignOfDistanceBtwCenterAndShape(center,shape){
      let result;
      let angle=shape.rotation*(Math.PI/180);
      let distX=center.x-shape.x;
      let distY=center.y-shape.y;

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
      line.freeDistances.sort(this.isSmaller); //we will give the shortest available distance to the added shape (if keepDistribution=0)
      shapes.sort(this.isBeforeRegardingX);

      for (let i=0;i<shapes.length;i++){
        if(shapes[i].isGrouped==1){
          // we will create a "position point" for the position of the added shape (if necessary)
          const positionPoint=Object.assign({},this.positionPoint); 

          let distX=shapes[i].x-line.x;
          let distY=shapes[i].y-line.y; 
          shapes[i].personalRotation=0;
          shapes[i].distance_to_line_center=this.GiveSignOfDistance(shapes[i],line)*Math.sqrt((distX)**2+(distY)**2);
          /*If the distance is a little bit to far from the center 
            we adjust it so that the shape can be at one of the border of the stickyline*/
            if(Math.abs(shapes[i].distance_to_line_center)>=line.points[4]*line.scaleX/2){
              shapes[i].distance_to_line_center=Math.sign(shapes[i].distance_to_line_center)*line.points[4]*line.scaleX/2
            }
          /*We give to the center of the added shape the position determined 
          by the default alignment position of the stickyline (Top,Middle or Bottom)*/
          this.ChangeCenterRegardingCommand(shapes[i].id,grp.line.defaultAlignment);

          /*If we keep distances in memory and that there are available distances,
          we give the corresponding position to the added shape*/
          if(!line.keepDistribution && line.freeDistances.length>0){
            /*We take the indice of the free distance which corresponds
            to the nearest available position from the added shape (shapes[i])*/
            let indice=this.isNearest(line,shapes[i]);
            this.updateDragFunc(shapes[i],line);

            //We add the shape to the group.
            grp.shapes_g.push(shapes[i],);

            //The chosen free distance is now an occupied one.
            grp.line.occupiedDistances.push(grp.line.freeDistances[indice]);
            grp.line.positionPoints.find((r)=>r.distance_to_line_center==grp.line.freeDistances[indice]).draggable=false;
            grp.line.freeDistances.splice(indice,1);
          }else{
            this.updateDragFunc(shapes[i],line);
            grp.shapes_g.push(shapes[i],);
            grp.line.occupiedDistances.push(shapes[i].distance_to_line_center,);

            //We create a new "position point" on the stickyline.
            positionPoint.id="positionPoint"+grp.id+grp.line.positionPoints.length;
            grp.line.positionPoints.push(positionPoint,);
          }
          console.log("A new shape has been added with a distance"+shapes[i].distance_to_line_center);
          this.updateOccupiedDistance(line.id);
          

          this.updateAllPosInGrp(id_grp);
          shapes.splice(i,1);
        }
      }
      this.center.x=line.x;
      this.center.y=line.y;
    },

    /*update the occupied distance corresponding to each attached shape
    First we sort the attached shapes by their distance to the line
    Then, we update the list which contains the occupied distances.
    The attached shapes and their occupied distances share the same index in their respective list
    */
    updateOccupiedDistance(id_grp){
      
      const grp=this.groups.find((r)=> r.id===id_grp);
      this.sortByDistToLineCenter(grp);
      
      /*If distribution is kept, we calculate the occupied distances of each shape
      in order to keep the distribution*/
      if(grp.line.keepDistribution){
        let L=grp.line.points[4];
        let nb_shapes=grp.shapes_g.length;
        let d=(L/(nb_shapes-1))*grp.line.scaleX; //Distance btw shapes

        if(nb_shapes%2==0){ 

          for (let i =1;i<=nb_shapes/2-1;i++){
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
      //if only distance is kept, we sort the occupied distances in the ascending order.
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

    /*
    //deprecated
    updateOccDist(grp,shape){
      let res=this.isNearest(grp.line,shape);
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

      }else{

        grp.shapes_g.find((r)=>r.id==shape.id).distance_to_line_center=grp.line.occupiedDistances[res.indice];
        grp.line.occupiedDistances.splice(res.indice,1);  
        this.updateOccDist(grp,grp.shapes_g[res.indice]);

      }
    },
    */

    /*
    Give the indice of the nearest distance in the freeDistances list of a line
    from the distance between a shape and the line center 
    */
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
          ecart_min=ecart;
          indice=i;
        }
      }
      return indice;    
    },

    /*
    Sort attached shapes of the group given in argument regarding their distance to the stickyline's center
    */
    sortByDistToLineCenter(grp){ 

      /*If the stickyline keep distribution,
      we first update the value of distance_to_line_center of each attached shapes.*/
      if(grp.line.keepDistribution){
        for (let l=0;l<grp.shapes_g.length;l++){
            let distX=grp.shapes_g[l].x-grp.line.x;
            let distY=grp.shapes_g[l].y-grp.line.y;
            grp.shapes_g[l].distance_to_line_center=this.GiveSignOfDistance(grp.shapes_g[l],grp.line)*Math.sqrt((distX)**2+(distY)**2);
          }
      }
      

      for(let i=1;i<grp.shapes_g.length;i++){
        let shape=grp.shapes_g[i];
        let j=i
        while(j>0 && grp.shapes_g[j-1].distance_to_line_center>shape.distance_to_line_center){
          grp.shapes_g[j]=grp.shapes_g[j-1];
          j=j-1;
        }
        grp.shapes_g[j]=shape;
      }
    },

    /*
    update the drag function of a shape regarding a line
    (which is supposed to be the one it is attached to).
    The drag function is updated so that the user can only drag an attached shape
    regarding the straight line of the stickyline.
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
        /*We prefer, in this case, moving the shape of the line 
        regarding the y of the mouse position instead of the x.
        So that the user can move the shape more intuitively*/
        shape.dragBoundFunc= function (pos) {
          return {
            x: line.x-(pos.y-line.y)*Math.cos(angle),
            y: line.y-(pos.y-line.y)*Math.sin(angle),
          };
        }
      } else if (angle<-Math.PI/2 && angle>=-3*Math.PI/4){
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
      } else if (angle<=Math.PI && angle>=3*Math.PI/4){
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
      } else if (angle<Math.PI/4 && angle>=0){
        shape.dragBoundFunc= function (pos) {
          return {
            x: line.x+(pos.x-line.x)*Math.cos(angle),
            y: line.y+(pos.x-line.x)*Math.sin(angle),
          };
        }
      }
    },

    /*
    Called when the user is dragging a free shape.
    Update the potision of the shape.
    */
    updatePos(e){
      const shape = this.shapes.find(i => i.id === e.target.id());
      shape.x=e.target.x();
      shape.y=e.target.y();

      /*We also update the circle that represent the centers of objects
      so that it can follow the shape when it is dragged*/
      this.center.x=e.target.x();
      this.center.y=e.target.y(); 

      /*
      let pos = { x: shape.x, y: shape.y };
      e.target.position(pos);
      e.target.getLayer().batchDraw();
      */
      
    },

    /*
    Called after a shape attached to a line (from the group with id=id_grp)has been dragged.
    Update the position of the shape.
    */
    updatePosInGrp(e,id_grp){
      let distX;
      let distY;
      let distance_to_line_center;
      const grp=this.groups.find((r)=> r.id===id_grp);
      
      /*If the shape the user dragged as been considered as detach from the line,
      we have no update to do because the shape as been removed from the list 
      of attached shapes of the group.
      */
      if(grp.aShapeHasBeenDetach==1){
        grp.aShapeHasBeenDetach=0;
        return;
      }
      
      const line=grp.line;
      const shape = grp.shapes_g.find(i => i.id === e.target.id());
      const shapes_g = grp.shapes_g; 

      /*If the line keep distribution, the treartment is different because
      attached shapes can switch their position*/
      if(line.keepDistribution){

        /*We erase all the ghost-shapes and make sure that all shapes have full opacity.
        We also reset the data of th evue component which contains 
        the actual target neighbour when dragging an atatched shape*/
        grp.ghosts.splice(0,grp.ghosts.length);
        for(let i=0;i<shapes_g.length;i++){
          shapes_g[i].opacity=1;
        }
        this.neighbour=null;
        
        /*If the shape still on the line after the user dragged it,
        we see if we need to switch its position with another one*/
        if(this.isCoordinateOnLine(e.target.x(),e.target.y(),line.id)){

          distX=shape.x-e.target.x();
          distY=shape.y -e.target.y();

          let L=grp.line.points[4];
          let nb_shapes=grp.shapes_g.length;
          let d=(L/(nb_shapes-1))*grp.line.scaleX; // Distance btw attached shape to keep distribution
          let dist=Math.sqrt(distX**2 +distY**2);// traveled distance since the user started dragging the shape.

          /*If the traveled distance is greater than the distance btw attached shapes
          we switch position of shapes by changing their order in the list shapes_g (see updateOccupiedDistance Method)*/
          if(dist>=d){

            shape.x=e.target.x();
            shape.y=e.target.y();
            this.updateOccupiedDistance(line.id)

            //We also update the dragged shape's position:
            shape.x=line.x+line.occupiedDistances[shapes_g.indexOf(shape)]*Math.cos(line.rotation*(Math.PI/180));
            shape.y=line.y+line.occupiedDistances[shapes_g.indexOf(shape)]*Math.sin(line.rotation*(Math.PI/180));
            shape.distance_to_line_center=line.occupiedDistances[shapes_g.indexOf(shape)];
            shape.rotation=line.rotation;

            /*These changements have a consequence on all the attached shape of the line
            That is way we have to update the state of all of them with the method updateAllPosInGrp*/
            this.updateAllPosInGrp(line.id);

          }else{

            shape.x=line.x+line.occupiedDistances[shapes_g.indexOf(shape)]*Math.cos(line.rotation*(Math.PI/180));
            shape.y=line.y+line.occupiedDistances[shapes_g.indexOf(shape)]*Math.sin(line.rotation*(Math.PI/180));
            shape.distance_to_line_center=line.occupiedDistances[shapes_g.indexOf(shape)];
            shape.rotation=line.rotation;

          } 

        }else{
          /*If the shape has been dragged outside the line, we give to him to position where it has been dragged.  */
          shape.x=e.target.x();
          shape.y=e.target.y();
        }

        //We also update the position point corresponding to te shape.
        line.positionPoints[grp.shapes_g.indexOf(shape)].x=shape.x;
        line.positionPoints[grp.shapes_g.indexOf(shape)].y=shape.y;
        line.positionPoints[grp.shapes_g.indexOf(shape)].distance_to_line_center=shape.distance_to_line_center; 
      
      } else{
        // If the line kept only distances, we update the shape as the user movement impose it.

        line.positionPoints[grp.shapes_g.indexOf(shape)].x=shape.x;
        line.positionPoints[grp.shapes_g.indexOf(shape)].y=shape.y;
        shape.x=e.target.x();
        shape.y=e.target.y();
        
        //We calculate the new distance with the line's center.
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
        line.positionPoints[grp.shapes_g.indexOf(shape)].distance_to_line_center=shape.distance_to_line_center;
      
      }

      let pos = { x: shape.x, y: shape.y };

      //We update the position of the center
      this.center.x=shape.x;
      this.center.y=shape.y;

      /*Here, we have to precise the position of the konva node corresponding to the dragged shape.
      Indeed, if distribution is kept, the distance with the line center and so the position
      on the line is imposed to the user: When he drag an attached shape, the position of the node is changing regarding its movement.
      But if we want to impose a position we have to update the node (in addition to the data of the object)*/
      e.target.position(pos);
      e.target.getLayer().batchDraw();

      // If the shape is not on the line, we can remove it and recreate it as a free shape on the stage.
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
          /*If we don't keep distribution, we update the "occupied distance"
          of the shape with the ditance btw the shape and the line's center we calculate before */
          grp.line.occupiedDistances[shapes_g.indexOf(shape)]=distance_to_line_center;
        }else{
          grp.line.occupiedDistances[shapes_g.indexOf(shape)]=shape.distance_to_line_center;
        }
        
        //We update the position point associated to the dragged shape.
        line.positionPoints[grp.shapes_g.indexOf(shape)].x=shape.x;
        line.positionPoints[grp.shapes_g.indexOf(shape)].y=shape.y;
        line.positionPoints[grp.shapes_g.indexOf(shape)].distance_to_line_center=shape.distance_to_line_center;
        
      }   

      if(line.keepDistribution){
        this.updateOccupiedDistance(line.id);
      }
      
      this.updateAllPosInGrp(line.id);

      //If we keep the distance in memory we make sure that if there is a new free position, 
      //the corresponding "position point" is draggable and have the good drag bound func 
      //so that we can move it only on the line.
      if(!line.keepDistribution && line.freeDistances.length>0){
        let positionPoint=line.positionPoints.find((r)=>r.distance_to_line_center==line.freeDistances[line.freeDistances.length-1]);
        
        if(positionPoint.draggable==false){
          positionPoint.draggable=true;
          this.updateDragFunc(positionPoint,line);
        }
      }
    },

    updateFreePositionInGrp(e,id_grp){
      let grp=this.groups.find((r)=>r.id==id_grp);
      let positionPoint=grp.line.positionPoints.find((r)=>r.id==e.target.attrs.id);
      let index=grp.line.freeDistances.indexOf(positionPoint.distance_to_line_center);
      let dist=this.GiveSignOfDistance({x: e.target.x(),y:e.target.y()},grp.line)*this.distBtwShapes({x: e.target.x(),y:e.target.y()},grp.line);
      
      if(dist!=grp.line.freeDistances[index]){
        if(Math.abs(dist)>grp.line.points[4]*grp.line.scaleX/2){
          dist=Math.sign(dist)*grp.line.points[4]*grp.line.scaleX/2;
        }
        grp.line.freeDistances[index]=dist;
        this.updateAllPosInGrp(id_grp);
      }

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

      //if the transformed object is a stickyline
      if(e.target.className=="Line"){
        const grp=this.groups.find((r)=> r.id===shape.id);

        if(shape.keepDistribution){

          //We update distances on the line in case it has been resize
          for (let i=0;i<shape.occupiedDistances.length;i++){
            shape.occupiedDistances[i]=(shape.occupiedDistances[i]/last_scaleX)*shape.scaleX;
          }
          
          //We do all the necessary update as consequence.
          this.update();
          this.updateGrp(e);
          this.checkIfShapesOnLine(this.selectedShapeId); 

        }else{
          
          //if the line has been resize
          if(last_scaleX!=shape.scaleX){

            //If the line has been resize, we update the distances from the shapes to the center of the line 
            for(let i=0;i<grp.shapes_g.length;i++){
              
              let distX=grp.shapes_g[i].x-shape.x;
              let distY=grp.shapes_g[i].y-shape.y;
              
              if(Math.sign(grp.line.occupiedDistances[i])==0){
                
                grp.line.occupiedDistances[i]=this.GiveSignOfDistance(grp.shapes_g[i],shape)*Math.sqrt((distX)**2 +(distY)**2);
              
              }else{
                grp.line.occupiedDistances[i]=Math.sign(grp.line.occupiedDistances[i])*Math.sqrt((distX)**2 +(distY)**2);
              }

              
              if(Math.sign((grp.shapes_g[i].x-last_shapex))!=Math.sign(distX) && Math.sign((grp.shapes_g[i].x-last_shapex))!=0 && grp.line.rotation!=90 && grp.line.rotation!=-90){
                
                grp.line.occupiedDistances[i]=-grp.line.occupiedDistances[i];
              }
              if(Math.sign((grp.shapes_g[i].y-last_shapey))!=Math.sign(distY) && Math.sign((grp.shapes_g[i].y-last_shapey))!=0 && (grp.line.rotation==90 || grp.line.rotation==-90)){
                grp.line.occupiedDistances[i]=-grp.line.occupiedDistances[i];
              }

            }
            
            //We update also "free distances"
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

          //We do the necessary update as consequences.
          this.update();
          this.updateGrp(e);
          this.checkIfShapesOnLine(this.selectedShapeId);

          // We now see if freeDistances need to be deleted(so if they are bigger than the half of the stickyline);
          let i=0;
          while(i<shape.freeDistances.length){
            if((1/2)*((shape.points[4])*shape.scaleX)+2<Math.abs(shape.freeDistances[i])){
              let corresponding_positionPoint=shape.positionPoints.find((r)=>r.distance_to_line_center==shape.freeDistances[i])
              let index=shape.positionPoints.indexOf(corresponding_positionPoint);
              shape.positionPoints.splice(index,1);
              shape.freeDistances.splice(i,1);
            }else{
              i=i+1;
            }
          }
        }
        //another necessary update
        for(let i=0;i<grp.shapes_g.length;i++){
            
          this.updateDragFunc(grp.shapes_g[i],shape);

        }
        for(let i=0;i<grp.line.positionPoints.length;i++){
            
          this.updateDragFunc(grp.line.positionPoints[i],shape);

        }

      }else if(res.grp_id!='-1'){
        //In this case, the object that has been transformed is not a stickyline

        /*res.grp_id!=-1 means that the shape that has been find with 
        the method findShape is part of group with id=res.grp_id*/

        this.groups.find((r)=>r.id===res.grp_id).shapes_g.find((r)=>r.id===e.target.id()).personalRotation=e.target.rotation()-e.target.getParent().attrs.line.rotation;
        

        this.updateAllPosInGrp(res.grp_id);
        this.updateOccupiedDistance(res.grp_id);
        
        /*We actualize the target node in order to no wait actualization of the DOM regarding vue component's data 
        to show the shape at the good position.*/
        e.target.x(e.target.getParent().attrs.shapes_g.find((r)=>r.id===e.target.id()).x);
        e.target.y(e.target.getParent().attrs.shapes_g.find((r)=>r.id===e.target.id()).y);
        //this.groups.find((r)=>r.id===res.grp_id).shapes_g.find((r)=>r.id===e.target.id()).personalRotation=e.target.rotation()-e.target.getParent().attrs.line.rotation;
        
        //this.updateAllPosInGrp(res.grp_id);
        this.checkIfShapesOnLine(res.grp_id);
        this.updateDragFuncOfCenter(); 
      
      }
      else{
        this.update();
        this.updateDragFuncOfCenter();
      }

      //We update the center position
      this.center.x=e.target.attrs.x;
      this.center.y=e.target.attrs.y;
    },
    
    /*
    Called when we touch anything on the stage (including nothing).
    In particular, it put a transformer if the target can be transform.
    If we are in "eraser mode", this method call the method eraserAction.
    */
    handleTransformation(e) {
      document.getElementById("input").style.display="none"; //if the input for modifying the text is here, we make it disappear

      //for prevention
      if (e.evt==undefined) {
        return;
      }
      //if we are in "eraser mode", we call the method eraserAction on the target.
      if(this.eraseMode==1){
        this.eraserAction(e);
        return;
      }
      
      //If we click on the stage, we have to remove the transformer from the node where it was.
      if (e.target === e.target.getStage()) {
        this.selectedShapeId = 'NoId';
        this.eraseNodefromTransformer("lineTransformer");
        this.eraseNodefromTransformer("shapeTransformer");
        this.center.visible=false;
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

      //if we click on the center or "position points" we do nothing.
      if(e.target.attrs.id=="center" || e.target.attrs.className=="positionPoint"){
        return;
      }

      //if it is a line, we need the transformer dedicated to the line (ie transformer with id="lineTransformer")
      //if it is a classic shape, we need the transformer dedicated to the shape (ie transformer with id="shapeTransformer")
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
        this.center.visible=true; // We make the center visible on the target shape
        this.updateTransformer(transformer_id); //We update the transformer
      } else{
        this.selectedShapeId = 'NoId';
      }
      
      this.updateDragFuncOfCenter() //We update the drag function of the center accordingly to the target shape's orientaion.
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
      let transformerNode = stage.find("#"+transformer_id)[0];
      let selectedNode;
      if (transformer_id=="lineTransformer"){
        //if the transformer is the one for stickylines, it means that the selectedNode has to be a stickyline
        selectedNode = stage.children[0].getChildren().filter((r)=> r.attrs.className=="Group" && r.attrs.id==this.selectedShapeId)[0]
        .getChildren().filter(r=>r.attrs.className=="Line" && r.attrs.id==this.selectedShapeId)[0];
      }else{
        selectedNode = stage.children[0].getChildren().filter((r)=>r.attrs.className!="Group" && r.attrs.id==this.selectedShapeId)[0];

        let isFunded=true;
        if(selectedNode==undefined){
          isFunded=false;
        }
        let i=0;

        //If we selectedNode is undefined it means that the selected node is an atttached shape and not a free one.
        //The follow loop is executed in order to find this node.
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

    //Called to display the center menu
    DisplayCenterMenu(e){
      CenterMenu.props.ConcernedShape=e.target;
      document.getElementById("center_menu").style.display="initial";
      document.getElementById("center_menu").style.top=document.getElementById("playground").getBoundingClientRect().top+document.documentElement.scrollTop+e.target.getStage().getPointerPosition().y+"px";
      document.getElementById("center_menu").style.left=document.getElementById("playground").getBoundingClientRect().left+document.documentElement.scrollLeft+e.target.getStage().getPointerPosition().x+"px";
    },

    /*display context menu according to the target
    This method is called when the contextMenu event occur*/
    DisplayContextMenu(e){

      e.evt.preventDefault() //This line allow to not show the context menu of the web browser
      

      //The context menu that is shown depends on the target
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
        document.getElementById("active").style.display="initial";
        document.getElementById("active").style.top=document.getElementById("playground").getBoundingClientRect().top+document.documentElement.scrollTop+e.target.getStage().getPointerPosition().y+70+"px";
        document.getElementById("active").style.left=document.getElementById("playground").getBoundingClientRect().left+document.documentElement.scrollLeft+e.target.getStage().getPointerPosition().x-50+"px";
    
      }
      if (e.target === e.target.getStage()) {
        this.needMenu=true;
        this.isALineSelected=false;
        this.isAGroupedShapeSelected=false;
        this.isStageOnlySelected=true;
        document.getElementById("active").style.display="initial";
        document.getElementById("active").style.top=document.getElementById("playground").getBoundingClientRect().top+document.documentElement.scrollTop+e.target.getStage().getPointerPosition().y+70+"px";
        document.getElementById("active").style.left=document.getElementById("playground").getBoundingClientRect().left+document.documentElement.scrollLeft+e.target.getStage().getPointerPosition().x-50+"px";
    
      }
    },

    //hide context menu
    HideContextMenu(){
      this.needMenu=false;
      document.getElementById("active").style.display="none";
      document.getElementById("center_menu").style.display="none";
    },



    
    /*
    //deprecated
    ChangeShapeCenter(shape){
        if(shape.className=="Rect") {
          if(shape.offsetX==shape.width/2 && shape.offsetY==0){
            shape.offsetX=shape.width/2;
            shape.offsetY=shape.height/2;
          }else if(shape.offsetX==shape.width/2 && shape.offsetY==shape.height/2){
            shape.offsetX=shape.width/2;
            shape.offsetY=shape.height;
          }
          else if(shape.offsetX==shape.width/2 && shape.offsetY==shape.height){
            shape.offsetX=shape.width/2;
            shape.offsetY=0;
          }
        }
        else if(shape.className=="Circle") {
          if(shape.offsetX==0 && shape.offsetY==-shape.radius){
            shape.offsetX=0;
            shape.offsetY=0;
          }else if (shape.offsetX==0 && shape.offsetY==0){
            shape.offsetX=0;
            shape.offsetY=shape.radius;
          }else{
            shape.offsetX=0;
            shape.offsetY=-shape.radius;
          }
        }
        else if(shape.className=="Text") {
          if(Math.abs(shape.offsetX-shape.length_x/2)<=1 && shape.offsetY==0){
            shape.offsetX=shape.length_x/2;
            shape.offsetY=shape.length_y/2;
          }else if (Math.abs(shape.offsetX-shape.length_x/2)<=1 && Math.abs(shape.offsetY-shape.length_y/2)<=1){
            shape.offsetX=shape.length_x/2;
            shape.offsetY=shape.length_y;
          }else{
            shape.offsetX=shape.length_x/2;
            shape.offsetY=0;
          }
        }
        else if(shape.className=="Image") {
          if(shape.offsetX==shape.image.width/2 && shape.offsetY==0){
            shape.offsetX=shape.image.width/2;
            shape.offsetY=shape.image.height/2;
          }else if (shape.offsetX==shape.image.width/2 && shape.offsetY==shape.image.height/2){
            shape.offsetX=shape.image.width/2;
            shape.offsetY=shape.image.height;
          }else{
            shape.offsetX=shape.image.width/2;
            shape.offsetY=0;
          }
        }

    },
    */

    /*This method is call after the center has been draging.
      It update the position of the center of selected shape according to the position of the center (the object) on the shape.
    */
    ChangeCenter(e){

      let res=this.findShape(this.selectedShapeId);
      let shape=res.shape_data;
      let threshold1;
      let threshold2;

      //dist btw the center (the object) and the center of the selected shape.
      let dist=this.GiveSignOfDistanceBtwCenterAndShape(e.target.attrs,shape)*Math.sqrt((e.target.y()-(shape.y))**2+(e.target.x()-shape.x)**2)+shape.offsetY*shape.scaleY;
      
      //let last_offsetX=shape.offsetX;
      let last_offsetY=shape.offsetY;
      if(shape==undefined){

        //if shape is undefined, the selected shape has to be a stickyline
        shape=this.groups.find((r)=>r.id==this.selectedShapeId).line;

      }else{
          //The calcultation to set position of the center depends on the type of shapes.
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

          /*We update the position of the selected shape so that the change of position for the center 
          doesn't give the impression to the user that the shape is moving.*/
          shape.y=shape.y-(last_offsetY-shape.offsetY)*shape.scaleY*Math.cos(shape.rotation*(Math.PI/180));
          shape.x=shape.x+(last_offsetY-shape.offsetY)*shape.scaleY*Math.sin(shape.rotation*(Math.PI/180));

          this.selectedShapeAlignment=shape.centerPosition;

          
          if (res.grp_id!='-1'){
            this.updateAllPosInGrp(res.grp_id);
          }
          
          /*To be sure that the shape is shown at the good position instead of waiting the reactualizatipon of the DOM
          regarding the vue component's data*/
          e.target.x(shape.x);
          e.target.y(shape.y);   
      }
    },


    /*Called when the event center-button is emitted by the vue component CenterMenu.
    This event is emitted with a string (align_choice) which contains the chosen position for the center */
    ChangeAlignCenter(align_choice){

      let center=CenterMenu.props.ConcernedShape;
      let grp=this.groups.find((r)=>r.id===this.selectedShapeId);
      let shape;

      //If the selected "shape" is actually a Stickyline
      if(grp!=undefined){

        //We change center's position of all attached shapes of the group grp.
        for(let i=0;i<grp.shapes_g.length;i++){
          this.ChangeCenterRegardingCommand(grp.shapes_g[i].id,align_choice)
        }

        /*update position of the center object
        You can not that we doesn"t really need to save it in the vue commnent's data
        because its position is always updated when we select an object or drag something. */
        center.x(grp.line.x);
        center.y(grp.line.y);

        if(grp.line.defaultAlignment==align_choice){
          /*If we select again the same align_choice, we deselect it, no alignement center is fixed
          by default for new attached shapes.*/
          grp.line.defaultAlignment='' 
        }else{
          grp.line.defaultAlignment=align_choice;
        }
        this.selectedShapeAlignment=grp.line.defaultAlignment;

      }else{
        shape=this.findShape(this.selectedShapeId).shape_data;
        this.ChangeCenterRegardingCommand(shape.id,align_choice)
        this.selectedShapeAlignment=shape.centerPosition;

        //update position of the center object
        center.x(shape.x);
        center.y(shape.y);
      }
    },

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
    },

    /*update the drag bound func of the center (the object)*/
    updateDragFuncOfCenter(){
      let shape=this.findShape(this.selectedShapeId).shape_data
      if(shape==undefined){
        return;
      }
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

    
    //deprecated
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
    
      
    //to copy an obejct alone
    Copy(){
      ContextMenu.props.CopiedShape=ContextMenu.props.ConcernedShape;
      ContextMenu.props.pastOneObject=true;
    },

    //to copy a group.
    CopyAll(){
      ContextMenu.props.CopiedShape=ContextMenu.props.ConcernedShape;
      ContextMenu.props.pastOneObject=false;
    },

    //to past a copied shape/group
    Past(){   

      //Prevent error when no shape is copied
      if(ContextMenu.props.CopiedShape.attrs==undefined){
        return;
      }
      
      /*We clone the copied shape changing its id by the same time.
      The id must be unique.*/
      let clone=ContextMenu.props.CopiedShape.clone({
        id: ''+this.max_id_figures,
      })
      
      let i= this.groups.length
      
      //If we copy a line
      if(ContextMenu.props.CopiedShape.attrs.className=="Line"){
        this.max_id_figures=this.max_id_figures+1;

        //If we decide to copy the line with all the shapes attached to it (we copy a group)
        if(!ContextMenu.props.pastOneObject){
        
          //clone of the group
          clone=ContextMenu.props.CopiedShape.getParent().clone({
            id: ''+ this.max_id_figures,
            name: "group"+this.max_id_figures,
            shapes_g:[],
          })

          //updating line of the cloned group. 
          clone.attrs.line.id=''+this.max_id_figures;
          clone.attrs.line.x=ContextMenu.props.ConcernedShape.getStage().getPointerPosition().x;
          clone.attrs.line.y=ContextMenu.props.ConcernedShape.getStage().getPointerPosition().y;

          //Remove and add new positionPoints
          let positionPoints=Object.assign([],clone.attrs.line.positionPoints);
          let length=positionPoints.length;
          clone.attrs.line.positionPoints=[];
          for(let i=0;i<length.valueOf();i++){
            let clone_positionPoint=ContextMenu.props.CopiedShape.getParent().getChildren().find((r)=>r.attrs.id===positionPoints[i].id).clone({
            id:'positionPoint'+clone.attrs.line.id+i,
            });
            clone.attrs.line.positionPoints.push(clone_positionPoint.attrs,);
          }

          //We add the cloned group to the vue component's data.
          this.groups.push(clone.attrs,);

          //We remove and add again attached shapes by cloning.
          let shapesg=this.groups[this.groups.indexOf(this.groups.find((r)=> r.id==ContextMenu.props.CopiedShape.getParent().attrs.id))].shapes_g;
          let shapesg_length=shapesg.length;
          for (let j=0; j<shapesg_length;j++){
            this.max_id_figures=this.max_id_figures + 1;
            let clone_shape=ContextMenu.props.CopiedShape.getParent().getChildren().find((r)=>r.attrs.id===shapesg[j].id).clone({
              id:''+this.max_id_figures,
            });
            this.groups[i].shapes_g.push(clone_shape.attrs,);
            this.updateDragFunc(this.groups[i].shapes_g[this.groups[i].shapes_g.length-1],this.groups[i].line);
          }
          
          this.updateAllPosInGrp(clone.attrs.id);

        }else{
          //We clone just a line without its attached shapes

          clone=ContextMenu.props.CopiedShape.getParent().clone({
            id: ''+this.max_id_figures,
            name: "group"+this.max_id_figures,
            shapes_g:[],
          })
          clone.attrs.line.id=''+this.max_id_figures;
          clone.attrs.line.x=ContextMenu.props.ConcernedShape.getStage().getPointerPosition().x;
          clone.attrs.line.y=ContextMenu.props.ConcernedShape.getStage().getPointerPosition().y;

          //All occupied positions become free positions.
          for(let j=0;j<clone.attrs.line.occupiedDistances.length;j++){
            clone.attrs.line.freeDistances.push(clone.attrs.line.occupiedDistances[j],);
          }
          clone.attrs.line.occupiedDistances=[];

          /*If the positions are kept on the line (no fixed distribution),
          we have to show positions points. So we clone them too.*/
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

          this.groups.push(clone.attrs,)
        }

        //In order to actualize the new line (in particular to show the positionPoints):
        this.updateAllPosInGrp(clone.attrs.id)
      } 
      else{
        //We clone just a shape

        this.max_id_figures=this.max_id_figures + 1;
        clone=ContextMenu.props.CopiedShape.clone({
          id: ''+this.max_id_figures,  
          x:ContextMenu.props.ConcernedShape.getStage().getPointerPosition().x,
          y:ContextMenu.props.ConcernedShape.getStage().getPointerPosition().y,
        });

        //The shape is free so we make sure that its drag bound func doesn't limit its movement.
        clone.attrs.dragBoundFunc=function (pos) {
          return {
            x: pos.x,
            y: pos.y,
          };
        };
        clone.attrs.isGrouped=0;
        this.shapes.push(clone.attrs,); 
         
      } 
    },

    
    //to remove a shape
    Remove(shape){
      
      //If we erase a stickyline
      if(shape.attrs.className=="Line"){
        //We have to be sure that all attached shapes are not remove and that they become free.

        let grp=this.groups.find((r)=>r.id===shape.attrs.id);
        const length=grp.shapes_g.length;

        //We remove the attached shapes to add them as free shapes on the stage.
        for(let i=0;i<length;i++){
          grp.shapes_g[i].dragBoundFunc= dragFunc;
          grp.shapes_g[i].isGrouped=0;
          this.shapes.push(grp.shapes_g[i],);
        }
        this.eraseNodefromTransformer("lineTransformer");

        //We erase the group
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
        this.center.visible=false;
        
      }else if(shape.attrs.className=="positionPoint"){
        //If we remove a "position point"


        let line=shape.getParent().attrs.line;
        let target_positionPoint=line.positionPoints.find((r)=>r.id===shape.attrs.id); //position point we want to remove
        let index=line.freeDistances.indexOf(shape.attrs.distance_to_line_center);
        
        if(line.keepDistribution!=1 && index!=-1){
          line.freeDistances.splice(index,1);// we remove the free position where the target position point is.
          line.positionPoints.splice(line.positionPoints.indexOf(target_positionPoint),1)
        }
      }
      else{
        //If we just remove a shape

        let res=this.findShape(shape.attrs.id)
        let shape_data=res.shape_data;
        let grp_id=res.grp_id;

        if(shape_data!=undefined){

          //if the shape is an attached one
          if(grp_id!='-1'){

            let grp=this.groups.find((r)=>r.id===grp_id);
            grp.line.freeDistances.push(grp.line.occupiedDistances[grp.shapes_g.indexOf(shape_data)],)
            grp.line.occupiedDistances.splice(grp.shapes_g.indexOf(shape_data),1)
            
            grp.shapes_g.splice(grp.shapes_g.indexOf(shape_data),1);
            this.updateOccupiedDistance(grp.id);
            
            this.updateAllPosInGrp(grp.id);

            //We make sure that the corresponding "position point" of the new free position 
            //is draggable and have the good drag bound func so that we can move it only on the line.
            let positionPoint=grp.line.positionPoints.find((r)=>r.distance_to_line_center==grp.line.freeDistances[grp.line.freeDistances.length-1]);
            positionPoint.draggable=true;
            this.updateDragFunc(positionPoint,grp.line);
          
        
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
            this.center.visible=false;

          }
          shape.destroy();
        }
      }
    },

    //deprecated
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

    /*Allow to find a shape by giving its id.
    The method returns the shape data and, if it is attached, the id of its group (-1 otherwise).*/
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

    /*method to detach a shape from its line.
    target_x and target_y should be the position of the mouse.
    */
    DetachShape(shape,target_x,target_y){
      
      
      const added_distance=this.lengthToCapture+10; //distance added bewteen the shape and the line after the shape has been detached
      
      let grp=this.groups.find((r)=>r.shapes_g.indexOf(shape)!=-1);
      let i=grp.shapes_g.indexOf(shape);
      
      shape.dragBoundFunc= dragFunc; //We give to the shape the drag bound function of free shapes.

      let coord_y1=grp.line.y-grp.line.points[4]*(1/2)*grp.line.scaleX*Math.sin(grp.line.rotation*(Math.PI/180));
      let coord_x2=grp.line.x+grp.line.points[4]*(1/2)*grp.line.scaleX*Math.cos(grp.line.rotation*(Math.PI/180));
      let coord_y2= grp.line.y+grp.line.points[4]*(1/2)*grp.line.scaleX*Math.sin(grp.line.rotation*(Math.PI/180));
      let coord_x1=grp.line.x-grp.line.points[4]*(1/2)*grp.line.scaleX*Math.cos(grp.line.rotation*(Math.PI/180));
      let a=(coord_y2-coord_y1)/(coord_x2-coord_x1);
      let b=shape.x*(1/a)+shape.y;

      //We add the distance added_distance by paying attention to the rotation of the line.
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
      
      shape.isGrouped=0;
      this.shapes.push(shape,)

      //We update the position of the center (the object)
      this.center.x=shape.x;
      this.center.y=shape.y;

      grp.line.freeDistances.push(grp.line.occupiedDistances[i],);
      grp.line.occupiedDistances.splice(i,1);
      grp.shapes_g.splice(i,1);

      if(grp.line.keepDistribution){
        console.log("a position point is delete")
        grp.line.positionPoints.splice(grp.line.positionPoints.length-1,1)
      }

      this.updateOccupiedDistance(grp.id)
      this.updateAllPosInGrp(grp.id)

      //We make sure that the corresponding "position point" of the new free position 
      //is draggable and have the good drag bound func so that we can move it only on the line.
      if(!grp.line.keepDistribution){
        let positionPoint= grp.line.positionPoints.find((r)=>r.distance_to_line_center
        ==grp.line.freeDistances[grp.line.freeDistances.length-1]);
        positionPoint.draggable=true;
        
      this.updateDragFunc(positionPoint,grp.line);
      }

      this.eraseNodefromTransformer("shapeTransformer");

      //We erase ghosts of attached shapes and we make sure that their opacity is 1.
      grp.ghosts.splice(0,grp.ghosts.length);
      for (let i=0;i<grp.shapes_g.length;i++){
        grp.shapes_g[i].opacity=1;
      }
    
    },

    
    //deprecated
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
    //switch btw the 2 modes of stickyline: keep distribution and keep only distance.
    switchStickylineMode(){

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

        }else{

          line.keepDistribution=true;
          for (let i=0;i<grp.shapes_g.length;i++){
            line.occupiedDistances[i]=grp.shapes_g[i].distance_to_line_center;
          }
          line.stroke='rgb(48,48,48)'
          grp.line.keepDistanceButtonText="Liberate Distribution";
          this.updateOccupiedDistance(line.id);
          this.updateAllPosInGrp(line.id);
          
        }
      }
    },

    //called when tthe event need_new_shape is emit by the ToolBar component.
    //This event is emitted with the shape that need to be create.
    //This method create the shape on the stage.
    createNewShape(shape){

      //If the shape that have to be created is aline
      if(shape.attrs.className=="Line"){
        
        //We have to create a new group by cloning the one present in the toolbar with the stickyline
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
        this.groups.push(clone.attrs,);
        
      }else{
        //If we just need to create a shape
        
        this.max_id_figures=this.max_id_figures+1
        let clone=shape.clone({
          id: ''+this.max_id_figures,
          draggable: true,
        })
        clone.attrs.isGrouped=0;
        this.shapes.push(clone.attrs,);

      }
    },
    
    //called when the user clicked on a onject in eraser mode
    eraserAction(e){
      this.Remove(e.target);  
    },

    //called when the mouse go out of an object's area in eraser mode
    //remove the stroke given to the shape if it could be erased
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

    //called when the mouse enter in an object's area in eraser mode
    //show is an object can be erased or not by giving to it a stroke
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
    },

    //called when we dbl click on a text
    //show the input area so that the user can modify the text
    editText(e){
      //let valuey=document.getElementById("stage").style.top+e.target.y()
      //let valuex=document.getElementById("stage").style.left+e.target.x()
      let stageBox=e.target.getStage().attrs.container.getBoundingClientRect();
      document.getElementById("input").style.top=stageBox.y+e.target.getAbsolutePosition().y+'px';
      document.getElementById("input").style.left=stageBox.x+e.target.getAbsolutePosition().x-document.getElementById("input").size*5+'px';
      document.getElementById("input").style.display="initial"
      this.editedText=e.target
    },

    /*Change the text accordingly to what the user wrote as input*/
    updateText(e){

      //We first need to find the text data.
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
        //if the data has been found we update the text.

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
    }
  },
};

</script>
<style>
#playground{
  cursor: default
}
#active{
  position: absolute;
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