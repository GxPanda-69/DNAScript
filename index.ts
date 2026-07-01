import { Tokenizer } from "./tokenizer";

let tokenizer = new Tokenizer("TCGG C AHelloA G");
tokenizer.tokenize();

tokenizer.tokens.forEach((token) => {
  console.log(token);
});
