import * as ts from "typescript";

const {config} = ts.readConfigFile("project/tsconfig.json", ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config, {readDirectory: ts.sys.readDirectory}, "project");
const host = ts.createCompilerHost(parsed.options, true);
const program = ts.createProgram(parsed.fileNames, parsed.options, host);
program.getSourceFiles().forEach(sf => {
  console.log(sf.fileName);
});
