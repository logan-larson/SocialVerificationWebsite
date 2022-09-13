import { MicroType } from "./microType";
import { Transition } from "./transition";

import { Violation } from "./violation";
import { getTrackedMicroTypes } from "./trackedMicroTypes";
import { MicroInteraction } from "./microInteraction";

export class Interaction {

    violations: Violation[] = [];
    micros: MicroInteraction[] = [];
    transitions: Transition[] = [];

    constructor(interactionData: Interaction | null = null) {
      if (interactionData) {
        this.micros = interactionData.micros;
        this.transitions = interactionData.transitions;
      }
    }

    /* Microinteraction types */

    /* Might be useful down the road

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
