
class A {
  public b() {
  }
}

class C {
}

C.prototype = Object.create(A.prototype);

