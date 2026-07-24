import { Parser } from "./parser";
import { Tokenizer } from "./tokenizer";

let tokenizer = new Tokenizer(`
  GC titi AA AHelloA`);
tokenizer.tokenize();

let parser = new Parser(tokenizer.tokens);
parser.parseTokens();

parser.ast.root.forEach((node) => console.log(node));
