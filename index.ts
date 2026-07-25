import { Interpreter } from "./interpreter";
import { Parser } from "./parser";
import { Tokenizer } from "./tokenizer";

let tokenizer = new Tokenizer(`
GC MessageContent AA AHello WorldA
GC HelloWorldFunc AA CT
  C Message G
  TCGG C Message G
TC
HelloWorldFunc C MessageContent G
MessageContent AA AHello World number twoA
HelloWorldFunc C MessageContent G
`);

console.log("=== TOKENIZATION OUTPUT IN");
tokenizer.tokenize();
console.log("=== TOKENIZATION OUTPUT OUT");

console.log("=== TOKENS IN ===");
let idx = 0;
tokenizer.tokens.forEach((token) => {
  idx++;
  console.log(idx, token);
});
console.log("=== TOKENS OUT ===");

let parser = new Parser(tokenizer.tokens);

console.log("=== PARSING OUTPUT IN ===");
parser.parseTokens();
console.log("=== PARSING OUTPUT OUT ===");

console.log("=== AST IN ===");
console.dir(parser.ast, { depth: 256 });
console.log(JSON.stringify(parser.ast));
console.log("=== AST OUT ===");

console.log("=== INTERPRETER IN ===");
const interpreter = new Interpreter();
interpreter.Execute(parser.ast);
console.log("=== INTERPRETER OUT ===");
