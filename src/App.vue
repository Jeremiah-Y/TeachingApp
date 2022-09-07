<template>
  <nav id="main_menu" :style="style">
    <router-link to="/">Introduction</router-link> 
    <router-link to="/instrumentalinteractiontable">Instrumental Interaction Overview</router-link> 
    <router-link to="/hc-partnerships-table">Human-Computer Partnerships Overview</router-link> 
    <router-link to="/playground">Playground</router-link>
    <router-link to="/about">About</router-link> 
  </nav>
  <router-view/>
  
  <div id="menu_button">
  <img id="button_image" width=50 src="@/assets/exsitu-plus.png"  @click="openMenu">
  </div>
</template>
<script>

export default {
  data(){
    return{
          style: {
              '--height': '0px',
          }
    }
  },
    methods:{
        openMenu(){
          console.log(document.getElementById("button_image").src)
          if(JSON.stringify(this.style)!='{"--height":"0px"}'){
            this.style={'--height': '0px'}
            document.getElementById("button_image").src=require("@/assets/exsitu-plus.png")
          }else{
            this.style={'--height': '35px'}
            document.getElementById("button_image").src=require("@/assets/exsitu-minus.png")
          }
        },
        
        closeMenu(){

        }
    }
}
</script>

<style>
#main_menu{
  height: var(--height); 
  width: 100%; /* 0 width - change this with JavaScript */
  position: relative; /* Stay in place */
  z-index: 1; /* Stay on top */
  top: 0;
  left: 0;
  background-color: blueviolet; /* Black*/
  overflow-x: hidden; /* Disable horizontal scroll */
  overflow-y: hidden; /* Disable horizontal scroll */
  padding-top: 0px; /* Place content 60px from the top */
  transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
  z-index: 1;
}
#menu_button{
  position: absolute;
  top:0;
  left:calc(100% - 50px);
  width:50px;
  z-index: 2;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  /*padding: 30px;*/
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;

}
nav a {
  display: block;
  float: left;
  color: white;
  text-align: center;
  padding: 10px 16px;
  text-decoration: none;
}

nav a.router-link-exact-active {
  color: #ffffff;
  background-color: rgb(105, 33, 173);
}
</style>
