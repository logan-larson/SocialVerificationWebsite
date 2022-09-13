export class Violation {

    category: string;   //-either "micro" or "interaction"  --whether this is a group level violation (has associated group) or an interaction level violation (is violated somewhere in the interaction but exact location cant be pinpointed)
    type: string   // -- the type of property being violated, 'Greeter Flub'
    description: string //--the description of the property being violated
    violatingMicroIds: number[] = [];
    violatingTransitionIds: number[] = [];

    constructor(
      category: string,
      type: string,
      description: string,
      violatingMicroIds: number[] = [],
      violatingTransitionIds: number[] = []
    ) {
        this.category = category;
        this.type = type;
        this.description = description;
        this.violatingMicroIds = violatingMicroIds
        this.violatingTransitionIds = violatingTransitionIds
    }
}
