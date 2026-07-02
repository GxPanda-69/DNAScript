import { Tokenizer } from "./tokenizer";

let tokenizer = new Tokenizer("TCGG C AHello World !A G");
tokenizer.tokenize();

tokenizer.tokens.forEach((token) => {
  console.log(token);
});
