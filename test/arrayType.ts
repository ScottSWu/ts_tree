
let a = [1, 2, 3, 4];

console.log(a.push(5));

let b = [];

console.log(b.pop());

let c = {
  d: ["a", "b"]
};

console.log(c.d["pop"]());

class E {
  public f = [[1, 2], [3, 4]];
}

let g = new E();

console.log(g["f"].pop());

console.log(new E().pop());

let h: Array<E> = [new E(), new E()];

console.log(h);

