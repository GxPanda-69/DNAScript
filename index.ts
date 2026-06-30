import { Tokenizer } from "./tokenizer";

let tokenizer = new Tokenizer("GAG GTG")
console.log(tokenizer.tokenize());

tokenizer.tokens.forEach((token) => {
  console.log(token)
});