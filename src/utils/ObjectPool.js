export class ObjectPool {
    constructor(factory, initialSize = 20) {
        this.factory = factory;
        this.pool = [];
        this.active = [];
        
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.factory());
        }
    }

    get() {
        let obj = this.pool.pop();
        if (!obj) {
            obj = this.factory();
        }
        this.active.push(obj);
        return obj;
    }

    return(obj) {
        const index = this.active.indexOf(obj);
        if (index > -1) {
            this.active.splice(index, 1);
            this.pool.push(obj);
        }
    }

    returnAll() {
        this.pool.push(...this.active);
        this.active = [];
    }
}
