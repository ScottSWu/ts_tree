"use strict";
var ts = require('typescript');
var fs = require('fs');
function leaves(node, sourceFile) {
    if (node.getChildCount() > 0) {
        return node.getChildren().reduce(function (acc, c) { return acc + leaves(c, sourceFile); }, "");
    }
    else {
        return node.getFullText(sourceFile);
    }
}
if (process.argv.length < 2) {
    console.log("Usage: node leaves.js <files>");
}
else {
    process.argv.slice(2).forEach(function (file) {
        console.log("Leaves of " + file);
        var sourceFile = ts.createSourceFile(file, fs.readFileSync(file).toString(), ts.ScriptTarget.ES5, true);
        console.log(leaves(sourceFile, sourceFile));
        console.log("");
    });
}
