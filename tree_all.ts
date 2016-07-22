import * as ts from 'typescript';
import * as fs from 'fs';

function tree(node: ts.Node, sourceFile: ts.SourceFile, layer: number = 0): void {
  let out = "";
  for (let i = 0; i < layer; i++) {
    out += "| ";
  }
  out += "+ " + ts.SyntaxKind[node.kind] + " ( ";
  out += node.getFullText().replace(/\n/g, "\\n") + " )";
  console.log(out);
  //ts.forEachChild(node, child => tree(child, sourceFile, layer + 1));
  node.getChildren().forEach(child => tree(child, sourceFile, layer + 1));
}

if (process.argv.length < 2) {
  console.log("Usage: node tree.js <files>");
}
else {
  process.argv.slice(2).forEach(function(file) {
    let sourceFile = ts.createSourceFile(file, fs.readFileSync(file).toString(), ts.ScriptTarget.ES5, true);
    tree(sourceFile, sourceFile);
  });
}
