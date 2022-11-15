


/* Globals */
var robot;
var text;
var state = 0;
let loop;
let fps = .5;
interactions = [];
microInteractions = [];
var i = 0;
var t = 0;
var userInputBool = 0
var interactionTarget = 0;
var theUserInput;
var source2 = -2;
var nextInteractionName
var actualTarget;
var interactionCounter = 0
var stateHolding = -1
var btnIgnore = document.getElementById("btn-ignore")
var btnReady= document.getElementById("btn-ready")
var btnBusy = document.getElementById("btn-busy")



/* The XML being parsed*/
var parseXml= 
`<nta>
  <group id="0" init="true" x="212" y="184">
    <micro>
      <name>Greeter</name>
      <parameter type="bool" val="true">Wait_for_response</parameter>
      <parameter type="bool" val="false">Greet_with_speech</parameter>
      <parameter type="bool" val="false">Greet_with_handshake</parameter>
    </micro>
  </group>
  <group id="2" init="false" x="521" y="163">
    <micro>
      <name>Ask</name>
      <parameter type="str" val="">question</parameter>
      <parameter type="array">
    </parameter>
  </micro>
</group>
<group id="3" init="false" x="370" y="32">
  <micro>
    <name>Wait</name>
    <parameter type="int" val="5">wait time (seconds)</parameter>
    <parameter type="bool" val="false">allow_speech</parameter>
    <parameter type="bool" val="false">look_at_people</parameter>
  </micro>
</group>
<group id="4" init="false" x="841" y="177">
  <micro>
    <name>Farewell</name>
  </micro>
</group>
<group id="5" init="false" x="719" y="11">
  <micro>
    <name>Handoff</name>
  </micro>
  <micro>
    <name>Remark</name>
    <parameter type="str" val="5">content</parameter>
    <parameter type="bool" val="false">use_gesture</parameter>
    <parameter type="bool" val="false">Allow_human_to_respond</parameter>
  </micro>
</group>
<group id="6" init="false" x="1124" y="86">
  <micro>
    <name>Wait</name>
    <parameter type="int" val="0">wait time (seconds)</parameter>
    <parameter type="bool" val="false">allow_speech</parameter>
    <parameter type="bool" val="false">look_at_people</parameter>
  </micro>
</group>
<group id="8" init="false" x="71" y="35">
  <micro>
    <name>Wait</name>
    <parameter type="int" val="3">wait time (seconds)</parameter>
    <parameter type="bool" val="true">allow_speech</parameter>
    <parameter type="bool" val="false">look_at_people</parameter>
    </micro>
</group>
<transition>
  <source ref="0"/>
  <target ref="3"/>
  <guard condition="human_ignore"/>
</transition>
<transition>
  <source ref="0"/>
  <target ref="2"/>
  <guard condition="human_ready"/>
</transition>
<transition>
  <source ref="3"/>
  <target ref="3"/>
  <guard condition="human_ignore"/>
</transition>
<transition>
  <source ref="3"/>
  <target ref="2"/>
  <guard condition="human_ready"/>
</transition>
<transition>
  <source ref="2"/>
  <target ref="4"/>
  <guard condition="human_ignore"/>
</transition>
<transition>
  <source ref="2"/>
  <target ref="5"/>
  <guard condition="human_ready"/>
</transition>
<transition>
  <source ref="5"/>
  <target ref="6"/>
  <guard condition="human_busy"/>
  <guard condition="human_ignore"/>
</transition>
<transition>
  <source ref="5"/>
  <target ref="4"/>
  <guard condition="human_ready"/>
</transition>
<transition>
  <source ref="6"/>
  <target ref="6"/>
  <guard condition="human_busy"/>
  <guard condition="human_ignore"/>
</transition>
<transition>
  <source ref="6"/>
  <target ref="5"/>
  <guard condition="human_ready"/>
</transition>
<transition>
  <source ref="8"/>
  <target ref="0"/>
  <guard condition="human_ready"/>
</transition>
<transition>
  <source ref="8"/>
  <target ref="8"/>
  <guard condition="human_busy"/>
  <guard condition="human_ignore"/>
</transition>
<design>copy</design>
</nta>;`

/*Creating the parser*/
if (window.DOMParser)
{
    console.log("working")
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(parseXml, "text/xml");
}
else // Internet Explorer
{
    console.log("not working")
    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async = false;
    xmlDoc.loadXML(parseXml);
}
var i, tag, source, group;

/*getting the group and name tags*/
group = xmlDoc.getElementsByTagName("group");
tag = xmlDoc.getElementsByTagName("name");

// add groups to the interactions list
/* This creates an object of Group Class and if you inspect the website, you will see all of the groups
   making it obvious how the below code works. */
class Group {
  interactionName = "";
  id = 0;
  micro = '';
  target = -1;
  guardList = ''
  busyTarget = -1
  readyTarget = -1
  ignoreTarget = -1

  constructor(interactionName, id, micro) {
    this.interactionName = interactionName;
    this.id = id;
    this.micro = micro;
  }

  setGuards(guardList) {
    this.guardList = guardList;
  }
  
  setReadyTarget(readyTarget) {
    this.readyTarget = readyTarget
  }
  setBusyTarget(busyTarget) {
    this.busyTarget = busyTarget
  }
  setIgnoreTarget(ignoreTarget) {
    this.ignoreTarget = ignoreTarget
  }
}
for (i = 0; i < group.length; i++) { 
  addInteraction(
    new Group(
      tag[i].childNodes[0].nodeValue,
      group[i].getAttribute('id'),
      group[i].querySelector('micro')?.innerHTML
    )
  );
}
let transitions = xmlDoc.getElementsByTagName("transition");


var guardList = []
var target = -1;
for (let i = 0; i < transitions.length; i++) {
  
  let j = 3;
  let sourceStr = transitions[i].childNodes[1].getAttribute('ref')
  let targetStr = transitions[i].childNodes[3].getAttribute('ref')
  let guard = ""
  let source = -1;
  let target = -1;
  let busyTarget = -1;
  let ignoreTarget = -1;
  let readyTarget = -1
  

  if (sourceStr && targetStr) {
    source = parseInt(sourceStr);
    target = parseInt(targetStr);
  } else {
    continue;
  }

  if(source2 == source) {
  }
  else {
    guardList = []
    
  }
  source2 = source

  while(j < transitions[i].childNodes.length) {
    
    if (j == 5) {
      guard = (transitions[i].childNodes[5].getAttribute('condition'))
      guardList.push(guard)
    }
    else if(j == 7) {
      guard = (transitions[i].childNodes[7].getAttribute('condition'))
      guardList.push(guard)
    }
    else if (j == 9) {
      guard = (transitions[i].childNodes[9].getAttribute('condition'))
      guardList.push(guard)
      
    }
    if(guard == 'human_ready') {
      console.log("in READY")
      readyTarget = target;
      console.log("Ready  " + readyTarget)
    }
    else if(guard == 'human_busy') {
      console.log("in BUSY")
      busyTarget = target
      console.log("Busy  " + busyTarget)
    }
    else if(guard == 'human_ignore') {
      console.log("in IGNORE")
      ignoreTarget = target
      console.log("Ignore  " + ignoreTarget)
    }
    j++
   
  }
  

  interactions.forEach((g) => {
    if (g.id == source) {
      if(readyTarget != -1) {
      g.setReadyTarget(readyTarget); 
      }
      if(ignoreTarget != -1) {
      g.setIgnoreTarget(ignoreTarget);
      }
      if(busyTarget != -1) {
      g.setBusyTarget(busyTarget);
      }
    }
    if(guard != null) {
      if(g.id == source) {
      g.setGuards(guardList)
    }
  }
  });
}

/* Game loop*/
$(window).load(function () {
    // executes when complete page is fully loaded, including all frames, objects and images
    robot = new robotInterface(); //use let for local variables and var for global variables
    loop = setInterval(() => {
      console.log("stuck")
      if (userInputBool == 0) {
       updateInteraction();
       
      }
    }, 1000/fps);
});


/* this does pretty much everything you see on the screen. Calls the correct method
   for changing the image on the screen, determines if the buttons are clickable or not
   figures out which interaction is the actual target depending on 
   which button the user clicked, etc */
function updateInteraction() { 
      if(t < 1) {
        state = 0
      }
    
      /*storing the ids of the buttons we made in HTML, into JS vars*/
    var btnIgnore = document.getElementById("btn-ignore")
    var btnReady= document.getElementById("btn-ready")
    var btnBusy = document.getElementById("btn-busy")

      /* depending on which button the user clicked, will depend on which target 
         we are using (ready target, busy target, ignore target)*/
      if(theUserInput == 'human_ready' ) {
        console.log("in the human ready")
        actualTarget = interactions[state].readyTarget;

      }
      else if(theUserInput == 'human_busy' ) {
        console.log("in the human busy")
        actualTarget = interactions[state].busyTarget;
      }
      else if(theUserInput == 'human_ignore') {
        console.log("in the human ignore")
        actualTarget = interactions[state].ignoreTarget;
      }
      /* print statements to help understand what is happening*/
      console.log("actual target:  " + actualTarget )
      console.log("interaction counter:   " + interactionCounter)

    let k = 0;
    /* so we find the group that has the same ID as the actualTarget(which is the interaction we want to display),
       and we look at its targets. If any of its Targets = -1 that means that target does not exist, and the butthon
       becomes disabled so that the user can not select it. */
     interactions.every(g => {
      if(interactionCounter < 1) {
        actualTarget = 0;
        interactionCounter++;
        //return false
      }
      if(g.id == actualTarget) {
        // if we did find the correct target, the interactionName of that target gets set to the variable nextInteractionName
        // for use later in the program
        nextInteractionName = g.interactionName;
        if(g.readyTarget == -1) {
          btnReady.disabled = true
        }
       else {
        btnReady.disabled = false
      }
        if(g.busyTarget == -1) {
          btnBusy.disabled = true
        }
        else {
          btnBusy.disabled = false
        }
        if(g.ignoreTarget == -1) {
          btnIgnore.disabled = true
        }
        else {
          btnIgnore.disabled = false
        }
        return false
      }

        k++
        return true;
     })
     state = k;
     console.log(state)
     console.log(nextInteractionName)

      /* now that we found the correct interaction, we are going to use the nextInteractionName variable (which contains the interaction
        name of the correct target) and compare it to the strings of all the interaction names until they are == and once we do that,
        we know we have found the correct interaction, and we can call the correct methods to change the image, speech bubble, etc. 
        on the screen */
      if(nextInteractionName == 'Greeter' ) {
        
        // example: robot.Greeter() is a method in robotmodel, the other 3 lines of code are for the speech bubble
        // t++ occurs so we know it is not our first time through this method and the state is not 0 (you can where this is
        // used RIGHT WHEN updateInteraction() runs... first line of code)
        // Then userInputBool is incremented so that it = 1 and then the user must provide input before the method runs again
        // You can see how this works in the gameLoop
        robot.Greeter();
        text = "Hello!";
        document.getElementById("bubble").style.display = "inline-block";
        document.getElementById("bubble").innerText = text;
        

        t++;
        userInputBool++;
      
    }
      else if(nextInteractionName == 'Farewell') {

        robot.Farewell();
        text = "Goodbye!";
        document.getElementById("bubble").style.display = "inline-block";
        document.getElementById("bubble").innerText = text
        t++;
      
        userInputBool++;
    }
    else if(nextInteractionName == 'Wait') {

        console.log("I am waiting");
        t++;
        userInputBool++;
        
    }
    else if(nextInteractionName == 'Handoff') {

        robot.Handoff();
        document.getElementById("bubble").style.display = "none";
        t++;

        userInputBool++;
        
    }
    else if(nextInteractionName ==  'Ask') {

        robot.Ask();
        text = "By any chance, are you looking to learn more about what tools I can offer?";
        document.getElementById("bubble").style.display = "inline-block";
        document.getElementById("bubble").innerText = text;
        t++;

        userInputBool++;
        
    }
    else if(nextInteractionName == 'Remark') {

        robot.Remark();
        text = "Yes, interesting. I will look into that.";
        document.getElementById("bubble").style.display = "inline-block";
        document.getElementById("bubble").innerText = text;
        t++;
        userInputBool++;
        
    }
    else if(nextInteractionName == 'Instruction' ) {

        robot.Instruction();
        text = "Yes, if you could just sign right here and then put your initials here, that would be great!";
        document.getElementById("bubble").style.display = "inline-block";
        document.getElementById("bubble").innerText = text;
        t++;


        userInputBool++;
    }
    else if(nextInteractionName == 'Answer') {

        robot.Answer();
        text = "Yes, I can answer your question right now if you would like!";
        document.getElementById("bubble").style.display = "inline-block";
        document.getElementById("bubble").innerText = text;
        t++;


        
        userInputBool++;
    }
    
}


/* this method just determines which button the user clicked*/
function userInput(userInput) {
  btnBusy.disabled = true
  btnIgnore.disabled = true
  btnReady.disabled = true

  console.log("in method")
  if(userInput == 'human_ready') {
    theUserInput = 'human_ready'
    userInputBool--;
  }
  else if(userInput == 'human_busy') {
    theUserInput = 'human_busy'
    userInputBool--;
    
  }
  else if(userInput == 'human_ignore') {
    theUserInput = 'human_ignore'
    userInputBool--;
  }
}




// This method is for showing all of the interactions on the screen like 1. Greeter 2. Farewell etc etc. 
function addInteraction(inter) {
    console.log(inter)
    interactions.push(inter);
    console.log(interactions);
    
    var ul = document.getElementById("list");
    var li = document.createElement("li");
    li.setAttribute('id', inter.value);
    li.appendChild(document.createTextNode(inter.interactionName));
    ul.appendChild(li);
}

// This method controls what happens when the stop button is clicked
function stop() {
    robot.Neutral();
    var list = document.getElementById('list');
    if (list) {
      list.innerHTML = '';
    }
    document.getElementById("bubble").style.display = "none";
    interactions = [];

  }



