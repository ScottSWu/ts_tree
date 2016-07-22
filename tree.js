"use strict";
var ts = require('typescript');
var fs = require('fs');
function tree(node, sourceFile, layer) {
    if (layer === void 0) { layer = 0; }
    var out = "";
    for (var i = 0; i < layer; i++) {
        out += "| ";
    }
    out += "+ " + ts.SyntaxKind[node.kind] + " ( ";
    out += node.getFullText().replace(/\n/g, "\\n") + " )";
    console.log(out);
    ts.forEachChild(node, function (child) { return tree(child, sourceFile, layer + 1); });
}
if (process.argv.length < 2) {
    console.log("Usage: node tree.js <files>");
}
else {
    process.argv.slice(2).forEach(function (file) {
        var sourceFile = ts.createSourceFile(file, fs.readFileSync(file).toString(), ts.ScriptTarget.ES5, true);
        tree(sourceFile, sourceFile);
    });
}
