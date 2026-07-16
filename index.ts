import { Parser } from "./parser";
import { Tokenizer } from "./tokenizer";

let tokenizer = new Tokenizer(`
  TCGG C AHello World !A AThis is a test lmaoA G`);
tokenizer.tokenize();

let parser = new Parser(tokenizer.tokens);
parser.parseTokens();

parser.ast.root.forEach((node) => console.log(node));
