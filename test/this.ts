
function a() {
  console.log(this.something());
}

class B() {
  public b() {
    console.log(this.somethingElse());
  }
}

