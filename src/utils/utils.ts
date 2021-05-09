export function appendMutate<T>(mutatedList: T[], consumedList: T[]) {
    consumedList.forEach(item => mutatedList.push(item));
}

export function deepCopy<T>(item: T) {
    return JSON.parse(JSON.stringify(item));
}

export function randomIntBetween(lower: number, upper: number) {
    return Math.floor(Math.random() * (upper - lower)) + lower;
}

export function squashStepFunction(value: number) {
    if (value >= 1) {
        return 1;
    } else if (value <= -1) {
        return -1;
    } else {
        return 0;
    }
}