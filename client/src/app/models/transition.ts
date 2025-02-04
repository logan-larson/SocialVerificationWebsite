import {Position} from "./position";

export class Transition {

    id: number;
    isReady: boolean; // State of transition
    firstMicroId: number;
    secondMicroId: number;
    isSet: boolean; // Whether the transition is placed or in the process of being placed
    midPos: Position;

    constructor(
        id: number = -1,
        isReady: boolean = false,
        firstMicro: number = -1,
        secondMicro: number = -1,
        isSet: boolean = false,
        midPos: Position = new Position()
    ) {
        this.id = id;
        this.isReady = isReady;
        this.firstMicroId = firstMicro;
        this.secondMicroId = secondMicro;
        this.isSet = isSet;
        this.midPos = midPos;
    }
}
