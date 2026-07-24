import { Parser } from "./parser";
import { Tokenizer } from "./tokenizer";

let tokenizer = new Tokenizer(`GC HelloWorldFunc AA CT TCGG C Message G TC`);

console.log("=== TOKENIZATION OUTPUT IN");
tokenizer.tokenize();
console.log("=== TOKENIZATION OUTPUT OUT");

console.log("=== TOKENS IN ===");
tokenizer.tokens.forEach((token) => console.log(token));
console.log("=== TOKENS OUT ===");

let parser = new Parser(tokenizer.tokens);

console.log("=== PARSING OUTPUT IN ===");
parser.parseTokens();
console.log("=== PARSING OUTPUT OUT ===");

console.log("=== AST IN ===");
parser.ast.root.forEach((node) => console.dir(node, { depth: 100 }));
console.log("=== AST OUT ===");
