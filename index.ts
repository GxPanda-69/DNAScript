import { Parser } from "./parser";
import { Tokenizer } from "./tokenizer";

let tokenizer = new Tokenizer(`
  TCGG C AHello World !A G TCGG C AThis is a testA G`);
tokenizer.tokenize();

tokenizer.tokens.forEach((token) => {
  console.log(token);
});

let parser = new Parser(tokenizer.tokens);
parser.parseTokens();