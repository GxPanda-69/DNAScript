import { Tokenizer } from "./tokenizer";

let tokenizer = new Tokenizer("GAG GTG")
tokenizer.tokenize();

tokenizer.tokens.forEach((token) => {
  console.log(token)
});