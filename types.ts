import * as ts from 'typescript';
import * as fs from 'fs';

function tree(node: ts.Node, tc: ts.TypeChecker, layer: number = 0): void {
  let out = "";
  for (let i = 0; i < layer; i++) {
    out += "| ";
  }
  out += "+ " + ts.SyntaxKind[node.kind];

  switch (node.kind) {
    case ts.SyntaxKind.SourceFile:
      const sourceNode = node as ts.SourceFile;
      out += " ( " + sourceNode.fileName + " )";
      break;
    case ts.SyntaxKind.Identifier:
      const idNode = node as ts.Identifier;
      const symbol = tc.getTypeAtLocation(idNode).symbol;

// Debugging
      if (symbol.valueDeclaration.kind === ts.SyntaxKind.EnumDeclaration) {
        const enumNode = symbol.valueDeclaration as ts.EnumDeclaration;
        enumNode.members.forEach(m => {
          switch (m.name.kind) {
            case ts.SyntaxKind.Identifier:
              console.log((m.name as ts.Identifier).text);
              break;
            case ts.SyntaxKind.ArrayLiteralExpression:
            case ts.SyntaxKind.ObjectLiteralExpression:
              console.log((m.name as ts.LiteralExpression).text);
              break;
            case ts.SyntaxKind.ComputedPropertyName:
              console.log((m.name as ts.ComputedPropertyName).expression.getText());
              break;
            case ts.SyntaxKind.ArrayBindingPattern:
            case ts.SyntaxKind.ObjectBindingPattern:
              (m.name as ts.BindingPattern).elements.forEach(e => {
                console.log("Binding " + e.propertyName);
              });
              break;
            default:
              break;
          }
        });
      }
// End debugging

      let symbolName = (symbol) ? symbol.name : "";
      out += " ( " + idNode.text + " , " + tc.typeToString(tc.getTypeAtLocation(idNode)) + " , " + symbolName + " )";
      break;
    case ts.SyntaxKind.CallExpression:
      const callNode = node as ts.CallExpression;
      out += " ( " + callNode.arguments.map(arg => tc.typeToString(tc.getTypeAtLocation(arg))).join(" , ") + " )";
      break;
    default:
      break;
  }
  console.log(out);
  ts.forEachChild(node, child => tree(child, tc, layer + 1));
}

if (process.argv.length < 2) {
  console.log("Usage: node tree.js <files>");
}
else {
  const fileNames = process.argv.slice(2);
  const sourceTexts = fileNames.map(f => fs.readFileSync(f).toString());

  const compilerOptions = ts.getDefaultCompilerOptions();
  const compilerHost: ts.CompilerHost = {
    fileExists: () => true,
    getCanonicalFileName: (filename: string) => filename,
    getCurrentDirectory: () => "",
    getDefaultLibFileName: () => ts.getDefaultLibFileName(compilerOptions),
    getNewLine: () => "\n",
    getSourceFile: function (fileNameToGet: string) {
      if (fileNameToGet === this.getDefaultLibFileName()) {
        const fileText = fs.readFileSync(ts.getDefaultLibFilePath(compilerOptions)).toString();
        return ts.createSourceFile(fileNameToGet, fileText, compilerOptions.target);
      }
      else {
        let index = fileNames.indexOf(fileNameToGet);
        if (index >= 0) {
          return ts.createSourceFile(fileNameToGet, sourceTexts[index], compilerOptions.target, true);
        }
      }
    },
    readFile: () => null,
    useCaseSensitiveFileNames: () => true,
    writeFile: () => null,
  };

  const program = ts.createProgram(fileNames, compilerOptions, compilerHost);
  fileNames.forEach(f => tree(program.getSourceFile(f), program.getTypeChecker()));
}
