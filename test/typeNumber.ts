type MyNumber = number;

let a: MyNumber = 6;
let b = 7;

let c = a + b;
console.log(c);

class Foo {
  constructor(public x: MyNumber);
}

let f = new Foo(a);
console.log(f.x + b);

let d: MyNumber[] = [ 1, 2, 3 ];

console.log(d[0] + d[3]);

type NumberPair = {first: MyNumber, second: MyNumber};

let e = {first: (3 as MyNumber), second: (6 as MyNumber)};
console.log(e.first + e.second);

