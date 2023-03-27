import { Component, OnInit } from '@angular/core';
import { CanvasManagerService } from 'src/app/services/canvas-manager.service';

@Component({
  selector: 'app-tutorial-controller',
  templateUrl: './tutorial-controller.component.html',
  styles: [],
})
export class TutorialControllerComponent implements OnInit {
  tutorialNodes: TutorialNode[] = [
    new TutorialNode(
      'Welcome to the Social Verification Website!',
      'This is an interactive canvas, where you can create social interactions for robots. Use the arrows to the right to navigate through this tutorial.',
      'assets/croppedRobotImages/armRaise.png'
    ),
    new TutorialNode(
      'Adding a microinteraction',
      "An interaction made up of multiple microinteractions between the robot and a human. To add a 'Greeter' microinteraction (micro), drag the 'Greeter' block from the Selector panel on the left onto the canvas.",
      'assets/tutorialGifs/2.gif'
    ),
    new TutorialNode(
      'Selecting and deselecting a micro',
      'When you add a micro to the canvas, it is initially selected. Deselect it by clicking anywhere else on the canvas. Reselect a micro by clicking on it. You can tell a micro is selected when it is highlighted, and its properties will be shown in the Inspector panel on the right.',
      'assets/tutorialGifs/3.gif'
    ),
    new TutorialNode(
      'Removing a micro',
      "To remove a micro, right-click on it and click 'Remove Micro'. If you removed the 'Greeter' micro, re-add it back to the canvas. Also add a 'Remark' and 'Farewell' micro to the canvas.",
      'assets/tutorialGifs/4.gif'
    ),
    new TutorialNode(
      'Moving a micro',
      'You can rearrange the micros on the canvas by clicking and dragging them around.',
      'assets/tutorialGifs/5.gif'
    ),
    new TutorialNode(
      'Moving the canvas',
      "Up until now you have been in the 'Select' canvas mode. You can switch to the 'Drag' canvas mode by clicking the open hand icon in the top-right of the canvas. This allows you to move the canvas. Switch back to the 'Select' canvas mode when you want to edit the micros.",
      'assets/tutorialGifs/6.gif'
    ),
    new TutorialNode(
      'Adding a transition',
      "Transitions are how the robot gets from one micro to another based on the human's state. For this interaction, when the human is Ready, we want the robot to make a remark. So, click the checkmark on the 'Greeter' micro to create a Ready transition. Then click the circle on the 'Remark' micro to set the transition.",
      'assets/tutorialGifs/7.gif'
    ),
    new TutorialNode(
      'Adding, moving and removing transitions',
      "Now that you know how to add a transition, go ahead, and add transitions for both Ready and Not Ready from 'Remark' to 'Farewell'. If a transition is in the way, drag the midpoint knob to move the transition. You can remove a transition by clicking the transitions starting point or right clicking the midpoint knob to show the transitions options.",
      'assets/tutorialGifs/8.gif'
    ),
    new TutorialNode(
      'Verifying the model',
      "You are now ready to verify that the interaction you have made is socially acceptable. Do so by clicking the 'Verify Model' button in the top-right corner. The model has three verification status's: Verified (green), Violating (red), and Not Verified (orange). If the model is Verified, you can use the simulator in the bottom-right to see how the interaction will play out. If the model is Violating, you will need to fix the violations before you can use the simulator. If the model is Not Verified, you will need to verify the model before you can use the simulator.",
      'assets/croppedRobotImages/neutral.png'
    ),
    new TutorialNode(
      'Fixing violations',
      "You will notice the verification status is red which means the model contains violations. The violations are shown in the Violations panel on the bottom. Hover over the 'Farewell Flub' to see what micros are causing the flub. 'Greeter' only has one outgoing transition, but every micro needs two outgoing transitions. Add the Not Ready transition from 'Greeter' to 'Remark' and reverify the model.",
      'assets/tutorialGifs/10.gif'
    ),
    new TutorialNode(
      'More violations and microinteraction properties',
      "We got rid of the 'Farewell Flub' but now we have a 'Turn-taking Flub'. This means that the robot could speak twice in a row while the human is not ready. Hover over the violation to see the micros and transitions involved in the violation. To fix this, select the 'Greeter' micro and update the 'Wait for Response' property to 'Yes'. Reverify the model to see that the violations are gone.",
      'assets/tutorialGifs/11.gif'
    ),
    new TutorialNode(
      'Simulating the interaction',
      "Now that the model is verified you can use the simulator in the bottom-right. Every time you make a change to the model you will need to reverify it to use the simulator. Click 'Play' to start the simulation.",
      'assets/croppedRobotImages/neutral.png'
    ),
    new TutorialNode(
      'Simulating the interaction continued',
      "The 'Ready' and 'Not Ready' buttons correspond to the human states during the interaction. Click 'Ready' to see the simulation go to the 'Remark' micro. The currently simulated micro will be highlighted on the canvas. At any time, you can click 'Reset' to stop the simulation and set the interaction to the beginning.",
      'assets/tutorialGifs/13.gif'
    ),
    new TutorialNode(
      'More microinteraction properties',
      "You will notice the robot is not saying anything when it reaches the 'Remark' micro. To fix this, select the 'Remark' micro and type something into its content box in the Inspector panel. Reverify the model and run the simulation again. The robot should now say your message when it comes to the 'Remark' micro.",
      'assets/tutorialGifs/14.gif'
    ),
    new TutorialNode(
      'Tutorial complete!',
      'Congratulations! You are now equipped to design spectacular social interactions with the Social Verification Website. If you are confused about a certain tool or functionality, hover over it to see what it does. Happy designing!',
      'assets/croppedRobotImages/armRaise.png'
    ),
  ];
  tutorialIndex: number = 0;

  constructor(private canvasManager: CanvasManagerService) {}

  ngOnInit(): void {}

  tutorialBack() {
    if (this.tutorialIndex > 0) this.tutorialIndex--;
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

  constructor(title: string, content: string, image: string) {
    this.title = title;
    this.content = content;
    this.image = image;
  }
}
