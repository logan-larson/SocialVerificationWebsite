import { Transition } from "./transition";

import { Violation } from "./violation";
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
}
