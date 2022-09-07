<template>
<!--Component of the toolbar-->
<v-stage
    ref="toolbar" id="toolbar" :config="stageConfig">
    <v-layer ref="layer">
      <v-rect
        :key="shapes.rectangle.id"
        :config="shapes.rectangle"
        @mousedown="Copy"
      />
      <v-circle
        :key="shapes.circle.id"
        :config="shapes.circle"
        @mousedown="Copy"
      />
      <v-regular-polygon
      :key="shapes.triangle.id"
      :config="shapes.triangle"
      @mousedown="Copy"/> 
      <v-text
        :key="shapes.text.id"
        :config="shapes.text"
        @mousedown="Copy"
      />
      
      <v-text v-for="item in texts" :key="item.text" :config="item"/>
      <v-line v-for="border in borders" :key="border.x" :config="border"/>
      <v-rect v-for="box in boxes" :key="box.x" :config="box"/>
      <v-group 
      ref="groups" 
      v-for="group in groups"
      :key="group.id"
      :config="group">
      <v-line 
        :key="group.line.id"
        :config="group.line"
        @mousedown="Copy"
      />
      </v-group>
      <v-image
        :key="tools.eraser.id"
        :config="tools.eraser"
        @mousedown="activateTool"
      />
    </v-layer>
</v-stage>
</template>
<script>
const width=window.innerWidth;
export default {
    props: {
        CopiedShape: Object,
        pastOneObject:{
          type: Boolean,
          default: true,
        },
    },
    data(){
        return{
            stageConfig: {
              width: width,
              height: 100,
            },
            //dM: this.displayMenu,
            //cS: "${this.ConcernedShape.className} ==='Line'",
            shapes:
            {
              rectangle:
              {
                rotation: 0,
                id: 'o1',
                //x: 100,
                x: 46,
                y: 20,
                opacity:1,
                width: 75,
                height: 50,
                scaleX: 1,
                scaleY: 1,
                strokeWidth: 0,
                stroke: 'black',
                fill: 'red',
                name: 'rect1',
                draggable: false,
                className:"Rect",
                isGrouped: 0, //if =0 the shape doesn't need to be added to a group. if=1, it does.
                offsetX:75/2,
                offsetY:0,
                personalRotation:0,
                centerPosition:'Top', 
                
              },
              circle:
              {
                rotation:0,
                //x: 200,
                x:116,
                y: 20,
                scaleX:1,
                scaleY:1,
                opacity:1,
                offsetX: 0,
                offsetY: -25,
                radius: 25,
                fill: 'orange',
                strokeWidth: 0,
                stroke: 'black',
                draggable:false,
                isGrouped: 0,
                className:"Circle",
                id:'o3',
                personalRotation:0,
                centerPosition:'Top',
              },
              triangle: {
                rotation: 0,
                id:'8',
                x: 170,
                y: 51,
                sides:3,
                opacity:1,
                radius:30,
                width: 60,
                height: 60,
                scaleX: 1,
                scaleY: 1,
                strokeWidth: 0,
                stroke: 'black',
                fill: 'purple',
                name: 'triangle1',
                draggable: false,
                className:"Triangle",
                isGrouped: 0,
                offsetX: 0,
                offsetY: 0,
                personalRotation:0, 
                centerPosition:'Middle',
              },
              text:{
                text: 'A text',
                rotation: 0,
                opacity:1,
                x: 216,
                y: 40,           
                scaleX:1,
                scaleY:1,
                offsetY:0,
                offsetX: 18,
                /*I cannot use height and width because otherwise thye will fix the height
                and the width of the text box: We want a flexible xhen so that peopl can write the text they want*/ 
                length_x:36,
                length_y:15,
                isGrouped: 0,
                className:"Text",    
                fontSize: 15,
                fontFamily: 'Calibri',
                id:'4',
                personalRotation:0,
                centerPosition:'Top',
            },

            },
            groups:[
            {
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
              ghosts:[],
              shapes_g:[], //list of shapes that are on the line
              //the line of the group:
              line:{
                x:316,
                y:50,
                points: [0, 0, 0, 0, 300, 0],
                positionPoints:[],
                strokeWidth: 10,
                rotation: 0,
                tension:0,
                closed: true,
                draggable: false,
                scaleX:60/300,
                scaleY:1,
                opacity:0.5,
                offset:{
                  x:150,
                  y:0,
                },
                name: "ligne",
                className: "Line",
                stroke: 'rgb(48,48,48)',
                id:'1',
                //distShapesToCenter:[],
                keepDistribution: true, //say of we keep the distribution on the line or not
                freeDistances:[], // distance that can be taken by other shapes (if we keep distribution on the line).
                occupiedDistances:[], //distance already "taken" by shapes on the line.       
                //text which will appear on the button corresponding to the management of the distribution:
                defaultAlignment:"Middle",
                keepDistanceButtonText:"Liberate Distribution",
              },
            },
            {
              //rotation: 20,
              name: "group",
              className: "Group",
              id: '2',
              x:0,
              y:0,
              offsetX:0,
              offsetY:0,
              rotation: 0,
              draggable: false,
              ghosts:[],
              shapes_g:[], //list of shapes that are on the line
              //the line of the group:
              line:{
                x:366,
                y:50,
                points: [0, 0, 0, 0, 300, 0],
                positionPoints:[],
                strokeWidth: 10,
                rotation: -90,
                tension:0,
                closed: true,
                draggable: false,
                scaleX:60/300,
                scaleY:1,
                opacity:0.5,
                offset:{
                  x:150,
                  y:0,
                },
                name: "ligne",
                className: "Line",
                stroke: 'rgb(48,48,48)',
                id:'2',
                //distShapesToCenter:[],
                keepDistribution: true, //say of we keep the distribution on the line or not
                freeDistances:[], // distance that can be taken by other shapes (if we keep distribution on the line).
                occupiedDistances:[], //distance already "taken" by shapes on the line.       
                //text which will appear on the button corresponding to the management of the distribution:
                defaultAlignment:"Middle",
                keepDistanceButtonText:"Liberate Distribution",
              },
            },
            
            {
              //rotation: 20,
              name: "group",
              className: "Group",
              id: '3',
              x:0,
              y:0,
              offsetX:0,
              offsetY:0,
              rotation: 0,
              draggable: false,
              ghosts:[],
              shapes_g:[], //list of shapes that are on the line
              //the line of the group:
              line:{
                x:476,
                y:50,
                points: [0, 0, 0, 0, 300, 0],
                positionPoints:[],
                strokeWidth: 10,
                rotation: 0,
                tension:0,
                closed: true,
                draggable: false,
                scaleX:60/300,
                scaleY:1,
                opacity:0.5,
                offset:{
                  x:150,
                  y:0,
                },
                name: "ligne",
                className: "Line",
                stroke: 'blue',
                id:'3',
                //distShapesToCenter:[],
                keepDistribution: false, //say of we keep the distribution on the line or not
                freeDistances:[], // distance that can be taken by other shapes (if we keep distribution on the line).
                occupiedDistances:[], //distance already "taken" by shapes on the line.       
                //text which will appear on the button corresponding to the management of the distribution:
                defaultAlignment:"Middle",
                keepDistanceButtonText:"Keep Distribution",
              },
            },
            {
              //rotation: 20,
              name: "group",
              className: "Group",
              id: '4',
              x:0,
              y:0,
              offsetX:0,
              offsetY:0,
              rotation: 0,
              draggable: false,
              ghosts:[],
              shapes_g:[], //list of shapes that are on the line
              //the line of the group:
              line:{
                x:526,
                y:50,
                points: [0, 0, 0, 0, 300, 0],
                positionPoints:[],
                strokeWidth: 10,
                rotation: -90,
                tension:0,
                closed: true,
                draggable: false,
                scaleX:60/300,
                scaleY:1,
                opacity:0.5,
                offset:{
                  x:150,
                  y:0,
                },
                name: "ligne",
                className: "Line",
                stroke: 'blue',
                id:'4',
                //distShapesToCenter:[],
                keepDistribution: false, //say of we keep the distribution on the line or not
                freeDistances:[], // distance that can be taken by other shapes (if we keep distribution on the line).
                occupiedDistances:[], //distance already "taken" by shapes on the line.       
                //text which will appear on the button corresponding to the management of the distribution:
                defaultAlignment:"Middle",
                keepDistanceButtonText:"Keep Distribution",
              },
            },
            ],
            tools:{
              eraser:{
            isActivated:0,
            rotation: 0,
            x: 606,
            y: 40,           
            scaleX:1,
            scaleY:1,
            offsetY:0,
            offsetX:0,
            opacity:1,
            //width:72,
            //height:30,
            image: null,
            isGrouped: 0,
            className:"eraser",    
            fontSize: 30,
            id:'5',
              },
            },
            borders:[
              {x:246,
                y:0,
                points: [0, 0, 0, 0, 100, 0],
                strokeWidth: 3,
                rotation: 90,
                opacity:1,
                stroke: 'black',
              },
            ],
            texts:[
              {text: 'Shapes',y:5,x:6},
              {text: 'Tools',y:5,x:250},
              {text: 'eraser',y:25,x:588,fill:'rgb(200, 59, 218)'},
              {text: 'StickyLines',y:19,x:260},
              {text: '(Keep Distribution)',y:29,x:260},
              {text: 'StickyLines',y:19,x:420,fill: 'blue'},
              {text: '(Keep Distance)',y:29,x:420,fill:'blue'},
            ],
            boxes:[
              
              {
                rotation: 0,
                id: 'box1',
                x: 296,
                y: 17,
                width: 145,
                height: 70,
                scaleX: 1,
                scaleY: 1,
                strokeWidth: 1,
                stroke: 'black',
                draggable: false,
                offsetX:75/2,
                offsetY:0,
                
              },
               {
                rotation: 0,
                id: 'box2',
                x: 456,
                y: 17,
                width: 145,
                height: 70,
                scaleX: 1,
                scaleY: 1,
                strokeWidth: 1,
                stroke: 'blue',
                draggable: false,
                offsetX:75/2,
                offsetY:0,
                
              },
              
            ]
        }
    },
    created(){
    
    const image = new window.Image();
    image.src = require("@/assets/ugly_eraser.png");

    //set image only when it is loaded
    image.onload = () => {
      this.tools.eraser.image= image;
      this.tools.eraser.offsetX=image.width/2;
      this.tools.eraser.offsetY=0; 
    };
  },
  methods:{

    //Called when the user click on a shape or a stickyline
    Copy(e){
      this.$emit('need_new_shape',e.target);
    },

    //Call when user click on a tool like the eraser (except stickylines)
    activateTool(e){
      let tool;
      if(e.target.attrs.className==="eraser"){
        tool=this.tools.eraser
        if(tool.opacity==1){
          tool.opacity=0.4;
        }else{
          tool.opacity=1;
        }
        this.$emit('eraser_is_selected');
      }
    }
  },
}
</script>
<style>

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

      #toolbar{
      
        box-shadow: 0 0 5px grey;
        border-radius: 3px;
        cursor: pointer;
      }
</style>