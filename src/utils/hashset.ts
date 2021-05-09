// Adapter pattern implementation of a hashset to allow arbritrary objects as keys
export class HashSet<T> {
    private readonly set: Set<string>;

    constructor() {
        this.set = new Set();
    }

    add(item: T) {
        return this.set.add(JSON.stringify(item));
    }

    has(item: T) {
        return this.set.has(JSON.stringify(item));
    }
}