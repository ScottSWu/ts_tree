"use strict";
var ts = require('typescript');
var fs = require('fs');
function tree(node, tc, layer) {
    if (layer === void 0) { layer = 0; }
    var out = "";
    for (var i = 0; i < layer; i++) {
        out += "| ";
    }
    out += "+ " + ts.SyntaxKind[node.kind];
    switch (node.kind) {
        case ts.SyntaxKind.SourceFile:
            var sourceNode = node;
            out += " ( " + sourceNode.fileName + " )";
            break;
        case ts.SyntaxKind.Identifier:
            var idNode = node;
            var symbol = tc.getTypeAtLocation(idNode).symbol;
            // Debugging
            if (symbol.valueDeclaration.kind === ts.SyntaxKind.EnumDeclaration) {
                var enumNode = symbol.valueDeclaration;
                enumNode.members.forEach(function (m) {
                    switch (m.name.kind) {
                        case ts.SyntaxKind.Identifier:
                            console.log(m.name.text);
                            break;
                        case ts.SyntaxKind.ArrayLiteralExpression:
                        case ts.SyntaxKind.ObjectLiteralExpression:
                            console.log(m.name.text);
                            break;
                        case ts.SyntaxKind.ComputedPropertyName:
                            console.log(m.name.expression.getText());
                            break;
                        case ts.SyntaxKind.ArrayBindingPattern:
                        case ts.SyntaxKind.ObjectBindingPattern:
                            m.name.elements.forEach(function (e) {
                                console.log("Binding " + e.propertyName);
                            });
                            break;
                        default:
                            break;
                    }
                });
            }
            // End debugging
            var symbolName = (symbol) ? symbol.name : "";
            out += " ( " + idNode.text + " , " + tc.typeToString(tc.getTypeAtLocation(idNode)) + " , " + symbolName + " )";
            break;
        case ts.SyntaxKind.CallExpression:
            var callNode = node;
            out += " ( " + callNode.arguments.map(function (arg) { return tc.typeToString(tc.getTypeAtLocation(arg)); }).join(" , ") + " )";
            break;
        default:
            break;
    }
    console.log(out);
    ts.forEachChild(node, function (child) { return tree(child, tc, layer + 1); });
}
if (process.argv.length < 2) {
    console.log("Usage: node tree.js <files>");
}
else {
    var fileNames_1 = process.argv.slice(2);
    var sourceTexts_1 = fileNames_1.map(function (f) { return fs.readFileSync(f).toString(); });
    var compilerOptions_1 = ts.getDefaultCompilerOptions();
    var compilerHost = {
        fileExists: function () { return true; },
        getCanonicalFileName: function (filename) { return filename; },
        getCurrentDirectory: function () { return ""; },
        getDefaultLibFileName: function () { return ts.getDefaultLibFileName(compilerOptions_1); },
        getNewLine: function () { return "\n"; },
        getSourceFile: function (fileNameToGet) {
            if (fileNameToGet === this.getDefaultLibFileName()) {
                var fileText = fs.readFileSync(ts.getDefaultLibFilePath(compilerOptions_1)).toString();
                return ts.createSourceFile(fileNameToGet, fileText, compilerOptions_1.target);
            }
            else {
                var index = fileNames_1.indexOf(fileNameToGet);
                if (index >= 0) {
                    return ts.createSourceFile(fileNameToGet, sourceTexts_1[index], compilerOptions_1.target, true);
                }
            }
        },
        readFile: function () { return null; },
        useCaseSensitiveFileNames: function () { return true; },
        writeFile: function () { return null; }
    };
    var program_1 = ts.createProgram(fileNames_1, compilerOptions_1, compilerHost);
    fileNames_1.forEach(function (f) { return tree(program_1.getSourceFile(f), program_1.getTypeChecker()); });
}
