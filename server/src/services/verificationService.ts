import { Interaction } from "../models/interaction";
import { MicroInteraction } from "../models/microInteraction";
import { Violation } from "../models/violation";

function verifyModel(interaction: Interaction): Violation[] {

  let violations: Violation[] = [];

  // Check for transitions to have at least one state selected
  let transitionFlubs: boolean = addTransitionViolations(interaction, violations);

  // Check for more than one starting point (prereq for greeting expectations)
  let startingPointFlubs: boolean = addStartingPointViolations(interaction, violations);

  // Greeting expectations -- TODO tweak to reduce repetitive violations
  let greeterFlubs: boolean = addGreeterViolations(interaction, violations);

  // Check that an ending point exists
  let endingPointFlubs: boolean = addEndingPointViolations(interaction, violations);

  // Farewell expectations
  let farewellFlubs: boolean = false;
  if (!transitionFlubs && !startingPointFlubs && !greeterFlubs && !endingPointFlubs) {
    farewellFlubs = addFarewellViolations(interaction, violations);
  }



  return violations;
}

function addTransitionViolations(interaction: Interaction, violations: Violation[]): boolean {
  let violationCount: number = violations.length;
  let transitionIds: number[] = [];
  interaction.transitions.forEach(t => {
    if (!t.ready && !t.notReady) {
      transitionIds.push(t.id);
    }
  });

  if (transitionIds.length != 0) {
    violations.push(new Violation("transition", "Transition Flub", "Transitions must have at least one state set", [], transitionIds));
    return true;
  }


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
      if (m.id === t.secondMicroId) {
        notStarting = true;
      }
    });

    if (!notStarting) {
      startingMicroIds.push(m.id);
    }
  });

  if (startingMicroIds.length == 0) {
    violations.push(new Violation("interaction", "Interaction Flub", "The interaction must have a starting micro interaction"));
    return true;
  } else if (startingMicroIds.length > 1) {
    violations.push(new Violation("interaction", "Interaction Flub", "The interaction must not have more than one starting micro interaction", startingMicroIds));
    return true;
  } else {
    let m: MicroInteraction | undefined = interaction.micros.find(m => m.id === startingMicroIds[0]);
    if (m && m.type != 'Greeter') {
      violations.push(new Violation("micro", "Greeter Flub", "The interaction must start with the 'Greeter' micro interaction", startingMicroIds));
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
    violations.push(new Violation("micro", "Greeter Flub", "More than one 'Greeter' micro interaction exists", greeterIds));
    return true;
  } else if (greeterIds.length == 0) {
    violations.push(new Violation("micro", "Greeter Flub", "There must be exactly one 'Greeter' micro interaction to initiate the interaction", greeterIds));
    return true;
  }

  // Make sure greeter micro initializes the interaction
  interaction.transitions.forEach(t => {
    if (t.secondMicroId === greeterIds[0]) {
      violations.push(new Violation("micro", "Greeter Flub", "The robot should never issue a greeting more than once", greeterIds, [t.id]));
    }
  });

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
    violations.push(new Violation("interaction", "Interaction Flub", "The interaction should eventually end"));
    return true;
  }
  return false;
}

function addFarewellViolations(interaction: Interaction, violations: Violation[]): boolean {
  // Validate farewell expectations
  // When an interaction ends, it must end with a farewell
  // Triggered if farewell isn't reachable from all states OR doesn't exist

  // Handle doesn't exist trigger
  let farewellCount: number = 0;
  interaction.micros.forEach(m => {
    if (m.type === 'Farewell') {
      farewellCount++;
    }
  });

  if (farewellCount == 0) {
    violations.push(new Violation("micro", "Farewell Flub", "The interaction must contain a 'Farewell' micro interaction"));
    return true;
  }

  // Handle isn't reachable from all states trigger

  // Setup graph
  let nodes: Node[] = [];
  let root: Node = new Node();
  interaction.micros.forEach(m => {
    let node: Node = new Node(m.id, null, null);
    console.log("node: " + JSON.stringify(node, null, 2));
    nodes.push(node);
    if (m.type == 'Greeter') {
      root = node;
    }
  });
  
  interaction.transitions.forEach(t => {
    // Setup each node to point to its respective children based on state (ready vs notReady)
    if (t.ready) {
      let n1: Node | undefined = nodes.find(n => n.id == t.firstMicroId);
      let n2: Node | undefined = nodes.find(n => n.id == t.secondMicroId);

      if(n1 && n2) {
        n1.onReady = n2;
      }
    } else if (t.notReady) {
      let n1: Node | undefined = nodes.find(n => n.id == t.firstMicroId);
      let n2: Node | undefined = nodes.find(n => n.id == t.secondMicroId);

      if(n1 && n2) {
        n1.onNotReady = n2;
      }
    }
  });

  console.log(JSON.stringify(root));
  console.log(JSON.stringify(nodes, null, 2));

  // Perform search
  let currentPathIds: number[] = [];
  let terminalNodeIds: number[] = []; // Terminal meaning the node has a path to a terminal node
  let cyclicalNodeIds: number[] = []; // Cyclical meaning the node does not have a path to a terminal node

  currentPathIds.push(root.id);

  pathToEnd(nodes, currentPathIds, terminalNodeIds, cyclicalNodeIds);

  if (cyclicalNodeIds.length != 0) {
    violations.push(new Violation('interaction', 'Farewell Flub', 'Interaction has the possibility of never ending', cyclicalNodeIds));
    return true;
  }

  return false;
}

function pathToEnd(nodes: Node[], currentPath: number[], terminalNodes: number[], cyclicalNodes: number[]): string {
  let node: Node | undefined = nodes.find(n => n.id === currentPath[currentPath.length - 1]); // Get node that is last in the current path

  if (node == undefined) { // This should never happen, if so then graph constructed improperly
    return 'n';
  }

  // BASE CASE 1 - At terminal node
  if (node.onReady == null && node.onNotReady == null) {
    if (!terminalNodes.includes(node.id)) { // If this is a new found terminal node, add it to the list
      terminalNodes.push(node.id);
    }

    currentPath.pop(); // Remove node from currentPath
    return 'y';
  }

  // BASE CASE 2 - Found a cycle
  let cPath: number[] = currentPath.slice(0, currentPath.length - 1); // Get the current path without the current node being looked at
  if (cPath.includes(node.id)) { // A cycle was found
    currentPath.pop(); // Remove node from currentPath
    return 'c';
  }

  // RECURSIVE CASE

  let r: string = 'n';
  let n: string = 'n';

  if (node.onReady != null) {
    currentPath.push(node.onReady.id);
    r = pathToEnd(nodes, currentPath, terminalNodes, cyclicalNodes);
  }

  if (node.onNotReady != null) {
    currentPath.push(node.onNotReady.id);
    n = pathToEnd(nodes, currentPath, terminalNodes, cyclicalNodes);
  }

  currentPath.pop();
  if (r === 'n' || n === 'n') { // If either paths are non-terminal, then this node is non-terminal because this interaction has a possibility of never finishing
    if (!cyclicalNodes.includes(node.id)) {
      cyclicalNodes.push(node.id);
    }
    return 'n';
  } else if ((r === 'y' && n === 'c') || (r === 'c' && n === 'y')) { // If one of the paths is terminal, then the cyclical path will eventually end
    if (!terminalNodes.includes(node.id)) {
      terminalNodes.push(node.id);
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
  onReady: Node | null = null;
  onNotReady: Node | null = null;

  constructor(
    id: number = -1,
    onReady: Node | null = null,
    onNotReady: Node | null = null
  ) {
    this.id = id;
    this.onReady = onReady;
    this.onNotReady = onNotReady;
  }
}

export default verifyModel;
