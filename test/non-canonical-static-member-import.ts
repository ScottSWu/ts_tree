
class Foo {
  private static final SOMETHING: number = 5;
}

class Bar extends Foo {
  public void do() {
    console.log(Bar.SOMETHING);
  }
}

