export class Violation {

    category: string;   //-either "micro" or "interaction"  --whether this is a group level violation (has associated group) or an interaction level violation (is violated somewhere in the interaction but exact location cant be pinpointed)
    type: string   // -- the type of property being violated, 'Greeter Flub'
    description: string //--the description of the property being violated
    violatingMicroIds: number[] = [];
    violatingTransitionIds: number[] = [];
    help: string = ""; // Steps to help solve the violation problem, will be shown if the user clicks on the violation in the violation panel

    constructor(
      category: string,
      type: string,
      description: string,
      violatingMicroIds: number[] = [],
      violatingTransitionIds: number[] = [],
      help: string = ""
    ) {
        this.category = category;
        this.type = type;
        this.description = description;
        this.violatingMicroIds = violatingMicroIds;
        this.violatingTransitionIds = violatingTransitionIds;
        this.help = help;
    }
}
