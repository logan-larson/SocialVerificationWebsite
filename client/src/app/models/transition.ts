
export class Transition {
    
    id: number;
    firstMicroId: number;
    secondMicroId: number;
    isReady: boolean;
    ready: boolean;
    notReady: boolean;

    constructor(
        id: number = -1,
        firstMicro: number = -1,
        secondMicro: number = -1,
        isReady: boolean = false,
        ready: boolean = false,
        notReady: boolean = false
    ) {
        this.id = id;
        this.firstMicroId = firstMicro;
        this.secondMicroId = secondMicro;
        this.isReady = isReady;
        this.ready = ready;
        this.notReady = notReady;
    }
}
