import { Interaction } from "../models/interaction";
import { MicroInteraction } from "../models/microInteraction";
import { Violation } from "../models/violation";

const showDebug: boolean = false;

function verifyModel(interaction: Interaction): Violation[] {

  let violations: Violation[] = [];

  // Check for transitions to have at least one state selected
  let transitionFlubs: boolean = addTransitionViolations(interaction, violations);

  // Check for more than one starting point (prereq for greeting expectations)
  let startingPointFlubs: boolean = addStartingPointViolations(interaction, violations);

  // Greeting expectations -- TODO tweak to reduce repetitive violations
  let greeterFlubs: boolean = false;
  if (!startingPointFlubs) {
    greeterFlubs = addGreeterViolations(interaction, violations);
  }

  // Check that an ending point exists
  let endingPointFlubs: boolean = addEndingPointViolations(interaction, violations);

  // Farewell expectations
  let farewellFlubs: boolean = false;
  if (!transitionFlubs && !startingPointFlubs && !greeterFlubs && !endingPointFlubs) {
    farewellFlubs = addFarewellViolations(interaction, violations);
  }

  // Turn-taking expectations
  let turnTakingFlubs: boolean = false;
  if (!transitionFlubs && !startingPointFlubs && !greeterFlubs && !endingPointFlubs && !farewellFlubs) {
    turnTakingFlubs = addTurnTakingViolations(interaction, violations);
  }

  return violations;
}

function addTransitionViolations(interaction: Interaction, violations: Violation[]): boolean {
  let violationCount: number = violations.length;
  let transitionIds: number[] = [];
  /*
  interaction.transitions.forEach(t => {
    if (!t.firstMicroId && !t.notReady) {
      transitionIds.push(t.id);
    }
  });

  if (transitionIds.length != 0) {
    violations.push(new Violation("transition", "Transition Flub", "Transitions must have at least one state set", [], transitionIds));
    return true;
  }
  */

  // Check that each micro has both outward transitions in use
  interaction.micros.forEach(m => {

  });

  /*
  interaction.micros.forEach(m => {
    let outwardTransitions: number = 0;
    let transitionIds: number[] = [];

    interaction.transitions.forEach(t => {
      if (m.id == t.firstMicroId) {
        transitionIds.push(t.id);
        outwardTransitions++;
      }
    });

    if (outwardTransitions > 2) {
      violations.push(new Violation("interaction", "Interaction Flub", "A micro may only have two outward transitions", [m.id], transitionIds));
    }
  });
  */

  if (violations.length != violationCount) {
    return true;
  }

  return false;
}

function addStartingPointViolations(interaction: Interaction, violations: Violation[]): boolean {
  let startingMicroIds: number[] = [];
  interaction.micros.forEach(m => {
    let notStarting = false;
    interaction.transitions.forEach(t => {
      if (m.id === t.secondMicroId && m.id != t.firstMicroId) {
        notStarting = true;
      }
    });

    if (!notStarting) {
      startingMicroIds.push(m.id);
    }
  });

  if (startingMicroIds.length == 0) {
    violations.push(new Violation("interaction", "Interaction Flub", "The interaction must have a starting microinteraction", [], [], "Place a 'Greeter' microinteraction onto the canvas."));
    return true;
  } else if (startingMicroIds.length > 1) {
    violations.push(new Violation("interaction", "Interaction Flub", "The interaction must not have more than one starting microinteraction", startingMicroIds, [], "A microinteraction is considered a starting micro if it does not have any incoming transitions. Make sure your interaction only has one micro with zero incoming transitions. Note: self-referential transitions do not count as incoming transitions."));
    return true;
  } else {
    let m: MicroInteraction | undefined = interaction.micros.find(m => m.id === startingMicroIds[0]);
    if (m && m.type != 'Greeter') {
      violations.push(new Violation("micro", "Greeter Flub", "The interaction must start with the 'Greeter' microinteraction", startingMicroIds, [], "Place a 'Greeter' microinteraction at the beginning of your interaction and connect it to your current microinteraction."));
      return true;
    }
  }
  return false;
}

function addGreeterViolations(interaction: Interaction, violations: Violation[]): boolean {
  let violationCount: number = violations.length;
  // Validate greeting expectations
  // Check for 2 or more greeter micros and check for 0 greeter micros
  let greeterIds: number[] = [];
  interaction.micros.forEach(m => {
    if (m.type === 'Greeter') { greeterIds.push(m.id) }
  });

  if (greeterIds.length >= 2) {
    violations.push(new Violation("micro", "Greeter Flub", "More than one 'Greeter' microinteraction exists", greeterIds, [], "The interaction can only have one entry point, so remove all but one 'Greeter' microinteraction."));
    return true;
  } else if (greeterIds.length == 0) {
    violations.push(new Violation("micro", "Greeter Flub", "There must be exactly one 'Greeter' microinteraction to initiate the interaction", greeterIds, [], "A 'Greeter' microinteraction must start the interaction, so drag one onto your canvas."));
    return true;
  }

  // Make sure greeter micro initializes the interaction
  // This one is impossible now that I removed the input anchor on greeter
  /*
  interaction.transitions.forEach(t => {
    if (t.secondMicroId === greeterIds[0]) {
      violations.push(new Violation("micro", "Greeter Flub", "The robot should never issue a greeting more than once", greeterIds, [t.id]));
    }
  });
  */

  if (violations.length != violationCount) {
    return true;
  }

  return false;
}

function addEndingPointViolations(interaction: Interaction, violations: Violation[]): boolean {

  // The interaction should eventually end
  let endingIds: number[] = [];
  interaction.micros.forEach(m => {
    let hasOutgoing: boolean = false;

    interaction.transitions.forEach(t => {
      if (t.firstMicroId == m.id) {
        hasOutgoing = true;
      }
    });

    if (!hasOutgoing) {
      endingIds.push(m.id);
    }
  });

  if (endingIds.length == 0) {
    violations.push(new Violation("interaction", "Interaction Flub", "The interaction should eventually end", [], [], "Check that your interaction contains at least one microinteraction with zero outgoing transitions."));
    return true;
  }
  return false;
}

function addFarewellViolations(interaction: Interaction, violations: Violation[]): boolean {
  // Validate farewell expectations
  // When an interaction ends, it must end with a farewell
  // Triggered if farewell isn't reachable from all states OR doesn't exist

  // Handle doesn't exist trigger
  let farewellIds: number[] = [];
  interaction.micros.forEach(m => {
    if (m.type === 'Farewell') {
      farewellIds.push(m.id);
    }
  });

  if (farewellIds.length == 0) {
    violations.push(new Violation("micro", "Farewell Flub", "The interaction must contain a 'Farewell' microinteraction", [], [], "Drag a 'Farewell' microinteraction onto the canvas and connect it at the end of your interaction."));
    return true;
  }

  // Handle isn't reachable from all states trigger

  // Setup graph
  let nodes: Node[] = [];
  let root: Node = new Node();
  interaction.micros.forEach(m => {
    let node: Node = new Node(m.id, -1, -1);
    nodes.push(node);
    if (m.type == 'Greeter') {
      root = node;
    }
  });
  
  interaction.transitions.forEach(t => {
    // Setup each node to point to its respective children based on state (ready vs notReady)
    let n1: Node | undefined = nodes.find(n => n.id == t.firstMicroId);
    let n2: Node | undefined = nodes.find(n => n.id == t.secondMicroId);

    // This can be optimized/look cleaner
    if (t.isReady) {
      if(n1 && n2) {
        n1.onReady = n2.id;
      }
    } else {
      if(n1 && n2) {
        n1.onNotReady = n2.id;
      }
    }
  });

  if (showDebug) console.log(JSON.stringify(nodes, null, 2));

  // Perform search
  let currentPathIds: number[] = [];
  let endingNodeIds: number[] = []; // Ending meaning the node has a path to a terminal node
  let cyclicalNodeIds: number[] = []; // Cyclical meaning the node does not have a path to a terminal node
  let terminalNodeIds: number[] = []; // Terminal meaning the node has no exiting transitions

  currentPathIds.push(root.id);

  pathToEnd(nodes, currentPathIds, endingNodeIds, cyclicalNodeIds, terminalNodeIds);

  if (cyclicalNodeIds.length != 0) {
    violations.push(new Violation('interaction', 'Farewell Flub', 'Interaction has the possibility of never ending', cyclicalNodeIds, [], "One of the highlighted micros has a chance of never reaching a 'Farewell' micro to end the interaction. Trace the interaction to make sure there aren't any cycles."));
    return true;
  }
  
  let terminalNonFarewellIds: number[] = [];
  terminalNodeIds.forEach(id => {
    if (!farewellIds.includes(id)) {
      terminalNonFarewellIds.push(id);
    }
  });

  if (terminalNonFarewellIds.length != 0) {
    violations.push(new Violation('interaction', 'Farewell Flub', 'This interaction could end without the robot giving a farewell', terminalNonFarewellIds, [], "Make sure the final microinteraction (one with zero outgoing transitions) is a 'Farewell' micro."));
    return true;
  }

  return false;
}

function pathToEnd(nodes: Node[], currentPath: number[], endingNodes: number[], cyclicalNodes: number[], terminalNodes: number[]): string {
  let node: Node | undefined = nodes.find(n => n.id === currentPath[currentPath.length - 1]); // Get node that is last in the current path

  if (showDebug) console.log(`\n${JSON.stringify(node)}\n`);

  if (node == undefined) { // This should never happen, if so then graph constructed improperly
    if (showDebug) console.log(`Undefined\n`);
    return 'n';
  }

  // BASE CASE 1 - At terminal node
  if (node.onReady == -1 && node.onNotReady == -1) {
    if (!endingNodes.includes(node.id)) { // If this is a new found terminal node, add it to the ending nodes list
      endingNodes.push(node.id);
    }

    if (!terminalNodes.includes(node.id)) { // Also add it to the terminal nodes list
      terminalNodes.push(node.id);
    }

    currentPath.pop(); // Remove node from currentPath
    if (showDebug) console.log(`\nBase case for ${node.id}: y`);
    return 'y';
  }

  // BASE CASE 2 - Found a cycle
  let cPath: number[] = currentPath.slice(0, currentPath.length - 1); // Get the current path without the current node being looked at
  if (cPath.includes(node.id)) { // A cycle was found
    currentPath.pop(); // Remove node from currentPath
    if (showDebug) console.log(`\nBase case for ${node.id}: c`);
    return 'c';
  }

  // RECURSIVE CASE

  let r: string = 'n';
  let n: string = 'n';

  if (node.onReady != -1) {
    currentPath.push(node.onReady);
    r = pathToEnd(nodes, currentPath, endingNodes, cyclicalNodes, terminalNodes);
  }

  if (node.onNotReady != -1) {
    currentPath.push(node.onNotReady);
    n = pathToEnd(nodes, currentPath, endingNodes, cyclicalNodes, terminalNodes);
  }

  if (showDebug) console.log(`\n Post recursion for ${node.id}: r = ${r}, n = ${n}`);

  currentPath.pop();
  if (r === 'n' || n === 'n') { // If either paths are non-terminal, then this node is non-terminal because this interaction has a possibility of never finishing
    if (!cyclicalNodes.includes(node.id)) {
      cyclicalNodes.push(node.id);
    }
    return 'n';
  } else if ((r === 'y' && n === 'c') || (r === 'c' && n === 'y')) { // If one of the paths is terminal, then the cyclical path will eventually end
    if (!endingNodes.includes(node.id)) {
      endingNodes.push(node.id);
    }
    return 'y';
  } else if (r === 'c' && n === 'c') { // If both paths lead to a cycle, then this node is non-terminal
    if (!cyclicalNodes.includes(node.id)) {
      cyclicalNodes.push(node.id);
    }
    return 'n';
  } else { // This should only ever return 'y' because all other cases are covered
    return r;
  }
}

class Node {
  id: number = -1;
  onReady: number = -1;
  onNotReady: number = -1;

  constructor(
    id: number = -1,
    onReady: number = -1,
    onNotReady: number = -1
  ) {
    this.id = id;
    this.onReady = onReady;
    this.onNotReady = onNotReady;
  }
}

function addTurnTakingViolations(interaction: Interaction, violations: Violation[]): boolean {

  // No instances of robot speaking twice in a row when not ready
  let violatingMicroIds: number[] = [];
  let violatingTransitionIds: number[] = [];
  let violationCount = violations.length;

  for (let i = 0; i < interaction.transitions.length; i++) {

    let t = interaction.transitions[i];

    // Only look at not ready transitions
    if (!t.isReady) {
      // For the first micro
      let m: MicroInteraction | undefined = interaction.micros.find(m => m.id === t.firstMicroId);

      // Find the ones where the robot doesn't speak last and continue
      if (m && m.type != 'Ask') { 
        if (m.type == 'Greeter' && m.parameterResults[0].boolResult == true) {
          continue;
        } else if (m.type == 'Remark' && m.parameterResults[2].boolResult == true) {
          continue;
        } else {
          // If you get here the robot speaks last, so now we got to make sure micro is a wait
          let m2: MicroInteraction | undefined = interaction.micros.find(m => m.id === t.secondMicroId);
          if (m2 && (m2.type != 'Wait' && m2.type != 'Farewell')) {
            violatingMicroIds.push(m.id);
            violatingMicroIds.push(m2.id);
            violatingTransitionIds.push(t.id);
            violations.push(
              new Violation('interaction', 'Turn-taking Flub', "The robot could speak twice in a row while the human isn't ready", violatingMicroIds, violatingTransitionIds, "If the first micro is 'Greeter' or 'Remark', set the parameter related to waiting for human response to true. Otherwise, you will need to add a 'Wait' micro to allow the human to be in the Ready state before proceeding.")
            );
            // I should probably check that the 'Wait' micros not ready transition points to itself
            // So the wait is being used as intended, to wait for the human to be ready
          }
        }
      }

    }
  }

  if (violationCount != violations.length) {
    return true;
  }

  // No instances where human is prompted to speak twice in a row
  try {

  for (let i = 0; i < interaction.transitions.length; i++) {

    violatingTransitionIds = [];
    violatingMicroIds = [];

    let t = interaction.transitions[i];

    // For the first micro
    let m: MicroInteraction | undefined = interaction.micros.find(m => m.id === t.firstMicroId);

    // Find the ones where the robot speaks last and continue
    if (m) { 
      // If the first micro prompts the user to speak last ...
      if ((m.type == 'Greeter' && m.parameterResults[0].boolResult == true) || (m.type == 'Remark' && m.parameterResults[2].boolResult == true) || (m.type == 'Ask')) {

        // We got to make sure micro the second micro doesn't prompt the human to speak first
        // i.e. Answer without intro
        let m2: MicroInteraction | undefined = interaction.micros.find(m => m.id === t.secondMicroId);
        if (m2 && m2.type == 'Answer' && m2.parameterResults[0].boolResult == false) {
          violatingMicroIds.push(m.id);
          violatingMicroIds.push(m2.id);
          violatingTransitionIds.push(t.id);
          violations.push(
            new Violation('interaction', 'Turn-taking Flub', "The human should never be prompted to speak twice in a row", violatingMicroIds, violatingTransitionIds, "If the second micro is 'Answer', set the introduction parameter to true.")
          );
        }
      }
    }
  }
  } catch (e) {
    console.log(JSON.stringify(e));
  }

  if (violationCount != violations.length) {
    return true;
  }

  return false;
}

export default verifyModel;
