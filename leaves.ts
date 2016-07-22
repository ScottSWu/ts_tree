import * as ts from 'typescript';
import * as fs from 'fs';

function leaves(node: ts.Node, sourceFile: ts.SourceFile): string {
  if (node.getChildCount() > 0) {
    return node.getChildren().reduce((acc, c) => acc + leaves(c, sourceFile), "");
  }
  else {
    return node.getFullText(sourceFile);
  }
}

if (process.argv.length < 2) {
  console.log("Usage: node leaves.js <files>");
}
else {
  process.argv.slice(2).forEach(function(file) {
    console.log("Leaves of " + file);
    let sourceFile = ts.createSourceFile(file, fs.readFileSync(file).toString(), ts.ScriptTarget.ES5, true);
    console.log(leaves(sourceFile, sourceFile));
    console.log("");
  });
}

