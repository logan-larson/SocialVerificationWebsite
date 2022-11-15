class robotInterface {
    //note use this.varname to access or use any variable OR METHOD you declare in this class
    //google how to use javascript classes for more detail



    constructor() {
        this.robotdiv = document.getElementById("robot-view");
        //this is now a global variable in the class, whenever we use this. it tries to refer to a global variable in the class, local variables are just normal varName and must be declared in scope
        this.State = [{ name: "neutral", pictureID: "StillsForRobot/neutralRobot.png"  }, { name: "Greeter", pictureID: "StillsForRobot/Greeter.png" },
         { name: "Farewell", pictureID: "StillsForRobot/Farewell.png" }, {name: "Handoff", pictureID: "StillsForRobot/Handoff.png"},{name: "Instruction", pictureID: "StillsForRobot/Instruction.png"},
         {name: "Remark", pictureID: "StillsForRobot/Remark.png"}, {name: "Ask", pictureID: "StillsForRobot/Ask.png"}, {name: "Answer", pictureID: "StillsForRobot/Answer.png"} ];
        this.currentState = "neutral";
        this.repaint();
    }


    repaint() {
        let parent = document.getElementById("robot-view");
        while (parent.lastChild) {
            parent.removeChild(parent.lastChild);
        }
      
        let state = this.getStateID();
        this.displayState(state);

    }

    /*all these methods just set the currentState to the correct state depending on the method*/
    Neutral() { 
        this.currentState = "neutral";
        this.repaint();
    }

    Greeter() {
        this.currentState = "Greeter";
        this.repaint(); 
    }

    Farewell() {
        this.currentState = "Farewell";
        this.repaint();
    }

    Handoff() {
        this.currentState = "Handoff";
        this.repaint();
    }
    Instruction() {
        this.currentState = "Instruction";
        this.repaint();
    }
    Answer() {
        this.currentState = "Answer";
        this.repaint();
    }
    Ask() {
        this.currentState = "Ask";
        this.repaint();
    }
    Remark() {
        this.currentState = "Remark";
        this.repaint();
    }
    
    
    

    /* method used for displaying the state via the image*/
    displayState(imgsrc){
        var canvas = document.getElementById('robot-view');

  

        let container = document.createElement("div");
        container.classList.add("robot-state");
        canvas.appendChild(container);

        
        var newGroup = document.createElement("img");
        newGroup.setAttribute("src", imgsrc);

        container.appendChild(newGroup)


    }
    // Helps us determine which State we are in and making sure its the correct one (in the console you can see this)
    getStateID() {
        for (let i = 0; i < this.State.length; i++) {
            console.log("Comparing " + this.State[i].name + "and current State " + this.currentState);
            if (this.State[i].name == this.currentState) {
                return this.State[i].pictureID;
            }
        }
        console.log("ERROR: State not recognized");
    }

}