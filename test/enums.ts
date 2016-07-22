enum Types {
  Zero,
  One,
  Two,
  Three,
  Four
}


let x: Types = Types.Two;

switch (x) {
  case Types.Zero:
  case Types.Three:
  default:
    break;
}

