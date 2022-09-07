<template>
  <div class="introduction">
    <h1>Introduction</h1>
    <p class="text_for_introduction">The goal of this app is too help you discover two generative theories: Instrumental Interaction and Human-Computer Partnerships.
      Even if the interactive part is more focused on the first theory, this app should help you understanding 
      the concepts and principles of these theories and how apply them.
    </p>
    <p class="text_for_introduction">We will first begin with an observation. Have a look at the follow interactive situation:</p>
    <p class="text_for_introduction"><strong>You can drag shapes,select them by clicking on them and align the selected shapes
      trought a button that appear when you right click on the stage.</strong>
    </p>
    <div id="basic-demo">
    <BasicAlignmentDemo  :height="300" :width="500"></BasicAlignmentDemo>
    </div>
    <p class="text_for_introduction">We can see that there is a <strong>lack of persistence and control</strong>.
      These problems related to alignement is something that can be seen in some graphic design softwares.
      How improve this command ?
      We will try to apply 'Instrumental Interaction' and 'Human-Computer Partnerships', two 'generative theories'
      in order to answer this question. 
    </p>
    <p class="text_for_introduction"> <strong>We tried to apply the principles of these theories in 
      order to illustrate them: See the tab "Instrumental Interaction Overview" and
      "Human-Computer Partnerships Overview". In these interactive illustrations, alignement is now a digital tool 
      called "stickyline".
      <br>The playground is a combination of these applications.
      <br>This work is inspired by the software of the 'ex-situ' team 
      called "StickyLine". See references [2] and [5] in "About" tab for more information</strong>
    </p>
    
     
    <h2>Generative Theory of Interaction</h2>
    <p class="text_for_introduction">A “Generative theory of interaction” can be seen as a theory which makes 
      a link between the HCI knowledge, scientific theories and those about human behaviour/activity 
      with the design of interactive artifacts.
      A generative theory allows to apply three "lenses" based on its concepts and principles in order analyse,critize and construct new artifacts</p>
    
    
    <img width=500 src="..\assets\genTheoImg.png">
    <p class="legend">Taken from reference [1]</p>
    

    <h2>Instrumental Interaction</h2>
    <h3>Concept:</h3>
    <p class="text_for_introduction">An 'instrumental interaction' is based on using digital tools to manipulate objects.
      These tools, also considered as objects, 
      should be flexible and, as for physical tools, have clear technial properties
      in order to help the user to appropiate it and allow him to use it for different kind of purposes beyond its primitive goal.
    </p>
    <h3>Principles:</h3>

    <table>
      <tr class="title_row">
        <th colspan="3" >Principles</th>
      </tr>
      <tr>
        <th>
          <span class="principle"> Reification</span> 
        </th>
        <th>
          <span class="principle"> Polymorphism</span> 
        </th>
        <th>
          <span class="principle"> Reuse</span> 
        </th>
      </tr>
      <tr>
        <th>
          Reify a command in a first-class object for the interface, in a digital tool that the user can manipulate
        </th>
        <th>
          Digital instrument should have the possibility to be used on different types of object.
          It could also reify futher commands.
        </th>
        <th>
          Possibility for the user to use again a previous process (Input Reuse) or its result (Output Reuse) 
        </th>
      </tr>
    </table>
    <h3>Methodology:</h3>
    <table>
      <tr class="title_row">
        <th>Instrumental Interaction</th>
        <th>Analytical</th>
        <th>Critical</th>
        <th>Constructive</th>
      </tr>
      <tr class="subtitle_row">
        <th colspan="4">Concepts</th>
      </tr>
      <tr>
        <th class="row_name">Object of Interest</th>
        <th>What are the objects visible
          and directly manipulable
          by the user?</th>
        <th>Do these objects match
          those of the users’ mental
          models?</th>
        <th>Are there other objects of
          interest, e.g. styles in a text
          editor? Should some
          objects of interest turned
          into instruments?</th>
      </tr>
      <tr>
        <th class="row_name">Instrumental / Tool</th>
        <th>What functions are
          available as tools, e.g. in
          tool palettes, as opposed to
          commands, e.g. menu items?</th>
        <th>Do the tools actually work
          as such i.e. by extending
          users capabilities? Do the
          tools enable technical
          reasoning?</th>
        <th>Which commands can be
          turned into tools? Are they
          related with physical tools?</th>
      </tr>
      <tr class="subtitle_row">
        <th colspan="4">Principles</th>
      </tr>
      <tr>
        <th class="row_name">Reification</th>
        <th>Which concepts/commands
          are reified into interactive
          objects/tools? How can
          these objects be
          manipulated?</th>
        <th>Are the reified concepts
          effective? Are the objects
          directly manipulable?</th>
        <th>Which concepts/commands
          should be reified? Into
          which objects/tools? What
          manipulations should be
          available?</th>
      </tr>
       <tr>
        <th class="row_name">Polymorphism</th>
        <th>Which commands/tools
          apply to objects of different
          types? Do they apply to
          collection of heterogeneous
          objects?</th>
        <th>Should commands/tools
          apply to multiple object
          types? Which types?</th>
        <th>How to make each
          instrument (more)
          polymorphic? How to
          create groups of
          heterogeneous objects?</th>
      </tr>
       <tr>
        <th class="row_name">Reuse</th>
        <th>Which commands/objects
          can be reused?</th>
        <th>Which commands/objects
          should be reusable?</th>
        <th>How to make commands
          reusable (input reuse)?
          How to make objects
          reusable (output reuse)?</th>
      </tr>
    
    </table>
    <p class="legend">Taken from reference [1]</p>
    <h2>Human-Computer Partnerships</h2>
    <h3>Concept:</h3>
    <p class="text_for_introduction">
      This theory is based on the concepts of co-adaptation. In HCI, co-adaptation means that the user tames the system by getting used to it 
      but also by adapting the systems to its needs.
      There is also the concepts of "Reciprocal co-adaptation" related to intelligent systems,
      but we will not talk of that here. If you want to know more see the reference [1] in the "About" page.
    </p>
    <h3>Principles:</h3>

    <table>
      <tr class="title_row">
        <th colspan="3">Principles</th>
      </tr>
      <tr>
        <th>
          <span class="principle"> Discoverability</span> 
        </th>
        <th>
          <span class="principle"> Appropriability</span> 
        </th>
        <th>
          <span class="principle"> Expressivity</span> 
        </th>
      </tr>
      <tr>
        <th>
          Reveal how the system interprets the user’s recent behavior (feedback) and
          which commands are now possible (feedforward)
        </th>
        <th>
          Modify the system’s behavior by customizing its characteristics for new purposes
        </th>
        <th>
          Create rich, personalized output generated from individual user-controlled input
          variation. 
        </th>
      </tr>
    </table>
    <p class="legend">Taken from reference [1]</p>
    <h3>Methodology:</h3>
    <table>
      <tr class="title_row">
        <th>Human-Computer Partnerships</th>
        <th>Analytical</th>
        <th>Critical</th>
        <th>Constructive</th>
      </tr>
      <tr class="subtitle_row">
        <th colspan="4">Concepts</th>
      </tr>
      <tr>
        <th class="row_name">Co-adaptation</th>
        <th>Can users reveal,
          interpret or modify the
          system’s behavior?</th>
        <th>Which aspects of the
          system are discoverable,
          appropriable and
          expressive?</th>
        <th>How can we help users to
          both adapt to the system,
          and adapt it for new tasks
          and creative expression?</th>
      </tr>
      <tr class="subtitle_row">
        <th colspan="4">Principles</th>
      </tr>
      <tr>
        <th class="row_name">Discoverability</th>
        <th>Does the system reveal
            how it interpreted user
            behavior and show what
            options are currently
            available?
            </th>
        <th>Can users discover and
            understand the system?
            Can the system interpret
            aspects of the user’s
            behavior?</th>
        <th>How can we present the
            system’s interpretation of
            users’ actions and reveal
            user-relevant features?</th>
      </tr>
       <tr>
        <th class="row_name">Appropriability</th>
        <th>Does the system permit
          customization of the
          system or its features?</th>
        <th>Can users create or
          modify the commands
          and features they need?</th>
        <th>How can we help users
          personalize or redefine
          the system or its features?</th>
      </tr>
       <tr>
        <th class="row_name">Expressivity</th>
        <th>Does the system
          transform individual
          input variation into
          expressive output?</th>
        <th>Can users control how
          the system interprets
          their actions so as to
          generate rich or
          expressive output?</th>
        <th>How can we help users
          dynamically control their
          expressive output?</th>
      </tr>
    </table>
    <p class="legend">Taken from reference [1]</p>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import BasicAlignmentDemo from '@/components/canvas/classic-demo/BasicAlignmentDemo.vue'
export default {
  name: 'IntroductionView',
  components: {
    BasicAlignmentDemo,
  }
}
</script>
<style>
#basic-demo{
  border:1px solid black;
  height:290px;
  width:500px;
  margin-left: auto;
  margin-right: auto;
}
.text_for_introduction{
  width:700px;
  text-align: left;
}
.introduction{
  margin: auto;
  width: 50%;
  padding: 10px;
  text-align: center;
  
}
.title{
  margin-left: auto;
  margin-right: auto;
}
.principle{
  color: red
}
.legend{
  font-size: 12px;
}
tr.title_row{
  color:rgb(255, 255, 255);
  background-color:rgb(125, 31, 214)
}
tr.subtitle_row{
  color:rgb(255, 255, 255);
  background-color:rgb(155, 72, 233)
}
th.row_name{
  background-color:rgb(201, 157, 243)
}
</style>
