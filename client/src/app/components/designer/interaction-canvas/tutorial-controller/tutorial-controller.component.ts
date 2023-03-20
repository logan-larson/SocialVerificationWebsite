import { Component, OnInit } from '@angular/core';
import { CanvasManagerService } from 'src/app/services/canvas-manager.service';

@Component({
  selector: 'app-tutorial-controller',
  templateUrl: './tutorial-controller.component.html',
  styles: [
  ]
})
export class TutorialControllerComponent implements OnInit {

  tutorialNodes: TutorialNode[] = [
    new TutorialNode("Welcome to the Social Verification Website!", "This is an interactive canvas, where you can create social interactions for robots. Use the arrows to the right to navigate through this tutorial.", "assets/croppedRobotImages/armRaise.png"),
    new TutorialNode("Adding a microinteraction", "An interaction made up of multiple microinteractions between the robot and a human. To add a 'Greeter' microinteraction (micro), drag the 'Greeter' block from the Selector panel on the left onto the canvas.", "assets/tutorialGifs/2.gif"),
    new TutorialNode("Selecting and deselecting a micro", "When you add a micro to the canvas, it is initially selected. Deselect it by clicking anywhere else on the canvas. Reselect a micro by clicking on it. You can tell a micro is selected when it is highlighted and its properties will be shown in the Inspector panel on the right.", "assets/croppedRobotImages/neutral.png"),
    new TutorialNode("Removing a micro", "To remove a micro, right-click on it and click 'Remove Micro'. If you removed the 'Greeter' micro, re-add it back to the canvas. Also add a 'Remark' and 'Farewell' micro to the canvas.", "assets/croppedRobotImages/neutral.png"),
    new TutorialNode("Moving a micro", "You can rearrange the micros on the canvas by clicking and dragging them around.", "assets/croppedRobotImages/neutral.png"),
    new TutorialNode("Moving the canvas", "Up until now you have been in the 'Select' canvas mode. You can switch to the 'Drag' canvas mode by clicking the open hand icon in the top-right of the canvas. This allows you to move the canvas. Switch back to the 'Select' canvas mode when you want to edit the micros.", "assets/croppedRobotImages/neutral.png"),
    new TutorialNode("Adding a transition", "Transitions are how the robot gets from one micro to another based on the human's state. For this interaction, when the human is Ready we want the robot to make a remark. So click the checkmark on the 'Greeter' micro to create a Ready transition. Then click the circle on the 'Remark' micro to set the transition.", "assets/croppedRobotImages/neutral.png"),
    new TutorialNode("Adding the remaining transitions", "Now that you know how to add a transition, go ahead and add the transition for when the human is Not Ready from 'Greeter' to 'Farewell'. And add both human Ready and Not Ready transitions from 'Remark' to 'Farewell'.", "assets/croppedRobotImages/neutral.png"),
    new TutorialNode("Moving and removing transitions", "If a transition is in the way, drag the midpoint knob to move the transition. Also you can right-click on the knob to show the transition's options. You can remove transitions this way or by clicking the transitions first anchor point.", "assets/croppedRobotImages/neutral.png"),
    new TutorialNode("Microinteraction properties", "Most micros have properties that can influence the interaction. Select the 'Remark' micro and type something into its content box in the Inspector panel. Click off the micro to save the properties.", "assets/croppedRobotImages/neutral.png"),
    new TutorialNode("Verifying the interaction", "With everything set, go ahead and click the 'Verify Model' button in the top-right corner. If something is wrong, the violation will appear in the bottom panel. Hover over it to see the problem and highlight the violating micros and transitions.", "assets/croppedRobotImages/neutral.png"),
    new TutorialNode("Simulating the interaction", "Now that the model is verified you can use the simulator in the bottom-right. Everytime you make a change to the model you will need to reverify it to use the simulator. Click 'Play' to start the simulation.", "assets/croppedRobotImages/neutral.png"),
    new TutorialNode("Simulating the interaction continued", "The 'Ready' and 'Not Ready' buttons correspond to the human states during the interaction. Click 'Ready' to see the simulation go to the 'Remark' micro. The currently simulated micro will be highlighted on the canvas. At any time you can click 'Reset' to stop the simulation and set the interaction to the beginning.", "assets/croppedRobotImages/neutral.png"),
    new TutorialNode("Tutorial complete!", "Congratulations! You are now equipped to design spectacular social interactions with the Social Verification Website. If you are confused about a certain tool or functionality, hover over it to see what it does. Happy designing!", "assets/croppedRobotImages/neutral.png"),
  ];
  tutorialIndex: number = 0;

  constructor(private canvasManager: CanvasManagerService) { }

  ngOnInit(): void {
  }

  tutorialBack() {
    if (this.tutorialIndex > 0)
      this.tutorialIndex--;
  }

  tutorialNext() {
    if (this.tutorialIndex < this.tutorialNodes.length - 1)
      this.tutorialIndex++;
  }
}

class TutorialNode {
  title: string;
  content: string;
  image: string;

  constructor(
    title: string,
    content: string,
    image: string,
  ) {
    this.title = title;
    this.content = content;
    this.image = image;
  }
}