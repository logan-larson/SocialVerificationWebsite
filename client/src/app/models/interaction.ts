//import { MicroType } from "./microType";
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

    /* Transitions */



    /* Microinteraction types */

    /*
    getMicroTypeByName(name: string) {
      let trackedMicroTypes: MicroType[] = getTrackedMicroTypes();


      for (let i = 0; i < trackedMicroTypes.length; i++) {
          if (trackedMicroTypes[i].type == name) {
              //make a deep copy and then return it
              let copiedMicroType = JSON.parse(JSON.stringify(trackedMicroTypes[i]));
              return copiedMicroType;
          }
      }
      console.log("Micro type name " + name + " was not found, it must be loaded into interaction");
      console.trace();
      return null;
    }
    */

}
