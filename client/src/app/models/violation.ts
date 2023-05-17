export class Violation {
    category: string;   //-either "group" or "interaction"  --whether this is a group level violation (has associated group) or an interaction level violation (is violated somewhere in the interaction but exact location cant be pinpointed)
    type: string   // -- the type of property being violated
    description: string //--the description of the property being violated
    violatingMicroIds: number[] = []; //  --[groupName]   list of name of the group (or groups) violating this property, will be empty if category is violation
    violatingTransitionIds: number[] = []; //  --[groupName]   list of name of the group (or groups) violating this property, will be empty if category is violation
    help: string = "This is a demo help message for violations!";

    constructor(
      category: string = "",
        type: string = "",
        description: string = "",
        violatingMicroIds: number[] = [],
        violatingTransitionIds: number[] = [],
        help: string = "",
    ) {
        this.category = category;
        this.type = type;
        this.description = description;
        this.violatingMicroIds = violatingMicroIds;
        this.violatingTransitionIds = violatingTransitionIds;
        this.help = "This is a demo help message for violations!";
    }
}
