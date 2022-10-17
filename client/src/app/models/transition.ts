
export class Transition {

    id: number;
    firstMicroId: number;
    secondMicroId: number;
    isReady: boolean; // State of transition
    isSet: boolean; // Whether the transition is placed or in the process of being placed

    constructor(
        id: number = -1,
        firstMicro: number = -1,
        secondMicro: number = -1,
        isReady: boolean = false,
        isSet: boolean = false,
    ) {
        this.id = id;
        this.firstMicroId = firstMicro;
        this.secondMicroId = secondMicro;
        this.isReady = isReady;
        this.isSet = isSet;
    }
}
