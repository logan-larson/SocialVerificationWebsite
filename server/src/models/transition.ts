
export class Transition {
    
    id: number;
    isReady: boolean;
    firstMicroId: number;
    secondMicroId: number;

    constructor(
        id: number = -1,
        isReady: boolean = false,
        firstMicro: number = -1,
        secondMicro: number = -1,
    ) {
        this.id = id;
        this.isReady = isReady;
        this.firstMicroId = firstMicro;
        this.secondMicroId = secondMicro;
    }
}
