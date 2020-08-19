function transitive(x,y,z) {
    return x && x == y && y == z && x != z;
}
transitive('0',0,''); // true
const res = transitive(1, {
    i: 0,
    valueOf() {
        return ++this.i;
    }
}, 2);
console.log(res);