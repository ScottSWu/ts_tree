"use strict";
var ts = require("typescript");
var config = ts.readConfigFile("project/tsconfig.json", ts.sys.readFile).config;
var parsed = ts.parseJsonConfigFileContent(config, { readDirectory: ts.sys.readDirectory }, "project");
var host = ts.createCompilerHost(parsed.options, true);
var program = ts.createProgram(parsed.fileNames, parsed.options, host);
program.getSourceFiles().forEach(function (sf) {
    console.log(sf.fileName);
});
