// Adapter pattern implementation of a hashmap to allow arbitrary objects as keys
export class HashMap<K, V> {
    private readonly map: Map<string, V>;

    constructor(mapping: [K, V][]) {
        this.map = new Map<string, V>();

        mapping.forEach(([key, val]) =>
            this.map.set(JSON.stringify(key), val));
    }

    public add(key: K, val: V) {
        this.map.set(JSON.stringify(key), val);
    }

    public get(key: K) {
        return this.map.get(JSON.stringify(key));
    }

    public size() {
        return this.map.size;
    }
}