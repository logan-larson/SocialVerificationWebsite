import { Transition } from "./transition";

import { Violation } from "./violation";
import { MicroInteraction } from "./microInteraction";

export class Interaction {

    microIdCounter: number = 0;
    transitionIdCounter: number = 0;
    violations: Violation[] = [];
    micros: MicroInteraction[] = [];
    transitions: Transition[] = [];

    constructor(json: string | null = null) {
      if (json) {
        let interactionData = JSON.parse(json);

        this.microIdCounter = interactionData.microIdCounter;
        this.transitionIdCounter = interactionData.transitionIdCounter;

        this.micros = interactionData.micros;
        this.transitions = interactionData.transitions;
      }
    }

    /* Violations */

    addViolation(violation: Violation) {
        this.violations.push(violation);
    }

    setViolations(violations: Violation[]) {
        this.violations = violations;
    }

    getViolations() {
        return this.violations;
    }
}
