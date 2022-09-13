import {Interaction} from "../models/interaction";
import {MicroInteraction} from "../models/microInteraction";
import { Violation } from "../models/violation";

function verifyModel(interaction: Interaction): Violation[] {

  let violations: Violation[] = [];

  // Check for more than one starting point (prereq for greeting expectations)
  addStartingPointViolations(interaction, violations);

  // Greeting expectations -- TODO tweak to reduce repetitive violations
  addGreeterViolations(interaction, violations);

  // Check that an ending point exists
  addEndingPointViolations(interaction, violations);

  // Farewell expectations
  addFarewellViolations(interaction, violations);
  
  return violations;
}

function addStartingPointViolations(interaction: Interaction, violations: Violation[]): void {
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
  } else if (startingMicroIds.length > 1) {
    violations.push(new Violation("interaction", "Interaction Flub", "The interaction must not have more than one starting micro interaction", startingMicroIds));
  } else {
    let m: MicroInteraction | undefined = interaction.micros.find(m => m.id === startingMicroIds[0]);
    if (m && m.type != 'Greeter') {
      violations.push(new Violation("micro", "Greeter Flub", "The interaction must start with the 'Greeter' micro interaction", startingMicroIds));
    }
  }
}

function addGreeterViolations(interaction: Interaction, violations: Violation[]): void {
  // Validate greeting expectations
  // Check for 2 or more greeter micros and check for 0 greeter micros
  let greeterIds: number[] = [];
  interaction.micros.forEach(m => {
    if (m.type === 'Greeter') { greeterIds.push(m.id) }
  });

  if (greeterIds.length >= 2) {
    violations.push(new Violation("micro", "Greeter Flub", "More than one 'Greeter' micro interaction exists", greeterIds));
    return;
  } else if (greeterIds.length == 0) {
    violations.push(new Violation("micro", "Greeter Flub", "There must be exactly one 'Greeter' micro interaction to initiate the interaction", greeterIds));
    return;
  }

  // Make sure greeter micro initializes the interaction
  interaction.transitions.forEach(t => {
    if (t.secondMicroId === greeterIds[0]) {
      violations.push(new Violation("micro", "Greeter Flub", "The robot should never issue a greeting more than once", greeterIds, [t.id]));
    } 
  });
}

function addEndingPointViolations(interaction: Interaction, violations: Violation[]): void {

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
  }
}

function addFarewellViolations(interaction: Interaction, violations: Violation[]): void {
  // Validate farewell expectations
  // When an interaction ends, it must end with a farewell
  // Triggered if farewell isn't reachable from all states OR doesn't exist
}

export default verifyModel;
